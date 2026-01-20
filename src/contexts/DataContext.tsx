import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Database, Enums } from '@/integrations/supabase/types'; 

export type Vacancy = Database['public']['Tables']['vacantes']['Row'] & {
    estado: Enums<'vacancy_status'>;
    tipo_contrato: Enums<'contract_type'>;
    compatibilidad_ia?: number;
};

interface DataContextType {
  vacancies: Vacancy[];
  loading: boolean;
  error: string | null;
  fetchVacancies: () => Promise<void>;
  createVacancy: (data: any) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVacancies = async () => {
    if (!user) {
        setVacancies([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);

    // Cast 'as any' para evitar errores de inferencia profunda en Supabase
    let query = supabase
      .from('vacantes')
      .select('*') as any; 

    if (user.user_metadata.rol === 'reclutador') {
      // Filtramos por el ID del usuario creador
      query = query.eq('created_by', user.id);
    } else {
      query = query.eq('estado', 'abierta');
    }

    const { data, error: dbError } = await query.order('created_at', { ascending: false });

    if (dbError) {
      setError(dbError.message);
    } else {
      setVacancies(data as Vacancy[]);
    }
    setLoading(false);
  };

  const createVacancy = async (data: any): Promise<boolean> => {
    // Insertamos asignando explícitamente el creador. id_empresa puede ir nulo.
    const { error: dbError } = await supabase
      .from('vacantes')
      .insert([{
        ...data,
        created_by: user?.id, 
        estado: 'abierta'
      }]);

    if (dbError) {
      setError(dbError.message);
      return false;
    }
    await fetchVacancies();
    return true;
  };

  useEffect(() => {
    fetchVacancies();
  }, [user]);

  return (
    <DataContext.Provider value={{ vacancies, loading, error, fetchVacancies, createVacancy }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData debe usarse dentro de DataProvider');
  return context;
};