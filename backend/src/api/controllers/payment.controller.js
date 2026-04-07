import paypalClient from '../../services/paypal.service.js';
import paypal from '@paypal/checkout-server-sdk';
import { generateInvoice } from "../../services/invoice.service.js";
import { sendInvoiceEmail } from "../../services/email.service.js";
import { getUserById } from "../../repositories/users.repository.js";
import db from '../../config/db.js';


export const createOrder = async (req, res) => {
  try {

    // 🔥 NUEVO (recibir tipo)
    const { type } = req.body;
    console.log("TIPO:", type);

    // 🔥 NUEVO (definir precio dinámico)
    let value = "5.00";
    let description = "Publicación de propiedad";

    if (type === "premium") {
      value = "20.00";
      description = "Plan Premium 🔥";
    }

     // 🔥 ESTA LÍNEA FALTABA
    const request = new paypal.orders.OrdersCreateRequest();

    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: value, // 👈 dinámico
          },
          description: description, // 👈 opcional pero PRO
        },
      ],
    });

    const order = await paypalClient.execute(request);

    res.json({
      id: order.result.id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando orden" });
  }
};


export const captureOrder = async (req, res) => {
  try {

    const { orderID, type } = req.body;
    const user = req.user;

    // 🔥 obtener usuario completo
    const fullUser = await getUserById(user.id);

    // 🔥 definir monto
    let amount = type === "premium" ? "20.00" : "5.00";

    // 🔥 generar factura
    let invoicePath = null;

    try {
      invoicePath = await generateInvoice({
        user: fullUser,
        type,
        orderID,
        amount
      });

      const adminEmail = process.env.ADMIN_EMAIL || "tuemail@gmail.com";

      await sendInvoiceEmail(
        fullUser.email,
        "Factura de tu pago 💳",
        "Adjunto encontrarás tu factura.",
        invoicePath
      );

      await sendInvoiceEmail(
        adminEmail,
        "Nueva factura generada 📄",
        `El usuario ${fullUser.email} realizó un pago.`,
        invoicePath
      );

    } catch (invoiceError) {
      console.error("🔥 ERROR FACTURA:", invoiceError);
    }

    // 🔥 PREMIUM
    if (type === "premium") {
      const premiumUntil = new Date();
      premiumUntil.setDate(premiumUntil.getDate() + 30);

      await db.query(
        `UPDATE users 
         SET is_premium = 1, premium_until = ? 
         WHERE id = ?`,
        [premiumUntil, user.id]
      );

      return res.json({ status: "COMPLETED" });
    }

    return res.json({ status: "COMPLETED" });

  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};