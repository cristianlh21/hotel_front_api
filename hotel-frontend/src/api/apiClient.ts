// src/api/apiClient.ts (CÓDIGO FINAL CON INTERCEPTORES)

import axios from 'axios';
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para evitar bucles infinitos durante la renovación
let isRefreshing = false; 

// --- 1. INTERCEPTOR DE PETICIONES (Request, Ya lo teníamos) ---
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. INTERCEPTOR DE RESPUESTA (Response, LÓGICA DE RENOVACIÓN) ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = useAuthStore.getState().refreshToken;

    // Condición de error: 401 y no es una petición que ya falló o la petición de refresh
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      
      originalRequest._retry = true;
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // 1. Intentar obtener un nuevo token de acceso usando el token de renovación
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access: newAccess, refresh: newRefresh } = response.data;
          
          // 2. Guardar los nuevos tokens en el store
          useAuthStore.getState().setTokens(newAccess, newRefresh);
          
          // 3. Actualizar el encabezado de la petición original
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          
          isRefreshing = false;

          // 4. Reintentar la petición original que falló
          return apiClient(originalRequest);
          
        } catch (refreshError) {
          // Si el token de renovación también falla, cerramos la sesión
          useAuthStore.getState().logout();
          window.location.href = '/login'; // Redirigir al login
          return Promise.reject(refreshError);
        }
      } 
      // Si ya hay un proceso de renovación en curso, simplemente esperamos 
      // a que termine y reintentamos la petición original.
      else {
          return new Promise((resolve) => {
              // Simplemente resolvemos la promesa para reintentar
              resolve(apiClient(originalRequest));
          });
      }
    }
    
    // Si el error no es 401 o no podemos renovar, lo devolvemos
    return Promise.reject(error);
  }
);