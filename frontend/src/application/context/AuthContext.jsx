import { createContext, useContext, useState, useEffect } from "react";
import { loginService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 🔹 Cargar sesión guardada
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 🔹 LOGIN
  const login = async (credentials) => {
    const res = await loginService(credentials);

    setToken(res.token);
    setUser(res.user);

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("userId", res.user.id);
    localStorage.setItem("userName", res.user.name);

    return res;

    // 🔥 ESTA LÍNEA ARREGLA TU CHAT
    localStorage.setItem("userId", res.user.id);

    // 🔥 OPCIONAL (por si quieres usar nombre en UI)
    localStorage.setItem("userName", res.user.name);
  };

  // 🔹 LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 🔥 limpiar también estos
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);