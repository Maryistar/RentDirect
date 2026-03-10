import * as chatRepo from '../repositories/chat.repository.js';
import * as propertyRepo from '../repositories/properties.repository.js';
import * as applicationRepo from '../repositories/applications.repository.js';

export async function startChat({ propertyId, ownerId, tenantId }) {

  const property = await propertyRepo.findPropertyById(propertyId);

  if (!property || property.owner_id !== ownerId) {
    throw { status: 403, message: 'You are not the owner of this property' };
  }

  const application = await applicationRepo.findExistingApplication(propertyId, tenantId);

  if (!application) {
    throw { status: 400, message: 'No application found for this tenant' };
  }

  const existing = await chatRepo.findExistingChat(propertyId, ownerId, tenantId);

  if (existing) {
    return existing;
  }

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
