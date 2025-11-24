// src/pages/HabitacionesPage.tsx
import { apiClient } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query'; // <<<--- EL HOOK DE REACT QUERY
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './habitaciones/HabitacionesColumns'; // Importar columnas y tipo

// --- Definición de Tipos (Basado en el Modelo de Django) ---
interface Habitacion {
    id: number;
    numero: string;
    piso: string;
    tipo_nombre: string;
    estado_ocupacion_display: string;
    estado_servicio_display: string;
}

// --- Función de Fetching (Simple y Pura) ---
// Esta función SÓLO se encarga de llamar a la API y devolver la data.
const fetchHabitaciones = async (): Promise<Habitacion[]> => {
    const response = await apiClient.get<Habitacion[]>('/habitaciones/');
    return response.data;
};

export const HabitacionesPage = () => {
    // 1. Uso del hook useQuery para gestionar el estado del servidor
    const { 
        data: habitaciones, 
        isLoading, 
        isError, 
        error,
        refetch // Función para recargar los datos manualmente
    } = useQuery<Habitacion[], Error>({
        queryKey: ['habitaciones'], // Llave única para el caché (ej: 'habitaciones')
        queryFn: fetchHabitaciones, // La función que se ejecuta
        staleTime: 1000 * 60 * 5, // Los datos se consideran "frescos" por 5 minutos
    });

    // 2. Manejo de Estados de UI (Limpieza Extrema)
    if (isLoading) {
        return <div className="text-center p-8 text-xl text-gray-500">Cargando habitaciones...</div>;
    }

    if (isError) {
        // Muestra una notificación si hay error y devuelve un mensaje
        toast.error("Error al cargar datos", { description: error.message });
        return <div className="text-center p-8 text-red-600">
            Error: No se pudieron cargar los datos. Intente <Button onClick={() => refetch()} variant="link" className="p-0">Recargar</Button>.
        </div>;
    }
    
    // Si la data es null/undefined, usamos un array vacío.
    const habitacionesData = habitaciones || []; 

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">🛌 Estado General de Habitaciones</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Inventario ({habitacionesData.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* 🚨 REEMPLAZO DE LA TABLA MANUAL POR EL COMPONENTE DATATABLE */}
                    <DataTable
                        columns={columns} 
                        data={habitacionesData} 
                    />
                </CardContent>
            </Card>
        </div>
    );
};