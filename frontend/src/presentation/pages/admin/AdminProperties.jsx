import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    status: "available",
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:4000/api/v1/properties/admin",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProperties(res.data);
    } catch (err) {
      console.error(err);
      alert("Error cargando propiedades");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      address: property.address,
      price: property.price,
      status: property.status,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:4000/api/v1/properties/${editingProperty.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditingProperty(null);
      loadProperties();
    } catch (err) {
      console.error(err);
      alert("Error actualizando propiedad");
    }
  };


  const formatCOP = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };


  const translateStatus = (status) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "rented":
        return "Arrendada";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  
  const statusStyles = {
    available: "bg-green-100 text-green-700",
    rented: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-700",
  };

  if (loading) {
    return <div className="p-6">Cargando propiedades...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">
        Gestión de Propiedades 🏠
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {properties.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow overflow-hidden">

            <div className="p-4">

              <h2 className="font-semibold text-lg">{p.title}</h2>
              <p className="text-gray-500">{p.address}</p>

              <p className="font-bold mt-2 text-lg">
                {formatCOP(p.price)}
              </p>

              <span
                className={`px-3 py-1 rounded-full text-sm ${statusStyles[p.status]}`}
              >
                {translateStatus(p.status)}
              </span>

              <div className="flex gap-2 mt-4 flex-wrap">

                <button
                  onClick={() =>
                    navigate(`/properties/${p.id}`, {
                      state: { from: "/admin/properties" }
                    })
                  }
                  className="bg-gray-800 text-white px-3 py-1 rounded-lg"
                >
                  Ver detalle
                </button>

                <button
                  onClick={() => openEdit(p)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                >
                  Editar
                </button>

              </div>
            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="font-bold mb-4">Editar Propiedad</h2>

            <label className="text-sm">Título</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm">Dirección</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm">Precio (COP)</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="available">Disponible</option>
              <option value="rented">Arrendada</option>
              <option value="pending">Pendiente</option>
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditingProperty(null)}>
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Guardar
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}