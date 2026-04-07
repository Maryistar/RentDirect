import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState("all"); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    status: "active",
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

  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:4000/api/v1/users/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, status: res.data.status } : u
        )
      );

    } catch (error) {
      console.error(error);
      alert("Error cambiando estado");
    }
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
      : "bg-yellow-100 text-yellow-700";
  };

  const getStatusText = (status) => {
    return status === "active" ? "Activo" : "Suspendido";
  };

 
  const filteredUsers = users.filter((u) => {
    if (filter === "active") return u.status === "active";
    if (filter === "suspended") return u.status === "suspended";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Usuarios 👤
        </h1>
        <p className="text-gray-500">
          Filtra y administra usuarios
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${
            filter === "all"
              ? "bg-black text-white"
              : "bg-white border"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg ${
            filter === "active"
              ? "bg-green-500 text-white"
              : "bg-white border"
          }`}
        >
          Activos
        </button>

        <button
          onClick={() => setFilter("suspended")}
          className={`px-4 py-2 rounded-lg ${
            filter === "suspended"
              ? "bg-yellow-500 text-white"
              : "bg-white border"
          }`}
        >
          Suspendidos
        </button>
      </div>

      {/* LISTA */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition"
          >
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

            <div className="flex gap-2 mb-4 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm ${getRoleStyle(u.role)}`}>
                {u.role}
              </span>

              <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(u.status)}`}>
                {getStatusText(u.status)}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">

              <button
                onClick={() => navigate(`/profile/${u.id}`)}
                className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm"
              >
                Ver perfil
              </button>

              <button
                onClick={() => openEdit(u)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
              >
                Editar
              </button>

              <button
                onClick={() => handleToggle(u.id)}
                className={`px-3 py-1 rounded-lg text-sm text-white ${
                  u.status === "active"
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              >
                {u.status === "active" ? "Suspender" : "Activar"}
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="owner">Propietario</option>
              <option value="tenant">Inquilino</option>
            </select>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="active">Activo</option>
              <option value="suspended">Suspendido</option>
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditingUser(null)}>Cancelar</button>
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