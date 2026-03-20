import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import * as chatController from '../controllers/chat.controller.js';


const router = express.Router();

// iniciar chat (owner)
router.post('/chats', authenticate, chatController.startChat);


router.get('/chats/:chatId', authenticate, chatController.getChatInfo);

// obtener mis chats
router.get('/chats', authenticate, chatController.getMyChats);

// obtener mensajes de un chat
router.get('/chats/:chatId/messages', authenticate, chatController.getMessages);

// enviar mensaje
router.post('/chats/messages', authenticate, chatController.sendMessage);



export default router;