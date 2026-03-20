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

export async function getChatInfo(req, res, next) {
  try {
    const result = await chatService.getChatInfo(
      req.params.chatId,
      req.user.id
    );

    res.json(result);

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

export async function sendMessage(req, res, next) {
  try {

    const { chatId, content } = req.body;

    const senderId = req.user.id;

    const messageId = await chatService.createMessage({
      chatId,
      senderId,
      message: content
    });

    res.status(201).json({
      id: messageId
    });

  } catch (err) {
    next(err);
  }
}