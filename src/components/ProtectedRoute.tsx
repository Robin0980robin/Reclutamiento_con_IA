// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/hooks/use-i18n'; // Para traducción en caso de error
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  // Opcional: Especifica el rol requerido para acceder a esta ruta
  requiredRole?: 'candidato' | 'reclutador'; 
  // Opcional: Componente a mostrar mientras carga la sesión
  fallback?: React.ReactNode; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, fallback }) => {
  const { user, loading: authLoading } = useAuth();
  const { common } = useI18n(); 

  // Fallback predeterminado para la carga de la sesión
  const defaultFallback = (
    <div className="flex min-h-screen items-center justify-center bg-background/90 backdrop-blur-sm">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <span className="sr-only">{common.loading} sesión...</span>
    </div>
  );

  if (authLoading) {
    return <>{fallback || defaultFallback}</>;
  }

  // 1. Redirigir si no está autenticado
  if (!user) {
    // Redirigir al login si no hay usuario
    return <Navigate to="/login" replace />; 
  }
  
  // 2. Verificar el rol si es requerido
  if (requiredRole) {
    // NOTA: Asumimos que el rol se guarda en user.user_metadata.rol (como se configuró en AuthContext.tsx)
    const userRole = user.user_metadata.rol as ('candidato' | 'reclutador'); 
    
    if (userRole !== requiredRole) {
      // Mostrar mensaje de error de acceso y redirigir
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground mb-4">
            No tienes permiso para acceder a esta página.
            Necesitas ser **{requiredRole.toUpperCase()}**.
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Volver
          </Button>
          {/* Opcionalmente, redirigir a una ruta segura después de un tiempo */}
          <Navigate to="/" replace />
        </div>
      );
    }
  }

  // 3. Renderizar la ruta hija si pasa todas las verificaciones
  return <Outlet />;
};

export default ProtectedRoute;