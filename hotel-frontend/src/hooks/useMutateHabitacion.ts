import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

// Definición de tipos para los payloads (asumiendo que Habitacion ya está definido)
interface HabitacionPayload {
  numero: string;
  piso: string;
  tipo: number; // Tipo ID (number)
  estado_ocupacion: 'L' | 'R' | 'O';
  estado_servicio: 'L' | 'S' | 'E' | 'M';
}

interface UpdateHabitacionPayload extends Partial<HabitacionPayload> {
  id: number; // Requerido para la actualización
}


// --- MUTACIÓN DE CREACIÓN (Ya existente) ---
export const useCreateHabitacion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newHabitacion: HabitacionPayload) => {
      return apiClient.post('/habitaciones/', newHabitacion);
    },
    onSuccess: () => {
      toast.success("Habitación creada con éxito.");
      queryClient.invalidateQueries({ queryKey: ['habitaciones'] });
    },
    // 🚨 CORRECCIÓN: Usamos AxiosError en lugar de any
    onError: (error: AxiosError) => {
      const detail = error.response?.data as { numero?: string } | undefined;
      toast.error("Error al crear la habitación.", {
        description: detail?.numero || error.message,
      });
    },
  });
};

// ---------------------------------------------
// --- 🚨 MUTACIÓN DE ACTUALIZACIÓN (U) 🚨 ---
// ---------------------------------------------
export const useUpdateHabitacion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updatedHabitacion: UpdateHabitacionPayload) => {
      // Usamos PATCH para enviar solo los campos modificados
      const { id, ...data } = updatedHabitacion;
      return apiClient.patch(`/habitaciones/${id}/`, data);
    },
    onSuccess: () => {
      toast.success("Habitación actualizada con éxito.");
      queryClient.invalidateQueries({ queryKey: ['habitaciones'] });
    },
    // 🚨 CORRECCIÓN: Usamos AxiosError
    onError: (error: AxiosError) => {
      const detail = error.response?.data as { numero?: string } | undefined;
      toast.error("Error al actualizar la habitación.", {
        description: detail?.numero || error.message,
      });
    },
  });
};

// ------------------------------------------
// --- 🚨 MUTACIÓN DE ELIMINACIÓN (D) 🚨 ---
// ------------------------------------------
export const useDeleteHabitacion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (habitacionId: number) => {
      return apiClient.delete(`/habitaciones/${habitacionId}/`);
    },
    onSuccess: () => {
      toast.success("Habitación eliminada con éxito.");
      queryClient.invalidateQueries({ queryKey: ['habitaciones'] });
    },
    // 🚨 CORRECCIÓN: Usamos AxiosError
    onError: (error: AxiosError) => {
      toast.error("Error al eliminar la habitación.", {
        description: error.message,
      });
    },
  });
};