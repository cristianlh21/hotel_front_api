import { type ColumnDef } from "@tanstack/react-table";

// Componentes UI
import { Badge } from "@/components/ui/badge"; 
import { PISOS_OPCIONES, getLabelByValue } from "@/lib/constants"; // Traducción de códigos
import { HabitacionActions } from './HabitacionActions';


// --- 1. INTERFAZ DE DATOS (CRÍTICA) ---
// Incluye tanto el código clave para el payload (ej: 'L') como el display legible (ej: 'Libre')
type EstadoOcupacionKey = 'L' | 'R' | 'O';
type EstadoServicioKey = 'L' | 'S' | 'E' | 'M';

export interface Habitacion {
    id: number;
    numero: string;
    piso: string;
    tipo: number; // ID del Tipo (FK)
    tipo_nombre: string;
    
    // Claves del payload para editar
    estado_ocupacion: EstadoOcupacionKey;
    estado_servicio: EstadoServicioKey;
    
    // Claves display para la tabla
    estado_ocupacion_display: string; 
    estado_servicio_display: string;   
}


// --- 2. DEFINICIÓN DE COLUMNAS ---
export const columns: ColumnDef<Habitacion>[] = [
  {
    accessorKey: "numero",
    header: "Núm.",
    cell: ({ row }) => <span className="font-semibold">{row.original.numero}</span>,
  },
  {
    accessorKey: "piso",
    header: "Piso",
    // Traducción del código ('1', 'PB') a etiqueta ('Primer Piso', 'Planta Baja')
    cell: ({ row }) => {
        return getLabelByValue(PISOS_OPCIONES, row.original.piso);
    }
  },
  {
    accessorKey: "tipo_nombre",
    header: "Tipo",
  },
  {
    accessorKey: "estado_ocupacion_display",
    header: "Ocupación",
    cell: ({ row }) => {
      const status = row.original.estado_ocupacion_display;
      type BadgeVariant = "default" | "secondary" | "destructive";
      // Usamos el tipo BadgeVariant definido
        let variant: BadgeVariant = 'secondary'; 
        if (status === 'Ocupada') variant = 'destructive';
        if (status === 'Reservada') variant = 'default';

        // 🚨 SOLUCIÓN: Usamos la variable directamente. TypeScript ahora lo acepta
        return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "estado_servicio_display",
    header: "Servicio",
    cell: ({ row }) => {
      const service = row.original.estado_servicio_display;
      const color = service === 'Limpia' ? 'text-green-600' : service === 'En Mantenimiento' ? 'text-red-500' : 'text-orange-500';
      
      return <span className={color}>{service}</span>;
    },
  },
  
  // --- 3. COLUMNA DE ACCIONES (U & D) ---
  // --- COLUMNA DE ACCIONES ---
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      // 🚨 SOLUCIÓN: Renderizar el componente aquí, pasando los datos de la fila
      return <HabitacionActions habitacion={row.original} />; 
    },
  },
];