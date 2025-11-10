import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { z } from 'zod';
import FieldHelper from '@/components/FieldHelper';
import { Progress } from '@/components/ui/progress';

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    // Verificar si hay una sesión de recuperación activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: 'Enlace inválido o expirado',
          description: 'Por favor, solicita un nuevo enlace de recuperación',
          variant: 'destructive'
        });
        navigate('/forgot-password');
      }
    });
  }, [navigate]);

  const validatePassword = (pwd: string) => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(pwd)) errors.push('Una mayúscula');
    if (!/[a-z]/.test(pwd)) errors.push('Una minúscula');
    if (!/[0-9]/.test(pwd)) errors.push('Un número');
    setValidationErrors(errors);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const getPasswordStrength = () => {
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    return checks.filter(Boolean).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
    try {
      passwordSchema.parse({ password, confirmPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Error de validación',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      }
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: '✓ Contraseña actualizada con éxito',
        description: 'Ya puedes iniciar sesión con tu nueva contraseña',
        className: 'bg-green-50 border-green-200'
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar la contraseña',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();
  const progressValue = (strength / 5) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Nueva contraseña</CardTitle>
          <CardDescription>
            Crea una contraseña segura para proteger tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <FieldHelper
                  content="Tu contraseña debe ser segura: mínimo 8 caracteres, con mayúsculas, minúsculas y números"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-10 pr-10"
                  required
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Seguridad: {['Muy débil', 'Débil', 'Regular', 'Buena', 'Excelente'][strength - 1]}
                    </span>
                  </div>
                  <Progress 
                    value={progressValue} 
                    className={`h-2 ${
                      strength <= 2 ? 'bg-red-200' : 
                      strength <= 3 ? 'bg-yellow-200' : 
                      'bg-green-200'
                    }`}
                  />
                  
                  {validationErrors.length > 0 && (
                    <div className="text-xs space-y-1">
                      <p className="text-muted-foreground">Requisitos faltantes:</p>
                      <ul className="space-y-1">
                        {validationErrors.map((error, idx) => (
                          <li key={idx} className="flex items-center gap-1 text-destructive">
                            <XCircle className="h-3 w-3" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationErrors.length === 0 && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Contraseña válida
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {confirmPassword && (
                <div className="text-xs">
                  {password === confirmPassword ? (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Las contraseñas coinciden
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-destructive">
                      <XCircle className="h-3 w-3" />
                      Las contraseñas no coinciden
                    </span>
                  )}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || validationErrors.length > 0 || password !== confirmPassword}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando contraseña...
                </>
              ) : (
                'Establecer nueva contraseña'
              )}
            </Button>

            <div className="text-xs text-muted-foreground bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 inline mr-1" />
              <strong>Seguro:</strong> Tu contraseña se almacena de forma encriptada y nunca podrá ser vista por nadie
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
