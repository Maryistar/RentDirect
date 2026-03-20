import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import chatRoutes from './api/routes/chat.routes.js';
import rentalRoutes from './api/routes/rental.routes.js';

dotenv.config({ path: './.env' });

// Necesario para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './api/routes/auth.routes.js';
import usersRoutes from './api/routes/users.routes.js';
import propertiesRoutes from './api/routes/properties.routes.js';
import applicationsRoutes from './api/routes/applications.routes.js';

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(bodyParser.json());

/* ================================
   SERVIR IMÁGENES LOCALES
================================ */
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

/* ================================
   RUTAS
================================ */

// health check
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/properties', propertiesRoutes);
app.use('/api/v1', applicationsRoutes);
app.use('/api/v1', chatRoutes);
app.use('/api/v1/rental-records', rentalRoutes);

/* ================================
   ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});

/* ================================
   SOCKET.IO
================================ */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

import jwt from 'jsonwebtoken';
import * as chatService from './services/chat.service.js';
import pool from './config/db.js'; // 👈 IMPORTANTE para traer nombre

const chatNamespace = io.of('/chat');

// 🔐 AUTH SOCKET
chatNamespace.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload;

    next();
  } catch (err) {
    next(new Error('Unauthorized'));
  }
});

// 🔥 CONEXIÓN
chatNamespace.on('connection', (socket) => {

  console.log('User connected:', socket.user.id);

  // 🔹 Unirse al chat
  socket.on('join', ({ chatId }) => {
    socket.join(`chat_${chatId}`);
  });

  // 🔹 Escribiendo...
  socket.on('typing', ({ chatId }) => {
    socket.to(`chat_${chatId}`).emit('typing', {
      userId: socket.user.id
    });
  });

  socket.on('stopTyping', ({ chatId }) => {
    socket.to(`chat_${chatId}`).emit('stopTyping');
  });

  // 🔹 Enviar mensaje
  socket.on('sendMessage', async ({ chatId, message }) => {
    try {

      // guardar en DB
      const messageId = await chatService.createMessage({
        chatId,
        senderId: socket.user.id,
        message
      });

      // 🔥 TRAER NOMBRE DEL USUARIO
      const [rows] = await pool.execute(
        `SELECT name FROM users WHERE id = ?`,
        [socket.user.id]
      );

      const userName = rows[0]?.name || 'Usuario';

      // 🔥 MENSAJE COMPLETO
      const newMessage = {
        id: messageId,
        chatId,
        sender_id: socket.user.id,
        name: userName, // 👈 ESTE ES EL FIX DEL NOMBRE
        message,
        created_at: new Date()
      };

      // 🔥 EMITIR A TODOS
      chatNamespace.to(`chat_${chatId}`).emit('newMessage', newMessage);

    } catch (err) {
      console.error(err);
    }
  });

  // 🔹 Desconexión
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.id);
  });

});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 4000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);