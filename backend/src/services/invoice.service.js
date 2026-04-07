import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateInvoice({ user, type, orderID, amount }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();

      const fileName = `invoice_${orderID}.pdf`;
      const filePath = path.join("uploads", fileName);

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // 🧾 CONTENIDO
      doc.fontSize(20).text("RentDirect - Factura", { align: "center" });

      doc.moveDown();
      doc.fontSize(12).text(`Factura ID: ${orderID}`);
      doc.text(`Fecha: ${new Date().toLocaleString()}`);

      doc.moveDown();
      doc.text(`Cliente: ${user.name || "Usuario"}`);
      doc.text(`Email: ${user.email}`);

      doc.moveDown();
      doc.text(`Tipo de compra: ${type === "premium" ? "Plan Premium" : "Publicación"}`);
      doc.text(`Total: $${amount} USD`);

      doc.moveDown();
      doc.text("Gracias por usar RentDirect 💙", { align: "center" });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);

    } catch (err) {
      reject(err);
    }
  });
}