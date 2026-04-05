import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
    }

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

    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    const confirm = window.confirm("¿Seguro que quieres eliminar este usuario?");
    if (!confirm) return;

    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);
  };

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', phone: '', status: '' });

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      status: user.status || 'active',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:4000/api/v1/users/admin/${editingUser.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.map(u => (u.id === editingUser.id ? res.data : u)));
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar usuario');
    }
  };





  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-2xl font-bold mb-6">
        Gestión de Usuarios 👤
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-4">

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Nombre</th>
              <th className="p-2">Email</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  {u.role === "owner" ? "Propietario" : u.role === "tenant" ? "Inquilino" : u.role}
                </td>

                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Eliminar
                  </button>

                  <button
                    onClick={() => openEdit(u)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Editar
                  </button>

                  {editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                      <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" className="w-full mb-2 p-2 border" />
                        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full mb-2 p-2 border" />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full mb-2 p-2 border"
                        >
                          <option value="owner">Propietario</option>
                          <option value="tenant">Inquilino</option>
                        </select>
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" className="w-full mb-2 p-2 border" />
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full mb-2 p-2 border">
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                        </select>
                        <div className="flex justify-end gap-2 mt-4">
                          <button onClick={() => setEditingUser(null)} className="px-3 py-1 bg-gray-300 rounded">Cancelar</button>
                          <button onClick={handleSave} className="px-3 py-1 bg-blue-500 text-white rounded">Guardar</button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}