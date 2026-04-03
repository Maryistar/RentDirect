import { createContext, useContext, useState, useEffect } from "react";
import { loginService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 🔹 Cargar sesión guardada (NORMALIZADO)
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);

      const normalizedUser = {
        ...parsedUser,
        id: Number(parsedUser?.id || parsedUser?.userId || parsedUser?.user_id)
      };

      setToken(savedToken);
      setUser(normalizedUser);
    }
  }, []);

  // 🔹 LOGIN normal (ARREGLADO)
  const login = async (credentials) => {
    const res = await loginService(credentials);

    const normalizedUser = {
      ...res.user,
      id: Number(res.user?.id || res.user?.userId || res.user?.user_id)
    };

    setToken(res.token);
    setUser(normalizedUser);

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  // 🔹 LOGIN con Google (ARREGLADO)
  const loginGoogle = (data) => {
    const normalizedUser = {
      ...data.user,
      id: Number(data.user?.id || data.user?.userId || data.user?.user_id)
    };

    setToken(data.token);
    setUser(normalizedUser);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  // 🔹 LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Hook
export const useAuth = () => useContext(AuthContext);