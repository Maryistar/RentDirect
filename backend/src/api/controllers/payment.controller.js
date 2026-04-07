import paypalClient from '../../services/paypal.service.js';
import paypal from '@paypal/checkout-server-sdk';
import { generateInvoice } from "../../services/invoice.service.js";
import { sendInvoiceEmail } from "../../services/email.service.js";
import { getUserById } from "../../repositories/users.repository.js";
import db from '../../config/db.js';

// Crear orden PayPal
export const createOrder = async (req, res) => {
  try {
    const { type } = req.body;
    console.log("TIPO:", type);

    let value = "5.00";
    let description = "Publicación de propiedad";

    if (type === "premium") {
      value = "20.00";
      description = "Plan Premium 🔥";
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value },
          description,
        },
      ],
    });

    const order = await paypalClient.execute(request);

    res.json({ id: order.result.id });

  } catch (err) {
    console.error("Error creando orden:", err);
    res.status(500).json({ error: "Error creando orden" });
  }
};

// Capturar orden y guardar factura
export const captureOrder = async (req, res) => {
  try {
    const { orderID, type } = req.body;
    const user = req.user;

    const fullUser = await getUserById(user.id);
    let amount = type === "premium" ? "20.00" : "5.00";

    // Generar factura
    let invoicePath = null;
    try {
      invoicePath = await generateInvoice({
        user: fullUser,
        type,
        orderID,
        amount
      });

      const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

      // Enviar al usuario
      await sendInvoiceEmail(
        fullUser.email,
        "Factura de tu pago 💳",
        "Adjunto encontrarás tu factura.",
        invoicePath
      );

      // Enviar al admin
      await sendInvoiceEmail(
        adminEmail,
        "Nueva factura generada 📄",
        `El usuario ${fullUser.email} realizó un pago.`,
        invoicePath
      );

      // ✅ Guardar en DB
      await db.query(
        `INSERT INTO invoices (user_id, property_data, total, status, paypal_order_id, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          JSON.stringify({ type, amount, invoicePath }),
          amount,
          "completed",
          orderID,
          new Date()
        ]
      );

    } catch (invoiceError) {
      console.error("🔥 ERROR FACTURA:", invoiceError);
    }

    // Marcar usuario premium si aplica
    if (type === "premium") {
      const premiumUntil = new Date();
      premiumUntil.setDate(premiumUntil.getDate() + 30);

      await db.query(
        `UPDATE users 
         SET is_premium = 1, premium_until = ? 
         WHERE id = ?`,
        [premiumUntil, user.id]
      );
    }

    return res.json({ status: "COMPLETED" });

  } catch (err) {
    console.error("🔥 ERROR CAPTURANDO ORDEN:", err);
    res.status(500).json({ error: err.message });
  }
};