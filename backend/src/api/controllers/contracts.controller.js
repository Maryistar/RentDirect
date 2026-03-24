import * as contractService from '../../services/contracts.service.js';

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