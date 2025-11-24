// src/pages/Habitaciones/HabitacionesColumns.tsx

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


// Tipo de datos (debe coincidir con la definición de Habitacion en HabitacionesPage.tsx)
export interface Habitacion {
    id: number; 
    numero: string;
    piso: string;
    tipo_nombre: string;
    estado_ocupacion_display: string;
    estado_servicio_display: string;
}

export const columns: ColumnDef<Habitacion>[] = [
  {
    accessorKey: "numero",
    header: "Núm.",
    cell: ({ row }) => <span className="font-semibold">{row.original.numero}</span>,
  },
  {
    accessorKey: "piso",
    header: "Piso",
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
      let variant: 'secondary' | 'default' | 'destructive' = 'secondary';
      if (status === 'Ocupada') variant = 'destructive';
      if (status === 'Reservada') variant = 'default';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <Badge variant={variant as any}>{status}</Badge>;
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
  {
    id: "acciones",
    header: "Acciones",
    cell: () => (
      <Button variant="outline" size="sm">
        Ver Detalle
      </Button>
    ),
  },
];