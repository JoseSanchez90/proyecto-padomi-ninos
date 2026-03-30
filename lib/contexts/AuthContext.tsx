"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, User } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar sesión del localStorage al montar
  useEffect(() => {
    const storedAuth = localStorage.getItem("padomi_auth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error loading auth session:", error);
      }
    }
  }, []);

  const login = (dni: string, password: string) => {
    // Mock authentication - en producción esto sería una API call
    if (dni && password) {
      const mockUser: User = {
        id: dni,
        dni: dni,
        name: `Usuario ${dni.slice(-4)}`,
        role: "staff",
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem("padomi_auth", JSON.stringify({ user: mockUser }));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("padomi_auth");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
