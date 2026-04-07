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

import logo from "../../assets/logo.png";

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

    <nav
      className="
        fixed w-full top-0 left-0 z-50
        bg-gray-900 shadow-lg
        px-6 py-5
      "
    >

      <div className="flex justify-between items-center">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-3 group"
        >

          <img
            src={logo}
            alt="RentDirect logo"
            className="w-9 h-9 object-contain transition"
          />

          <span className="
            text-2xl md:text-3xl font-bold
            text-white
            transition duration-300
            group-hover:text-white
            group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]
          ">
            RentDirect
          </span>

        </Link>

        {/* MENU */}

        <div className="relative" ref={menuRef}>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-white hover:scale-110 transition"
          >
            ☰
          </button>

          {isOpen && (

            <div
              className="
                absolute right-0 mt-4 w-64
                bg-white text-gray-800
                rounded-2xl
                shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]
                p-3 flex flex-col
                border border-gray-100
                animate-menuOpen
                z-50
              "
            >

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

                  <Link to="/my-documents" onClick={() => setIsOpen(false)} className="menu-item">
                    <FileText size={18} />
                    Mis documentos
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

              {user && role === "tenant" && (
                <>
                  <Link to="/" onClick={() => setIsOpen(false)} className="menu-item">
                    <Home size={18} />
                    Inicio
                  </Link>

                  <Link to="/properties" onClick={() => setIsOpen(false)} className="menu-item">
                    <Building size={18} />
                    Propiedades
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

              {user && role === "admin" && (
                <>
                  <Link to="/" onClick={() => setIsOpen(false)} className="menu-item">
                    <Home size={18} />
                    Inicio
                  </Link>

                  <Link to="/admin" onClick={() => setIsOpen(false)} className="menu-item">
                    <User size={18} />
                    Panel Admin 
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