import express from 'express';
import { createOrder, captureOrder } from '../controllers/payment.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { getAllInvoices } from '../../repositories/invoices.repository.js'; 

const router = express.Router();

router.post('/payments/create-order', authenticate, createOrder);
router.post('/payments/capture-order', authenticate, captureOrder);
// Obtener todas las facturas
// Endpoint para obtener todas las facturas
router.get('/admin/invoices', async (req, res) => {
  try {
    const invoices = await getAllInvoices();
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    res.status(500).json({ success: false, message: "Error cargando facturas" });
  }
});


export default router;