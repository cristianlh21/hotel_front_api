// src/pages/Habitaciones/HabitacionActions.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AlertModal } from '@/components/ui/AlertModal';

// Hooks y Componentes de CRUD
import { useDeleteHabitacion } from '@/hooks/useMutateHabitacion';
import { EditarHabitacionDialog } from "./EditarHabitacionDialog";
import { type Habitacion } from './HabitacionesColumns'; // Importamos la interfaz

interface HabitacionActionsProps {
    habitacion: Habitacion;
}

export const HabitacionActions: React.FC<HabitacionActionsProps> = ({ habitacion }) => {
    // 🚨 LOS HOOKS VAN AQUÍ (dentro del componente) 🚨
    const deleteMutation = useDeleteHabitacion();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        deleteMutation.mutate(habitacion.id, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    return (
        <div className="flex items-center space-x-2">
            
            {/* 1. Botón/Icono de Editar */}
            <EditarHabitacionDialog habitacion={habitacion} />
            
            {/* 2. Botón/Icono de Eliminar (abrir modal) */}
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={deleteMutation.isPending}
            >
                <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
            </Button>
            
            {/* 3. Modal de Confirmación de Eliminación */}
            <AlertModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleDelete}
              loading={deleteMutation.isPending}
              title={`¿Eliminar Habitación N° ${habitacion.numero}?`}
              description="Esta acción es irreversible y podría afectar reservas futuras."
            />
            
        </div>
    );
};