// src/api/apiClient.ts

import axios from 'axios';
import { useAuthStore } from "@/store/authStore"; // Importamos el store de Zustand

const API_BASE_URL = 'http://localhost:8000/api';

// 1. CREACIÓN DE LA INSTANCIA DE AXIOS
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Le dice al servidor que estamos enviando JSON
  },
});

// 2. INTERCEPTOR DE PETICIONES (La Lógica de Seguridad)
apiClient.interceptors.request.use(
  (config) => {
    // Obtenemos el token directamente del store de Zustand.
    // Usamos getState() porque estamos FUERA de un componente de React.
    const token = useAuthStore.getState().accessToken; 

    if (token) {
      // Si tenemos un token, lo inyectamos en el encabezado de la petición.
      // Este formato "Bearer <token>" es requerido por Django Simple JWT.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Devolvemos la configuración modificada
  },
  (error) => {
    // Si hay un error en la configuración de la petición antes de enviarse
    return Promise.reject(error);
  }
);