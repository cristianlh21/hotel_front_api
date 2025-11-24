import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Lógica
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // <<<--- Usamos Sonner directamente

// Conexión y Estado
import { apiClient } from "@/api/apiClient";
import { useAuthStore } from "@/store/authStore";

// --- 1. Esquema de Validación (Zod) ---
const LoginSchema = z.object({
  username: z.string().min(1, { message: "El usuario o email es requerido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export const LoginPage = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // POST a /api/token/ (DRF Simple JWT espera 'username' y 'password')
      const response = await apiClient.post("/token/", {
        username: data.username,
        password: data.password,
      });

      const { access, refresh } = response.data;

      // 1. Guardar tokens en el store de Zustand y localStorage
      setTokens(access, refresh);

      // 2. Notificar y redirigir
      toast.success("Inicio de sesión exitoso", {
        description: "Bienvenido al Sistema ERP. Redirigiendo...",
      });

      navigate("/dashboard", { replace: true });

    } catch (error) {
      console.error("Error de login:", error);
      
      let message = "Error de conexión o credenciales incorrectas.";
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
          message = "Usuario o contraseña no válidos.";
      }

      // Mostrar error con Sonner
      toast.error("Error de Autenticación", {
        description: message,
      });
      
      // Resetear solo la contraseña para seguridad
      form.resetField('password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">🔐 Acceso al Hotel ERP</CardTitle>
          <CardDescription className="text-center">
            Ingrese sus credenciales para acceder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Campo de Usuario/Email */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario o Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="admin"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de Contraseña */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botón de Submit */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};