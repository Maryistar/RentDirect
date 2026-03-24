import * as contractRepository from "../repositories/contracts.repository.js";
import * as chatRepo from '../repositories/chat.repository.js';
import * as applicationRepo from '../repositories/applications.repository.js';
import * as documentRepository from "../repositories/documents.repository.js";
import * as propertyRepository from "../repositories/properties.repository.js";
import { generateContractPDF } from "../utils/pdf.js";
import fs from "fs";
import path from "path";



export async function createContract(data, userId) {

  const chats = await chatRepo.getUserChats(userId);
  const chat = chats.find(c => c.id == data.chatId);

  if (!chat) {
    throw { status: 403, message: 'No access to this chat' };
  }

  const application = await applicationRepo.findExistingApplication(
    chat.property_id,
    chat.tenant_id
  );

  if (!application) {
    throw { status: 400, message: "Application not found" };
  }

  if (chat.owner_id !== userId) {
    throw { status: 403, message: 'Only owner can create contract' };
  }

  return await contractRepository.createContract({
    chatId: data.chatId,
    propertyId: chat.property_id,
    ownerId: chat.owner_id,
    tenantId: chat.tenant_id,
    startDate: data.startDate,
    endDate: data.endDate,
    monthlyPrice: data.monthlyPrice,
    terms: data.terms
  });
}

export async function getContractByChat(chatId) {
  return await contractRepository.findByChatId(chatId);
}

export async function acceptContract(id, userId) {
  const contract = await contractRepository.findById(id);

  if (!contract) throw new Error("Contrato no encontrado");

  // 1️⃣ Actualizar contrato
  await contractRepository.updateStatus(id, "active");

  // 2️⃣ Actualizar propiedad a rented
  await propertyRepository.updateStatus(contract.property_id, "rented");

  // 3️⃣ Opcional: rechazar otras aplicaciones
  await applicationRepo.rejectOtherApplications(contract.property_id, contract.tenant_id);

  return { message: "Contrato aceptado y propiedad actualizada a rented" };
}