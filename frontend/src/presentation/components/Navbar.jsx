import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../application/context/AuthContext";
import {
  Home,
  User,
  LogOut,
  FileText,
  Building,
  PlusCircle
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const role = user?.role;

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 relative shadow-md">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold tracking-wide hover:text-gray-300 transition"
        >
          RentDirect
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl hover:opacity-80 transition duration-200"
          >
            ☰
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl p-3 flex flex-col border border-gray-100">

              {!user && (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="menu-item">
                    <User size={18} />
                    Ingresa
                  </Link>

                  <Link to="/register" onClick={() => setIsOpen(false)} className="menu-item">
                    <User size={18} />
                    Regístrate
                  </Link>
                </>
              )}


              {user && role === "owner" && (
                <>
                  <Link to="/" onClick={() => setIsOpen(false)} className="menu-item">
                    <Home size={18} />
                    Inicio
                  </Link>

                  <Link to="/my-properties" onClick={() => setIsOpen(false)} className="menu-item">
                    <Building size={18} />
                    Mis propiedades
                  </Link>

                  <Link to="/create-property" onClick={() => setIsOpen(false)} className="menu-item">
                    <PlusCircle size={18} />
                    Publicar propiedad
                  </Link>

                  <Link to="/profile" onClick={() => setIsOpen(false)} className="menu-item">
                    <User size={18} />
                    Perfil
                  </Link>

                  {/* LINK DE CHATS PARA OWNER */}
                  <Link to="/chat" onClick={() => setIsOpen(false)} className="menu-item">
                    <User size={18} />
                    Chats
                  </Link>

                  <div className="border-t my-2"></div>

                  <button onClick={handleLogout} className="menu-item-danger">
                    <LogOut size={18} />
                    Cerrar sesión
                  </button>
                </>
              )}

              {user && role === "tenant" && (
                <>
                  <Link to="/" onClick={() => setIsOpen(false)} className="menu-item">
                    <Home size={18} />
                    Inicio
                  </Link>

                  <Link to="/my-applications" onClick={() => setIsOpen(false)} className="menu-item">
                    <FileText size={18} />
                    Mis aplicaciones
                  </Link>

                  <Link to="/profile" onClick={() => setIsOpen(false)} className="menu-item">
                    <User size={18} />
                    Perfil
                  </Link>

                  <Link to="/chat" onClick={() => setIsOpen(false)} className="menu-item">
                    <User size={18} />
                    Chats
                  </Link>

                  <div className="border-t my-2"></div>

                  <button onClick={handleLogout} className="menu-item-danger">
                    <LogOut size={18} />
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}