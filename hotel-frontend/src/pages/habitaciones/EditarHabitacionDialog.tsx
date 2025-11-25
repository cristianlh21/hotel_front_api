import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon } from 'lucide-react'; // Icono para el botón de editar

// Constantes y Hooks
import { PISOS_OPCIONES } from "@/lib/constants";
import { useUpdateHabitacion } from '@/hooks/useMutateHabitacion';
import { useTiposHabitacion } from '@/hooks/useTiposHabitacion';
import {type Habitacion } from './HabitacionesColumns'; // Importamos el tipo de la tabla

// --- Opciones y Schemas ---
const PISOS_ENUM = PISOS_OPCIONES.map(p => p.value) as [string, ...string[]]; 
const estadoOcupacionChoices = ['L', 'R', 'O'] as const;
const estadoServicioChoices = ['L', 'S', 'E', 'M'] as const;

// Esquema de Edición (Debe ser idéntico al de creación en estructura)
const HabitacionEditSchema = z.object({
  numero: z.string().min(1, { message: "Número requerido." }),
  piso: z.enum(PISOS_ENUM, { message: "Seleccione un piso válido." }),
  tipo: z.string().min(1, { message: "Tipo requerido." }), 
  estado_ocupacion: z.enum(estadoOcupacionChoices),
  estado_servicio: z.enum(estadoServicioChoices),
});

type HabitacionFormValues = z.infer<typeof HabitacionEditSchema>;

interface EditarHabitacionDialogProps {
  habitacion: Habitacion; // Data de la habitación a editar
}

export const EditarHabitacionDialog: React.FC<EditarHabitacionDialogProps> = ({ habitacion }) => {
    const [open, setOpen] = useState(false);
    
    // Convertir datos del backend a formato de formulario (strings)
    const defaultValues: HabitacionFormValues = {
      numero: habitacion.numero,
      piso: habitacion.piso,
      tipo: habitacion.tipo_nombre.toString(), // ID de tipo: number -> string
      estado_ocupacion: habitacion.estado_ocupacion,
      estado_servicio: habitacion.estado_servicio,
    };
    
    const form = useForm<HabitacionFormValues>({
        resolver: zodResolver(HabitacionEditSchema),
        defaultValues,
    });
    
    const { data: tipos, isLoading: isLoadingTipos } = useTiposHabitacion();
    const mutation = useUpdateHabitacion();

    const onSubmit = (data: HabitacionFormValues) => {
        
        // Preparar payload para la API
        const payload = {
            ...data,
            id: habitacion.id, // Enviar ID para saber qué actualizar
            tipo: Number(data.tipo) // Conversión inversa: string -> number
        };

        mutation.mutate(payload, {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };
    
    // Opciones estáticas para los estados
    const ocupacionOptions = [
        { value: 'L', label: 'Libre' },
        { value: 'R', label: 'Reservada' },
        { value: 'O', label: 'Ocupada' },
    ];
    const servicioOptions = [
        { value: 'L', label: 'Limpia' },
        { value: 'S', label: 'Sucia' },
        { value: 'E', label: 'En Limpieza' },
        { value: 'M', label: 'Mantenimiento' },
    ];


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* El icono Pencil como trigger del diálogo */}
            <PencilIcon 
                className="h-4 w-4 cursor-pointer text-gray-500 hover:text-blue-600" 
                onClick={() => {
                    // Resetear el formulario con los valores actuales de la habitación al abrir
                    form.reset(defaultValues); 
                    setOpen(true);
                }} 
            />
            
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Habitación N° {habitacion.numero}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Campo de Número */}
                            <FormField
                                control={form.control}
                                name="numero"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número</FormLabel>
                                        <FormControl><Input placeholder="205" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Campo de Piso */}
                            <FormField
                                control={form.control}
                                name="piso"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Piso</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value} 
                                            disabled={mutation.isPending}
                                        >
                                            <FormControl><SelectTrigger>
                                                <SelectValue placeholder="Seleccione el piso" />
                                            </SelectTrigger></FormControl>
                                            <SelectContent>
                                                {PISOS_OPCIONES.map((p) => (
                                                    <SelectItem key={p.value} value={p.value}>
                                                        {p.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Campo Tipo de Habitación */}
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Habitación</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        disabled={isLoadingTipos || mutation.isPending}
                                    >
                                        <FormControl><SelectTrigger>
                                            <SelectValue placeholder="Seleccione un tipo" />
                                        </SelectTrigger></FormControl>
                                        <SelectContent>
                                            {isLoadingTipos ? (
                                                <SelectItem value="loading" disabled>Cargando Tipos...</SelectItem>
                                            ) : (
                                                tipos?.map((t) => (
                                                    <SelectItem key={t.id} value={t.id.toString()}>
                                                        {t.nombre} (${t.precio_base})
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Estado de Ocupación */}
                            <FormField
                                control={form.control}
                                name="estado_ocupacion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ocupación</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value} 
                                            disabled={mutation.isPending}
                                        >
                                            <FormControl><SelectTrigger>
                                                <SelectValue placeholder="Estado de Ocupación" />
                                            </SelectTrigger></FormControl>
                                            <SelectContent>
                                                {ocupacionOptions.map((o) => (
                                                    <SelectItem key={o.value} value={o.value}>
                                                        {o.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Estado de Servicio */}
                            <FormField
                                control={form.control}
                                name="estado_servicio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Servicio</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value} 
                                            disabled={mutation.isPending}
                                        >
                                            <FormControl><SelectTrigger>
                                                <SelectValue placeholder="Estado de Servicio" />
                                            </SelectTrigger></FormControl>
                                            <SelectContent>
                                                {servicioOptions.map((s) => (
                                                    <SelectItem key={s.value} value={s.value}>
                                                        {s.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={mutation.isPending || isLoadingTipos}
                        >
                            {mutation.isPending ? "Actualizando..." : "Guardar Cambios"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};