import * as chatRepo from '../repositories/chat.repository.js';

// 🔹 Crear conversación (cuando el owner da clic en "Iniciar conversación")
export async function startChat({ propertyId, ownerId, tenantId }) {
  
  // 1️⃣ Verificar si ya existe
  const existing = await chatRepo.findExistingChat(propertyId, ownerId, tenantId);

  if (existing) {
    return existing;
  }

  // 2️⃣ Crear nuevo chat
  const chatId = await chatRepo.createChat({
    propertyId,
    ownerId,
    tenantId
  });

  return {
    id: chatId,
    property_id: propertyId,
    owner_id: ownerId,
    tenant_id: tenantId
  };
}


// 🔹 Obtener chats del usuario autenticado
export async function getMyChats(userId) {
  return await chatRepo.getUserChats(userId);
}


// 🔹 Obtener mensajes de un chat
export async function getMessages(chatId, userId) {

  const chats = await chatRepo.getUserChats(userId);
  const chat = chats.find(c => c.id == chatId);

  if (!chat) {
    throw { status: 403, message: 'Access denied to this chat' };
  }

  return await chatRepo.getChatMessages(chatId);
}


// 🔹 Guardar mensaje (lo usaremos luego en socket)
export async function createMessage({ chatId, senderId, message }) {

  if (!message || message.trim() === '') {
    throw { status: 400, message: 'Message cannot be empty' };
  }

  const messageId = await chatRepo.saveMessage({
    chatId,
    senderId,
    message
  });

  return messageId;
}