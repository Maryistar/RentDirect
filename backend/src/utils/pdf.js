import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateContractPDF(contract) {

  const doc = new PDFDocument({ margin: 50 });

  const fileName = `contract_${contract.id}.pdf`;
  const filePath = path.join("uploads/contracts", fileName);

  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // 🟦 TÍTULO
  doc
    .fontSize(18)
    .text("CONTRATO DE ARRENDAMIENTO", { align: "center" });

  doc.moveDown(2);

  doc.fontSize(12);

  // 🟩 FORMATEAR FECHAS
  const startDate = new Date(contract.start_date).toLocaleDateString("es-CO");
  const endDate = new Date(contract.end_date).toLocaleDateString("es-CO");

  // 🟩 CALCULAR DURACIÓN
  const start = new Date(contract.start_date);
  const end = new Date(contract.end_date);
  const months = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24 * 30)));

  // 🟦 INFORMACIÓN GENERAL
  doc.text(`Fecha de inicio: ${startDate}`);
  doc.text(`Fecha de finalización: ${endDate}`);
  doc.text(`Duración: ${months} meses`);
  doc.text(`Canon mensual: $${contract.monthly_price}`);

  doc.moveDown();

  // 🟦 PARTICIPANTES (si luego haces JOIN aquí cambiará automático)
  doc.text(`Arrendador: ${contract.owner_name || "Propietario"}`);
  doc.text(`Arrendatario: ${contract.tenant_name || "Inquilino"}`);

  doc.moveDown();

  // 🟦 INMUEBLE
  doc.text("INFORMACIÓN DEL INMUEBLE", { underline: true });
  doc.moveDown(0.5);

  doc.text(`Dirección: ${contract.property_address || "No especificada"}`);
  doc.text(`Descripción: ${contract.property_description || "No especificada"}`);

  doc.moveDown();

  // 🟦 PAGOS
  doc.text("CONDICIONES ECONÓMICAS", { underline: true });
  doc.moveDown(0.5);

  doc.text(`Método de pago: ${contract.payment_method || "No especificado"}`);

  let utilities = [];
  try {
    utilities = JSON.parse(contract.utilities || "[]");
  } catch (e) {}

  doc.text(`Servicios incluidos: ${utilities.length ? utilities.join(", ") : "Ninguno"}`);

  doc.moveDown();

  // 🟦 CLÁUSULAS
  doc.text("CLÁUSULAS", { underline: true });
  doc.moveDown(0.5);

  doc.text(`1. Uso del inmueble: ${contract.use_clause || "El inmueble será destinado para vivienda."}`);
  doc.text(`2. Reparaciones: ${contract.repairs_clause || "Las reparaciones por uso normal serán asumidas por el arrendador."}`);
  doc.text(`3. Terminación: ${contract.termination_clause || "El contrato podrá terminarse con previo aviso de 30 días."}`);

  doc.moveDown();

  // 🟦 EXTRA
  doc.text("OTROS TÉRMINOS", { underline: true });
  doc.moveDown(0.5);

  doc.text(contract.terms || "No hay términos adicionales.");

  doc.moveDown(2);

  // 🟦 FIRMAS
  doc.text("____________________________");
  doc.text("Firma Arrendador");

  doc.moveDown();

  doc.text("____________________________");
  doc.text("Firma Arrendatario");

  doc.moveDown();

  doc.text(`Estado del contrato: ${contract.status}`);

  doc.end();

  return { fileName, filePath };
}