// src/lib/constants.ts

// Opciones de PISO (Debe coincidir con PISOS_CHOICES del backend)
export const PISOS_OPCIONES = [
    { value: 'PB', label: 'Planta Baja' },
    { value: '1', label: 'Primer Piso' },
    { value: '2', label: 'Segundo Piso' },
    { value: '3', label: 'Tercer Piso' },
    { value: '4', label: 'Cuarto Piso' },
    // Agrega más si tienes definidos en el backend
];

// Función utilitaria para obtener la etiqueta de un valor
export const getLabelByValue = (options: { value: string, label: string }[], value: string) => {
    return options.find(option => option.value === value)?.label || value;
}