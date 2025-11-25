// src/hooks/useTiposHabitacion.ts

import { apiClient } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';

// Tipo de datos de los tipos de habitación
interface TipoHabitacion {
    id: number;
    nombre: string;
    precio_base: number;
}

const fetchTipos = async (): Promise<TipoHabitacion[]> => {
    // Llama al endpoint de Tipos de Habitación
    const response = await apiClient.get<TipoHabitacion[]>('/habitaciones/tipos/');
    return response.data;
};

export const useTiposHabitacion = () => {
    return useQuery({
        queryKey: ['tiposHabitacion'], // Clave única para el caché
        queryFn: fetchTipos,
        staleTime: Infinity, // Estos datos no cambian a menudo, los consideramos 'fresh' indefinidamente
    });
};