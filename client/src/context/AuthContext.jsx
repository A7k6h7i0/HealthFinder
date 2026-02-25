import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosClient";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("hs_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch profile");
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("hs_token", userData.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hs_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
