import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateContractPDF(contract) {

  const doc = new PDFDocument({ margin: 50 });

  const fileName = `contract_${contract.id}.pdf`;
  const filePath = path.join("uploads/contracts", fileName);

  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // 🔥 Título
  doc.fontSize(18).text("CONTRATO DE ARRENDAMIENTO", { align: "center" });
  doc.moveDown(2);

  // 🔹 Datos
  doc.fontSize(12);

  doc.text(`Fecha inicio: ${contract.start_date}`);
  doc.text(`Fecha fin: ${contract.end_date}`);
  doc.text(`Valor mensual: $${contract.monthly_price}`);
  doc.moveDown();

  // 🔥 Cálculo simple duración
  const start = new Date(contract.start_date);
  const end = new Date(contract.end_date);
  const months = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));

  doc.text(`Duración del contrato: ${months} meses`);
  doc.moveDown();

  // 🔹 Participantes (por ahora IDs)
  doc.text(`Arrendador (Owner ID): ${contract.owner_id}`);
  doc.text(`Arrendatario (Tenant ID): ${contract.tenant_id}`);
  doc.moveDown();

  // 🔥 Cláusulas PRO
  doc.text("CLÁUSULAS:", { underline: true });
  doc.moveDown();

  doc.text("1. El inmueble se entrega en buen estado.");
  doc.text("2. El arrendatario se compromete al pago puntual.");
  doc.text("3. El contrato puede cancelarse con previo aviso de 30 días.");
  doc.text("4. No se permite subarrendar sin autorización.");
  doc.moveDown();

  doc.text(`Estado actual: ${contract.status}`);

  doc.end();

  return { fileName, filePath };
}