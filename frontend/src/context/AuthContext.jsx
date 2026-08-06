import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

const clearStoredSession = () => {
  localStorage.removeItem("sims_token");
  localStorage.removeItem("sims_user");
};

const storeSession = (token, user) => {
  localStorage.setItem("sims_token", token);
  localStorage.setItem("sims_user", JSON.stringify(user));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const cachedUser = localStorage.getItem("sims_user");
      const token = localStorage.getItem("sims_token");
      if (!token) {
        setLoading(false);
        return;
      }
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          clearStoredSession();
        }
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("sims_user", JSON.stringify(data.user));
      } catch {
        clearStoredSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (email, password) => {
    clearStoredSession();
    const { data } = await api.post("/auth/login", { email: email.trim().toLowerCase(), password });
    storeSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    clearStoredSession();
    const { data } = await api.post("/auth/register", {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    });
    storeSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore network errors on logout
    }
    clearStoredSession();
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.user);
    localStorage.setItem("sims_user", JSON.stringify(data.user));
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
