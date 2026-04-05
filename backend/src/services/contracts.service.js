import * as contractRepository from "../repositories/contracts.repository.js";
import * as chatRepo from '../repositories/chat.repository.js';
import * as applicationRepo from '../repositories/applications.repository.js';
import * as documentRepository from "../repositories/documents.repository.js";
import * as propertyRepository from "../repositories/properties.repository.js";
import { generateContractPDF } from "../utils/pdf.js";
import fs from "fs";
import path from "path";
import * as userRepository from "../repositories/users.repository.js";
import db from "../config/db.js";


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

  //  Obtener datos reales
  const property = await propertyRepository.findById(chat.property_id);
  const owner = await userRepository.findById(chat.owner_id);
  const tenant = await userRepository.findById(chat.tenant_id);


  return await contractRepository.createContract({
    chatId: data.chatId,
    propertyId: chat.property_id,
    ownerId: chat.owner_id,
    tenantId: chat.tenant_id,

    startDate: data.startDate,
    endDate: data.endDate,

    monthlyPrice: data.price,
    propertyAddress: property.address,
    propertyDescription: property.description,

    ownerName: owner.name,
    tenantName: tenant.name,

    ownerEmail: owner.email,
    tenantEmail: tenant.email,
    ownerDocument: owner.cedula,
    tenantDocument: tenant.cedula,

    inventory: JSON.stringify(data.inventory || []),

    paymentMethod: data.paymentMethod,
    utilities: JSON.stringify(data.utilities),

    useClause: data.use,
    repairsClause: data.repairs,
    terminationClause: data.termination,


    terms: data.terms
  });
}
export async function getContractByChat(chatId) {
  return await contractRepository.findByChatId(chatId);
}

export async function acceptContract(id, userId) {
  const contract = await contractRepository.findById(id);

  // 
  const owner = await userRepository.findById(contract.owner_id);
  const tenant = await userRepository.findById(contract.tenant_id);

  // 
  contract.owner_name = owner.name;
  contract.tenant_name = tenant.name;

  contract.owner_document = owner.cedula;
  contract.tenant_document = tenant.cedula;

  if (!contract) throw new Error("Contrato no encontrado");

  // 1️⃣ Activar contrato
  await contractRepository.updateStatus(id, "active");

  // 2️⃣ Propiedad a rented
  await propertyRepository.updateStatus(contract.property_id, "rented");

  // 3️⃣ Aplicaciones
  const application = await applicationRepo.findExistingApplication(
    contract.property_id,
    contract.tenant_id
  );

  if (application) {
    await applicationRepo.rejectOtherApplications(
      contract.property_id,
      application.id
    );
  }

  // 
  const pdf = generateContractPDF(contract);

  await documentRepository.createDocument({
    contract_id: contract.id,
    user_id: contract.tenant_id, // 🔥 CLAVE
    url: `http://localhost:4000/${pdf.filePath.replace(/\\/g, "/")}`,
    type: "contract"
  });

  // 
  await documentRepository.createDocument({
    contract_id: contract.id,
    user_id: contract.owner_id,
    url: `http://localhost:4000/${pdf.filePath.replace(/\\/g, "/")}`,
    type: "contract"
  });

  return { message: "Contrato aceptado con PDF generado" };
}

export async function getContractById(id) {
  return await contractRepository.findById(id);
}

export const rejectContract = async (id) => {
  await db.query(
    "UPDATE contracts SET status = 'rejected' WHERE id = ?",
    [id]
  );
};