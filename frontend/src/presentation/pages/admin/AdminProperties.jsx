import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    status: "available",
    type: "Apartamento",
    rooms: 1,
    bathrooms: 1,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/properties/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data);
    } catch (err) {
      console.error(err);
      alert("Error cargando propiedades");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, status) => {
    if (status === "rented") {
      alert("No se puede eliminar una propiedad arrendada");
      return;
    }
    if (!window.confirm("¿Eliminar esta propiedad?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/v1/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadProperties();
    } catch (err) {
      console.error(err);
      alert("Error eliminando propiedad");
    }
  };