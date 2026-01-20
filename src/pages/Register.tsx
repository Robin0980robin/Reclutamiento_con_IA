import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Brain, User, Mail, Lock, Eye, EyeOff, Home, Info, Check, X } from "lucide-react";
import FieldHelper from "@/components/FieldHelper";
import { Checkbox } from "@/components/ui/checkbox";
import TermsOfService from "@/components/TermsOfService";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import { Progress } from "@/components/ui/progress";

const signupSchema = z.object({
  nombreCompleto: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }).max(100, { message: "El nombre es demasiado largo" }),
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(/[A-Z]/, { message: "Debe contener al menos una mayúscula" })
    .regex(/[0-9]/, { message: "Debe contener al menos un número" }),
  confirmPassword: z.string(),
  rol: z.enum(['candidato', 'reclutador']),
  acceptTerms: z.boolean().refine((val) => val === true, { message: "Debes aceptar los términos" }),
  acceptPrivacy: z.boolean().refine((val) => val === true, { message: "Debes aceptar la política de privacidad" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;
  return Math.min(strength, 100);
};

export default function Register() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [signupData, setSignupData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "candidato" as 'candidato' | 'reclutador',
    acceptTerms: false,
    acceptPrivacy: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(signupData.password));
  }, [signupData.password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-destructive";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Muy débil";
    if (passwordStrength < 50) return "Débil";
    if (passwordStrength < 75) return "Media";
    return "Fuerte";
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <Brain className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">TalentMatch</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Crear cuenta</h1>
          <p className="text-muted-foreground">Únete a nuestra plataforma</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Registro</CardTitle>
            <CardDescription>
              ¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:underline">Inicia sesión aquí</Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <FieldHelper content="Tu nombre completo tal como aparecerá en tu perfil" />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    className="pl-10"
                    value={signupData.nombreCompleto}
                    onChange={(e) => setSignupData({ ...signupData, nombreCompleto: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <FieldHelper content="Usaremos este correo para notificaciones y acceso a tu cuenta" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="rol">Tipo de cuenta</Label>
                  <FieldHelper content="Candidato: busca empleo. Reclutador: publica ofertas y busca talento" />
                </div>
                <select
                  id="rol"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={signupData.rol}
                  onChange={(e) => setSignupData({ ...signupData, rol: e.target.value as 'candidato' | 'reclutador' })}
                >
                  <option value="candidato">Candidato - Busco empleo</option>
                  <option value="reclutador">Reclutador - Busco talento</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <FieldHelper content="Crea una contraseña segura. Nunca la compartas con nadie" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                    aria-describedby="password-requirements password-strength"
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
                
                {signupData.password && (
                  <div id="password-strength" className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Fortaleza:</span>
                      <span className="font-medium">{getPasswordStrengthText()}</span>
                    </div>
                    <Progress value={passwordStrength} className={getPasswordStrengthColor()} />
                  </div>
                )}

                <div id="password-requirements" className="space-y-1 text-xs">
                  <div className={`flex items-center gap-2 ${signupData.password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {signupData.password.length >= 8 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[A-Z]/.test(signupData.password) ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {/[A-Z]/.test(signupData.password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>Al menos una mayúscula</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[0-9]/.test(signupData.password) ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {/[0-9]/.test(signupData.password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>Al menos un número</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signupData.confirmPassword && signupData.password !== signupData.confirmPassword && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Las contraseñas no coinciden
                  </p>
                )}
                {signupData.confirmPassword && signupData.password === signupData.confirmPassword && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Las contraseñas coinciden
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={signupData.acceptTerms}
                    onCheckedChange={(checked) => setSignupData({ ...signupData, acceptTerms: checked as boolean })}
                    aria-label="Aceptar términos de servicio"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Acepto los{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-primary hover:underline font-medium"
                    >
                      Términos de Servicio
                    </button>
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="privacy" 
                    checked={signupData.acceptPrivacy}
                    onCheckedChange={(checked) => setSignupData({ ...signupData, acceptPrivacy: checked as boolean })}
                    aria-label="Aceptar política de privacidad"
                  />
                  <label
                    htmlFor="privacy"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Acepto la{" "}
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                      className="text-primary hover:underline font-medium"
                    >
                      Política de Privacidad
                    </button>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Diálogos de Términos y Privacidad - Se renderizan solo cuando están abiertos */}
      {showTerms && <TermsOfService open={showTerms} onOpenChange={setShowTerms} />}
      {showPrivacy && <PrivacyPolicy open={showPrivacy} onOpenChange={setShowPrivacy} />}
    </div>
  );
}
