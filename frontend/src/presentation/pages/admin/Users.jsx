import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    status: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:4000/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar usuarios");
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    setUsers(users.filter((u) => u.id !== id));
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      status: user.status || "active",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:4000/api/v1/users/admin/${editingUser.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(users.map((u) => (u.id === editingUser.id ? res.data : u)));
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar usuario");
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "owner":
        return "bg-blue-100 text-blue-700";
      case "tenant":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusStyle = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Usuarios 👤
        </h1>
        <p className="text-gray-500">
          Administra todos los usuarios del sistema
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition"
          >
            {/* HEADER USER */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  u.name
                )}`}
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h2 className="font-semibold text-gray-800">{u.name}</h2>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            </div>

            {/* BADGES */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm ${getRoleStyle(u.role)}`}>
                {u.role === "owner"
                  ? "Propietario"
                  : u.role === "tenant"
                  ? "Inquilino"
                  : u.role}
              </span>

              <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(u.status || "active")}`}>
                {u.status === "inactive" ? "Inactivo" : "Activo"}
              </span>
            </div>

            {/* ACCIONES */}
            <div className="flex gap-2 flex-wrap">

                {/* 👁️ VER PERFIL */}
                <button
                  onClick={() => navigate(`/profile/${u.id}`)}
                  className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded-lg text-sm transition"
                >
                  Ver perfil
                </button>

                {/* ✏️ EDITAR */}
                <button
                  onClick={() => openEdit(u)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition"
                >
                  Editar
                </button>

                {/* ❌ ELIMINAR */}
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                >
                  Eliminar
                </button>

              </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

            <h2 className="text-lg font-bold mb-4">
              Editar Usuario
            </h2>

            <label className="text-sm font-medium">Nombre</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm font-medium">Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="owner">Propietario</option>
              <option value="tenant">Inquilino</option>
            </select>

            <label className="text-sm font-medium">Teléfono</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="text-sm font-medium">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingUser(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-500 text-white rounded"
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