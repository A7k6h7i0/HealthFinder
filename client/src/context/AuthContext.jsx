import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {_id, name, email, role}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("hs_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("hs_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (data) => {
    localStorage.setItem("hs_token", data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
  };

  const logout = () => {
    localStorage.removeItem("hs_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
