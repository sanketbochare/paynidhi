// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const login = (data) => {
    // { _id, email, companyName?, role, message }
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // optional: also call backend /auth/logout to clear cookie
  };

  // On first load: verify cookie and user
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const me = await getMe();          // checks cookie server-side
        setUser((prev) => prev || me);     // if local user missing, set from server
        localStorage.setItem("user", JSON.stringify(me));
      } catch (err) {
        // cookie invalid or missing: ensure logged out
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    login,
    logout,
    authLoading: loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
