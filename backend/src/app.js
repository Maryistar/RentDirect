import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

import chatRoutes from './api/routes/chat.routes.js';
import rentalRoutes from './api/routes/rental.routes.js';
import contractsRoutes from './api/routes/contracts.routes.js';
import usersRoutes from './api/routes/users.routes.js';
import propertiesRoutes from './api/routes/properties.routes.js';
import applicationsRoutes from './api/routes/applications.routes.js';
import authRoutes from "./api/routes/auth.routes.js";

import * as chatService from './services/chat.service.js';



//  FIX __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  CREAR APP
const app = express();

//  MIDDLEWARES
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(bodyParser.json());

// 🔥 ARCHIVOS ESTÁTICOS
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use("/uploads", express.static(path.resolve("uploads")));

// ================================
// RUTAS
// ================================
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/properties', propertiesRoutes);
app.use('/api/v1', applicationsRoutes);
app.use('/api/v1', chatRoutes);
app.use('/api/v1/rental-records', rentalRoutes);
app.use('/api/v1/contracts', contractsRoutes);

// ================================
// ERROR HANDLER
// ================================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});

// ================================
// SOCKET.IO
// ================================
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const chatNamespace = io.of('/chat');

chatNamespace.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error('Unauthorized'));

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload;
    next();

  } catch (err) {
    next(new Error('Unauthorized'));
  }
});

chatNamespace.on('connection', (socket) => {
  console.log('User connected:', socket.user.id);

  socket.on('join', ({ chatId }) => {
    socket.join(`chat_${chatId}`);
  });

  socket.on('sendMessage', async ({ chatId, message }) => {
    try {

      const newMessage = await chatService.createMessage({
        chatId,
        senderId: socket.user.id,
        message
      });

      chatNamespace.to(`chat_${chatId}`).emit('newMessage', {
        id: newMessage.id,
        chatId,
        senderId: socket.user.id,
        message,
        createdAt: new Date(),
        name: newMessage.name
      });

    } catch (err) {
      console.error(err);
    }
  });
});

// ================================
// START SERVER
// ================================
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);