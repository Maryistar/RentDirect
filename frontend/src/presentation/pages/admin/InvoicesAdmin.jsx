import { useEffect, useState } from "react";
import axios from "axios";

export default function InvoicesAdmin() {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/admin/invoices");
        if (data.success) setFacturas(data.data);

        console.log("Facturas recibidas:", data.data);
      } catch (error) {
        console.error("Error al cargar facturas", error);
      }
    };
    fetchInvoices();
  }, []);

  
  const statusConfig = {
    paid: {
      label: "Pagado",
      style: "bg-green-200 text-green-800"
    },
    completed: {
      label: "Pagado",
      style: "bg-green-200 text-green-800"
    },
    pending: {
      label: "Pendiente",
      style: "bg-yellow-200 text-yellow-800"
    },
    failed: {
      label: "Fallido",
      style: "bg-red-200 text-red-800"
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Facturación PayPal 💳
        </h2>
      </div>

      {/* CONTENEDOR */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">

            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs uppercase">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Factura</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {facturas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400">
                    No hay facturas disponibles
                  </td>
                </tr>
              ) : (
                facturas.map((f) => {
                  const status = statusConfig[f.estado] || {
                    label: f.estado,
                    style: "bg-gray-200 text-gray-700"
                  };

                  return (
                    <tr
                      key={f.id}
                      className="hover:bg-blue-50 transition duration-200"
                    >

                      <td className="px-6 py-4 font-bold text-gray-700">
                        #{f.id}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {f.usuario_id}
                      </td>

                      <td className="px-6 py-4 font-semibold text-blue-600">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                        }).format(f.total)}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {new Date(f.created_at).toLocaleDateString("es-CO")}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${status.style}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {f.property_data ? (
                          <a
                            href={`http://localhost:4000/${JSON.parse(f.property_data).invoicePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition transform"
                          >
                            Ver PDF
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No disponible
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}