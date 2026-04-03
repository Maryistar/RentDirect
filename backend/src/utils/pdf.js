import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateContractPDF(contract) {

  const doc = new PDFDocument({ margin: 50 });

  const fileName = `contract_${contract.id}.pdf`;
  const filePath = path.join("uploads/contracts", fileName);

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // 🟩 FORMATEOS
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-CO");

  const formatDateTime = () =>
    new Date().toLocaleString("es-CO");

  const formatMoney = (value) =>
    new Intl.NumberFormat("es-CO").format(value);

  // 🟩 CALCULAR DURACIÓN
  const start = new Date(contract.start_date);
  const end = new Date(contract.end_date);
  const months = Math.max(
    1,
    Math.round((end - start) / (1000 * 60 * 60 * 24 * 30))
  );

  // 🔵 HEADER
  doc
    .fontSize(18)
    .text("CONTRATO DE ARRENDAMIENTO", { align: "center" });

  doc.moveDown(0.5);

  doc
    .fontSize(10)
    .text(`Generado el: ${formatDateTime()}`, { align: "right" });

  doc.moveDown(1.5);

  // 🔵 INFORMACIÓN GENERAL
  doc.fontSize(12).text("INFORMACIÓN GENERAL", { underline: true });
  doc.moveDown(0.5);

  doc.text(`Fecha de inicio: ${formatDate(contract.start_date)}`);
  doc.text(`Fecha de finalización: ${formatDate(contract.end_date)}`);
  doc.text(`Duración: ${months} meses`);
  doc.text(`Canon mensual: $${formatMoney(contract.monthly_price)}`);

  doc.moveDown();

  // 🔵 PARTES
  doc.text("PARTES DEL CONTRATO", { underline: true });
  doc.moveDown(0.5);

  doc.text(`Arrendador: ${contract.owner_name || "Propietario"}`);
  doc.text(`Arrendatario: ${contract.tenant_name || "Inquilino"}`);

  doc.moveDown();

  // 🔵 INMUEBLE
  doc.text("INFORMACIÓN DEL INMUEBLE", { underline: true });
  doc.moveDown(0.5);

  doc.text(`Dirección: ${contract.property_address || "No especificada"}`);
  doc.text(`Descripción: ${contract.property_description || "No especificada"}`);

  doc.moveDown();

  // 🔵 PAGOS
  doc.text("CONDICIONES ECONÓMICAS", { underline: true });
  doc.moveDown(0.5);

  doc.text(`Método de pago: ${contract.payment_method || "No especificado"}`);

  let utilities = [];
  try {
    utilities = JSON.parse(contract.utilities || "[]");
  } catch (e) {}

  doc.text(
    `Servicios incluidos: ${
      utilities.length ? utilities.join(", ") : "Ninguno"
    }`
  );

  doc.moveDown();

  // 🔵 CLÁUSULAS
  doc.text("CLÁUSULAS", { underline: true });
  doc.moveDown(0.5);

  doc.text(
    `1. Uso del inmueble: ${
      contract.use_clause ||
      "El inmueble será destinado para vivienda."
    }`
  );

  doc.text(
    `2. Reparaciones: ${
      contract.repairs_clause ||
      "Las reparaciones por uso normal serán asumidas por el arrendador."
    }`
  );

  doc.text(
    `3. Terminación: ${
      contract.termination_clause ||
      "Se debe avisar con 45 días de anticipación para terminar el contrato."
    }`
  );

  doc.text(
    `4.  ${
      contract.termination_clause ||
      "El arrendatario se compromete a cuidar el inmueble."
    }`
  );

  doc.text(
    `5.  ${contract.termination_clause ||
    "No se permite subarrendar sin autorización."
    }`
  );

  doc.text(
    `6.  ${
      contract.termination_clause ||
      "El incumplimiento dará lugar a terminación del contrato."
    }`
  );

  doc.moveDown();

  // 🔵 OTROS
  doc.text("OTROS TÉRMINOS", { underline: true });
  doc.moveDown(0.5);

  doc.text(contract.terms || "No hay términos adicionales.");

  doc.moveDown(2);


  // 🔵 FIRMAS
  doc.text("FIRMAS", { underline: true });
  doc.moveDown(2);

  // 🧑 Arrendador
  doc.text("Arrendador", { underline: true });
  doc.text(`Nombre: ${contract.owner_name}`);
  doc.text(`C.C: ${contract.owner_document || "No especificado"}`);

  doc.moveDown(2);

  // 🧑 Arrendatario
  doc.text("Arrendatario", { underline: true });
  doc.text(`Nombre: ${contract.tenant_name}`);
  doc.text(`C.C: ${contract.tenant_document || "No especificado"}`);

  doc.moveDown(2);

  // 🔵 ESTADO
  doc.fontSize(10).text(`Estado del contrato: ${contract.status}`);

  doc.end();

  return { fileName, filePath };
}