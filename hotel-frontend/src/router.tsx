// src/router.tsx (Versión Limpia)

import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage"; 
import { AuthGuard } from "./components/AuthGuard"; // <<<--- NUEVA IMPORTACIÓN
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { HabitacionesPage } from "./pages/HabitacionesPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      // Usamos el componente AuthGuard importado
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    // Rutas protegidas
    children: [
      {
        path: "dashboard",
        element: <h1>Panel de Control del Hotel (Protegido)</h1>,
      },
      {
        path: "habitaciones",
        element: <HabitacionesPage />,
      },
      // NOTA: Recuerda crear el componente DashboardLayout
      // ... futuras rutas ...
    ],
  },
]);