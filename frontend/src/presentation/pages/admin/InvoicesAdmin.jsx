import { useEffect, useState } from "react";
import axios from "axios";

export default function InvoicesAdmin() {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/admin/invoices");
        if(data.success) setFacturas(data.data);

        console.log("Facturas recibidas:", data.data);
      } catch (error) {
        console.error("Error al cargar facturas", error);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div>
      <h2>Facturas Recientes</h2>
      <table className="table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Usuario</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Fecha</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Factura PDF</th>
          </tr>
        </thead>
              <tbody>
                  {facturas.map(f => (
                      <tr key={f.id}>
                          <td className="border px-4 py-2">{f.id}</td>
                          <td className="border px-4 py-2">{f.usuario_id}</td>
                          <td className="border px-4 py-2">${f.total}</td>
                          <td className="border px-4 py-2">{new Date(f.created_at).toLocaleDateString()}</td>
                          <td className="border px-4 py-2">{f.estado}</td>

                          {/* Nueva columna PDF */}
                          <td className="border px-4 py-2">
                              {f.property_data && (
                                  <a
                                      href={`http://localhost:4000/${JSON.parse(f.property_data).invoicePath}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                  >
                                      Ver PDF
                                  </a>
                              )}
                          </td>
                      </tr>
                  ))}
              </tbody>
      </table>
    </div>
  );
}