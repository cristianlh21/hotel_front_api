// src/components/AuthGuard.tsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore"; // Importamos el estado

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Obtenemos el estado de autenticación de Zustand
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Si NO está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si SÍ está autenticado, mostrar el contenido
  return <>{children}</>;
};