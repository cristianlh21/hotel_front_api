// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <<<--- NUEVO
import { router } from './router.tsx';
import './index.css'; 
import { Toaster } from "@/components/ui/sonner"; 

// 1. Crea una instancia del cliente de consulta
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // Los datos se consideran "frescos" por 5 minutos
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Envolvemos el Router con el QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} /> 
    </QueryClientProvider>
    
    <Toaster richColors position="top-right" /> 
  </React.StrictMode>,
);