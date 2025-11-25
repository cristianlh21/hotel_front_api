import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Hooks y Data
import { useCreateHabitacion } from '@/hooks/useMutateHabitacion';
import { useTiposHabitacion } from '@/hooks/useTiposHabitacion';
import { PISOS_OPCIONES } from '@/lib/constants';



const PISOS_ENUM = PISOS_OPCIONES.map(p => p.value) as [string, ...string[]]; // Necesario para z.enum
const estadoOcupacionChoices = ['L', 'R', 'O'] as const;
const estadoServicioChoices = ['L', 'S', 'E', 'M'] as const;


// --- 1. Definición del Esquema (Corregido sin transform) ---
const HabitacionSchema = z.object({
  numero: z.string().min(1, { message: "Número requerido." }),
  piso: z.enum(PISOS_ENUM, { message: "Seleccione un piso válido." }), // Valida contra las opciones estáticas
  tipo: z.string().min(1, { message: "Tipo requerido." }), // Se mantiene como string para RHF
  estado_ocupacion: z.enum(estadoOcupacionChoices),
  estado_servicio: z.enum(estadoServicioChoices),
});

type HabitacionFormValues = z.infer<typeof HabitacionSchema>;


export const CrearHabitacionDialog = () => {
    const [open, setOpen] = useState(false);
    
    const form = useForm<HabitacionFormValues>({
        resolver: zodResolver(HabitacionSchema),
        defaultValues: {
            piso: "",
            numero: "",
            tipo: "",
            estado_ocupacion: 'L',
            estado_servicio: 'L',
        },
    });
    
    const { data: tipos, isLoading: isLoadingTipos } = useTiposHabitacion();
    const mutation = useCreateHabitacion();

    const onSubmit = (data: HabitacionFormValues) => {
        
        // 🚨 CONVERSIÓN MANUAL CRÍTICA: Convertimos el string de 'tipo' a number 
        const payload = {
            ...data,
            tipo: Number(data.tipo) 
        };

        mutation.mutate(payload, {
            onSuccess: () => {
                setOpen(false);
                form.reset();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>+ Nueva Habitación</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Nueva Habitación</DialogTitle>
                    <DialogDescription>
                        Añade una nueva unidad al inventario de habitaciones del hotel.
                    </DialogDescription>
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

                            {/* Campo de Piso (SELECT CORREGIDO) */}
                            <FormField
                                control={form.control}
                                name="piso"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Piso</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            defaultValue={field.value}
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
                                        defaultValue={field.value} 
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
                        
                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={mutation.isPending || isLoadingTipos}
                        >
                            {mutation.isPending ? "Registrando..." : "Crear Habitación"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};