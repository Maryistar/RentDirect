import * as contractService from '../../services/contracts.service.js';
import * as documentRepository from '../../repositories/documents.repository.js';
import { fetchContracts } from "../../repositories/contracts.repository.js";
import { fetchDocuments } from "../../repositories/documents.repository.js";
import path from "path";

export async function create(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const contractId = await contractService.createContract(
      req.body,
      req.user.id
    );
    await fetchContracts();
    res.json({ id: contractId });

  } catch (error) {
    console.error("💥 ERROR CREATE:", error);

    res.status(error.status || 500).json({
      message: error.message
    });
  }
}

export async function getByChat(req, res) {
  try {

    const { chatId } = req.params;

    const contract = await contractService.getContractByChat(chatId);

    res.json(contract);

  } catch (error) {
    console.error("💥 ERROR GET BY CHAT:", error);

    res.status(500).json({
      message: error.message
    });
  }
}

export async function accept(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const { id } = req.params;

    const result = await contractService.acceptContract(id, req.user.id);
    await fetchContracts(); //  para ver "active"
    await fetchDocuments(); // para ver el nuevo documento

    res.json(result);

  } catch (error) {
    console.error("💥 ERROR ACCEPT:", error);

    res.status(error.status || 500).json({
      message: error.message || "Error al aceptar contrato"
    });
  }
}

export async function downloadPDF(req, res) {
  try {

    const { id } = req.params;

    const document = await documentRepository.findByContractId(id);

   if (!document) {
    return res.status(404).json({
      message: "Este contrato no tiene PDF generado"
    });
  }

    const relativePath = document.url.replace("http://localhost:4000/", "");
    const filePath = path.resolve(relativePath);

    res.download(filePath);

  } catch (error) {
    console.error("💥 ERROR PDF:", error);

    res.status(500).json({
      message: "Error descargando PDF"
    });
  }
}

export async function getMyDocuments(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const documents = await documentRepository.findByUserId(req.user.id);

    res.json(documents);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo documentos" });
  }
}

export async function getAll(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const contracts = await fetchContracts();

    res.json(contracts);

  } catch (error) {
    console.error(" ERROR GET ALL CONTRACTS:", error);

    res.status(500).json({
      message: "Error obteniendo contratos"
    });
  }
}

export async function reject(req, res) {
  try {
    const { id } = req.params;

    await contractService.rejectContract(id);

    res.json({ message: "Contrato rechazado" });

  } catch (error) {
    console.error("💥 ERROR REJECT:", error);
    res.status(500).json({ message: "Error al rechazar contrato" });
  }
}