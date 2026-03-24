import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateContractPDF(contract) {

  const doc = new PDFDocument();

  const fileName = `contract_${contract.id}.pdf`;
  const filePath = path.join("uploads/contracts", fileName);

  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.text("CONTRATO DE ARRENDAMIENTO");
  doc.moveDown();

  doc.text(`Propiedad: ${contract.property_id}`);
  doc.text(`Arrendador: ${contract.owner_id}`);
  doc.text(`Arrendatario: ${contract.tenant_id}`);
  doc.text(`Estado: ${contract.status}`);

  doc.end();

  return { fileName, filePath };
}