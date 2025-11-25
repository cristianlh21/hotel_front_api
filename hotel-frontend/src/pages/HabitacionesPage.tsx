import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';

// Conexión API y Componentes
import { apiClient } from '@/api/apiClient';
import { columns, type Habitacion } from './habitaciones/HabitacionesColumns';
import { CrearHabitacionDialog } from './habitaciones/CrearHabitacionDialog'; // <<<--- DIALOGO DE CREACIÓN

// --- 1. Función de Fetching para React Query ---
const fetchHabitaciones = async (): Promise<Habitacion[]> => {
    // El interceptor JWT de Axios ya añade el token de autenticación
    const response = await apiClient.get<Habitacion[]>('/habitaciones/');
    return response.data;
};

export const HabitacionesPage = () => {
    
    // 2. Uso del hook useQuery para gestionar el estado del servidor
    const { 
        data: habitaciones, 
        isLoading, 
        isError, 
        error,
        refetch 
    } = useQuery<Habitacion[], Error>({
        queryKey: ['habitaciones'], 
        queryFn: fetchHabitaciones,
        staleTime: 1000 * 60 * 5, 
    });

    // 3. Manejo de Estados de UI
    if (isLoading) {
        return <div className="text-center p-8 text-xl text-gray-500">Cargando habitaciones...</div>;
    }

    if (isError) {
        // Muestra notificación de error y permite reintentar la carga
        toast.error("Error al cargar datos", { description: error.message });
        return (
            <div className="text-center p-8 text-red-600">
                Error: No se pudo conectar con el servidor o token expirado.
                <Button onClick={() => refetch()} variant="link" className="p-0 text-red-600">
                    Haga clic aquí para recargar
                </Button>
            </div>
        );
    }
    
    // Aseguramos que la data no sea null para la tabla
    const habitacionesData = habitaciones || []; 

    // 4. Renderizado Final
    return (
        <div className="space-y-6">
            {/* ESTE DIV CONTIENE EL TÍTULO Y EL BOTÓN DE CREACIÓN */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">🛌 Gestión de Habitaciones</h1>
                
                {/* ESTE COMPONENTE ES EL BOTÓN/DIALOGO */}
                <CrearHabitacionDialog /> 
            </div>
                
            <Card>
                <CardHeader>
                    <CardTitle>Inventario Actual ({habitacionesData.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* El componente DataTable es el encargado de renderizar la tabla con las columnas y datos */}
                    <DataTable 
                        columns={columns} 
                        data={habitacionesData} 
                    />
                </CardContent>
            </Card>
        </div>
    );
};