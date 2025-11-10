import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import FieldHelper from '@/components/FieldHelper';
import { Progress } from '@/components/ui/progress';

const emailSchema = z.object({
  email: z.string().email('Correo electrónico inválido')
});

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
    try {
      emailSchema.parse({ email });
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
    setStep(2);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) throw error;

      setStep(3);
      setEmailSent(true);
      
      toast({
        title: '✓ Correo enviado con éxito',
        description: 'Revisa tu bandeja de entrada para continuar',
        className: 'bg-green-50 border-green-200'
      });
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo enviar el correo de recuperación',
        variant: 'destructive'
      });
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const progressValue = (step / 4) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio de sesión
            </Button>
          </Link>
          
          <div>
            <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
            <CardDescription className="mt-2">
              Te guiaremos paso a paso para restablecer tu acceso de forma segura
            </CardDescription>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Paso {step} de 4</span>
              <span>{Math.round(progressValue)}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <FieldHelper
                    content="Ingresa el correo con el que te registraste. Te enviaremos un enlace seguro para restablecer tu contraseña"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando enlace...
                  </>
                ) : (
                  'Enviar enlace de recuperación'
                )}
              </Button>

              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <strong>Proceso:</strong> Este proceso toma ≤ 1 minuto
                <ol className="mt-2 ml-4 list-decimal space-y-1">
                  <li>Ingresar tu correo</li>
                  <li>Recibir enlace seguro</li>
                  <li>Establecer nueva contraseña</li>
                  <li>Confirmación de éxito</li>
                </ol>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-950 p-3">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">¡Correo enviado!</h3>
                <p className="text-sm text-muted-foreground">
                  Hemos enviado un enlace de recuperación a:
                </p>
                <p className="font-medium text-primary">{email}</p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 text-sm text-left space-y-2">
                <p className="font-semibold">⏱️ Próximos pasos:</p>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>Revisa tu bandeja de entrada</li>
                  <li>Haz clic en el enlace del correo</li>
                  <li>Crea tu nueva contraseña</li>
                  <li>Inicia sesión con tus nuevas credenciales</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-3">
                  Si no ves el correo en 2-3 minutos, revisa tu carpeta de spam
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEmailSent(false);
                  setStep(1);
                  setEmail('');
                }}
              >
                Enviar a otro correo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
