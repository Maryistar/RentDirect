import * as contractService from '../../services/contracts.service.js';
import * as documentRepository from '../../repositories/documents.repository.js';

export async function create(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const contractId = await contractService.createContract(
      req.body,
      req.user.id
    );

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
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    const filePath = document.url.replace("http://localhost:4000/", "");

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