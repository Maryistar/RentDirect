import * as chatService from '../../services/chat.service.js';

// 🔹 Iniciar conversación
export async function startChat(req, res, next) {
  try {
    const { propertyId, tenantId } = req.body;

    if (!propertyId || !tenantId) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const ownerId = req.user.id; // viene del JWT

    const chat = await chatService.startChat({
      propertyId,
      ownerId,
      tenantId
    });

    res.status(201).json(chat);

  } catch (err) {
    next(err);
  }
}


// 🔹 Obtener mis chats
export async function getMyChats(req, res, next) {
  try {
    const userId = req.user.id;

    const chats = await chatService.getMyChats(userId);

    res.json(chats);

  } catch (err) {
    next(err);
  }
}


// 🔹 Obtener mensajes de un chat
export async function getMessages(req, res, next) {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const messages = await chatService.getMessages(chatId, userId);

    res.json(messages);

  } catch (err) {
    next(err);
  }
}