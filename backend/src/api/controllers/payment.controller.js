import paypalClient from '../../services/paypal.service.js';
import paypal from '@paypal/checkout-server-sdk';

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

    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await paypalClient.execute(request);

    const user = req.user;
    const { type } = req.body;

    // 🔥 PLAN PREMIUM
    if (type === "premium") {

      const premiumUntil = new Date();
      premiumUntil.setDate(premiumUntil.getDate() + 30);

      await db.query(
        `UPDATE users 
     SET is_premium = 1, premium_until = ? 
     WHERE id = ?`,
        [premiumUntil, user.id]
      );

      return res.json({
        status: "COMPLETED",
        message: "Plan premium activado"
      });
    }

    // 🔥 PAGO POR PUBLICACIÓN
    return res.json({
      status: "COMPLETED",
      message: "Pago exitoso, ya puedes publicar"
    });

  } catch (err) {
    res.status(500).json({ error: "Error capturando pago" });
  }
};