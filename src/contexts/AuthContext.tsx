import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  loginAttempts: number;
  isLocked: boolean;
  lockUntil: number | null;
  signUp: (email: string, password: string, nombreCompleto: string, rol: 'candidato' | 'reclutador') => Promise<{ error: any }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetLoginAttempts: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const navigate = useNavigate();

  // Verificar bloqueo al cargar
  useEffect(() => {
    const lockedUntil = localStorage.getItem('lockUntil');
    if (lockedUntil) {
      const lockTime = parseInt(lockedUntil);
      if (Date.now() < lockTime) {
        setIsLocked(true);
        setLockUntil(lockTime);
      } else {
        localStorage.removeItem('lockUntil');
        localStorage.removeItem('loginAttempts');
      }
    }
  }, []);

  // Timer para desbloqueo automático
  useEffect(() => {
    if (isLocked && lockUntil) {
      const timer = setInterval(() => {
        if (Date.now() >= lockUntil) {
          setIsLocked(false);
          setLockUntil(null);
          setLoginAttempts(0);
          localStorage.removeItem('lockUntil');
          localStorage.removeItem('loginAttempts');
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockUntil]);

  useEffect(() => {
    // Configurar listener de cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, nombreCompleto: string, rol: 'candidato' | 'reclutador') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nombre_completo: nombreCompleto,
          rol: rol
        }
      }
    });
    
    if (!error) {
      navigate('/');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    // Verificar si está bloqueado
    if (isLocked) {
      const remainingTime = Math.ceil((lockUntil! - Date.now()) / 1000 / 60);
      return { 
        error: { 
          message: `Tu cuenta está bloqueada por ${remainingTime} minuto(s) por seguridad. Intenta más tarde.` 
        } 
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      // Incrementar intentos fallidos
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      localStorage.setItem('loginAttempts', attempts.toString());

      // Bloquear después de 5 intentos fallidos
      if (attempts >= 5) {
        const lockTime = Date.now() + 5 * 60 * 1000; // 5 minutos
        setIsLocked(true);
        setLockUntil(lockTime);
        localStorage.setItem('lockUntil', lockTime.toString());
        return { 
          error: { 
            message: 'Tu cuenta se ha bloqueado por 5 minutos para protegerte. Demasiados intentos fallidos.' 
          } 
        };
      }

      return { error };
    }
    
    // Login exitoso
    setLoginAttempts(0);
    localStorage.removeItem('loginAttempts');
    
    // Guardar preferencia de "recordar sesión"
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
    
    navigate('/');
    return { error: null };
  };

  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    setIsLocked(false);
    setLockUntil(null);
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockUntil');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      loginAttempts,
      isLocked,
      lockUntil,
      signUp, 
      signIn, 
      signOut,
      resetLoginAttempts 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};