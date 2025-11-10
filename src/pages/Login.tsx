import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Brain, Mail, Lock, Eye, EyeOff, Home, AlertTriangle } from "lucide-react";
import FieldHelper from "@/components/FieldHelper";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

export default function Login() {
  const { signIn, user, isLocked, lockUntil, loginAttempts } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Actualizar tiempo restante de bloqueo
  useEffect(() => {
    if (isLocked && lockUntil) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((lockUntil - Date.now()) / 1000 / 60);
        setRemainingTime(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLocked, lockUntil]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        variant: "destructive",
        title: "Cuenta bloqueada",
        description: `Tu cuenta está bloqueada por ${remainingTime} minuto(s) para protegerte.`
      });
      return;
    }

    setIsLoading(true);

    try {
      loginSchema.parse(loginData);
      
      const { error } = await signIn(loginData.email, loginData.password, rememberMe);
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          const attemptsLeft = 5 - loginAttempts - 1;
          toast({
            variant: "destructive",
            title: "Error de inicio de sesión",
            description: attemptsLeft > 0 
              ? `Correo o contraseña incorrectos. Te quedan ${attemptsLeft} intentos.`
              : "Correo o contraseña incorrectos"
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Back to home button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate('/')}
          aria-label="Volver al inicio"
        >
          <Home className="h-4 w-4 mr-2" />
          Volver al inicio
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Brain className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">TalentMatch</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Bienvenido de nuevo</h1>
          <p className="text-muted-foreground">Ingresa a tu cuenta para continuar</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              ¿No tienes cuenta? <Link to="/register" className="text-primary hover:underline">Regístrate aquí</Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLocked && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Tu cuenta se ha bloqueado por {remainingTime} minuto(s) para protegerte después de varios intentos fallidos.
                  {" "}<Link to="/forgot-password" className="underline font-medium">¿Olvidaste tu contraseña?</Link>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <FieldHelper content="Ingresa el correo que usaste al registrarte" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    disabled={isLocked}
                    aria-describedby="email-description"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <FieldHelper content="Mínimo 6 caracteres. Nunca compartas tu contraseña." />
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    disabled={isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  aria-label="Recordar mi sesión"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Recordar mi sesión
                </label>
                <FieldHelper content="No activar en equipos públicos. Tu sesión permanecerá activa." />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || isLocked}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              {loginAttempts > 0 && !isLocked && (
                <p className="text-sm text-muted-foreground text-center">
                  Intentos fallidos: {loginAttempts}/5
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
