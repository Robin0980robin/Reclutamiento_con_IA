import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Brain } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

const signupSchema = z.object({
  nombreCompleto: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }).max(100, { message: "El nombre es demasiado largo" }),
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z.string(),
  rol: z.enum(['candidato', 'reclutador'])
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function Auth() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "candidato" as 'candidato' | 'reclutador'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      loginSchema.parse(loginData);
      
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Error de inicio de sesión",
            description: "Correo o contraseña incorrectos"
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message
          });
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: err.errors[0].message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      signupSchema.parse(signupData);
      
      const { error } = await signUp(
        signupData.email,
        signupData.password,
        signupData.nombreCompleto,
        signupData.rol
      );
      
      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Error de registro",
            description: "Este correo ya está registrado"
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message
          });
        }
      } else {
        toast({
          title: "¡Registro exitoso!",
          description: "Bienvenido a la plataforma"
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: err.errors[0].message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Brain className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">TalentAI</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Reclutamiento Inteligente</h1>
          <p className="text-muted-foreground">Conecta talento con oportunidades</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="signup">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Bienvenido de nuevo</CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Correo electrónico</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Crear cuenta</CardTitle>
                <CardDescription>Únete a nuestra plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nombre completo</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Juan Pérez"
                      value={signupData.nombreCompleto}
                      onChange={(e) => setSignupData({ ...signupData, nombreCompleto: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Correo electrónico</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-rol">Tipo de cuenta</Label>
                    <select
                      id="signup-rol"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={signupData.rol}
                      onChange={(e) => setSignupData({ ...signupData, rol: e.target.value as 'candidato' | 'reclutador' })}
                    >
                      <option value="candidato">Candidato - Busco empleo</option>
                      <option value="reclutador">Reclutador - Busco talento</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirmar contraseña</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}