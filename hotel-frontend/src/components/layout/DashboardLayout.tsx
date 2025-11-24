// src/components/layout/DashboardLayout.tsx

import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Separator } from "@/components/ui/separator";

// --- Estructura de Navegación ---
const navItems = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Recepción", path: "/reservas" },
    { title: "Habitaciones", path: "/habitaciones" },
    { title: "Huéspedes", path: "/huespedes" },
    { title: "RRHH y Personal", path: "/personal" },
    { title: "Inventario y Compras", path: "/inventario" },
    { title: "Finanzas y Cuentas", path: "/cuentas" },
];

export const DashboardLayout = () => {
    const logout = useAuthStore((state) => state.logout);

    return (
        // Contenedor principal: Fija la altura total de la pantalla
        <div className="flex h-screen bg-gray-50">
            
            {/* 1. SIDEBAR (Navegación Fija) */}
            <aside className="w-64 flex flex-col border-r bg-white">
                <div className="p-4 flex items-center h-16 border-b">
                    <h1 className="text-xl font-bold text-primary">🏨 HOTEL ERP</h1>
                </div>

                {/* Enlaces de Navegación */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            asChild
                            variant="ghost"
                            className="w-full justify-start text-base"
                        >
                            <Link to={item.path}>
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </nav>

                {/* Logout Fijo en el fondo */}
                <div className="p-4 border-t">
                    <Separator className="my-2" />
                    <Button 
                        onClick={logout} 
                        variant="destructive" 
                        className="w-full"
                    >
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* 2. ÁREA DE CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* HEADER (Barra superior) */}
                <header className="h-16 border-b bg-white flex items-center px-6">
                    <h2 className="text-lg font-semibold text-gray-700">
                        {/* Aquí podríamos mostrar el título de la página actual */}
                        Panel Principal
                    </h2>
                    {/* Placeholder de perfil de usuario */}
                    <div className="ml-auto text-sm text-gray-500">
                        Usuario: {useAuthStore.getState().accessToken ? 'Conectado' : 'Desconectado'}
                    </div>
                </header>

                {/* CONTENIDO (Scrollable) */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Button variant={"destructive"}>Hola</Button>
                    {/* Renderiza el componente de la ruta activa (ej: /dashboard, /habitaciones) */}
                    <Outlet /> 
                </main>

            </div>
        </div>
    );
};