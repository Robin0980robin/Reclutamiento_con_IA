import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Vacancy } from '@/contexts/DataContext';
import { supabase } from '@/integrations/supabase/client';
import LayoutPublic from '@/components/LayoutPublic'; 
import VacancyCard from '@/components/VacancyCard'; 
import VacancyDetailsModal from '@/components/VacancyDetailsModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Search, Briefcase, Loader2, History, Filter, X } from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { vacancies, loading } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [contractType, setContractType] = useState("all");
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [myPostulations, setMyPostulations] = useState<any[]>([]);

  // 1. LÓGICA DE FILTRADO CORREGIDA
  const filteredVacancies = useMemo(() => {
    let result = Array.isArray(vacancies) ? vacancies.filter(v => v.estado === 'abierta') : [];
    
    if (searchTerm) {
      result = result.filter(v => v.titulo.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (contractType !== "all") {
      result = result.filter(v => v.tipo_contrato === contractType);
    }
    
    return result;
  }, [vacancies, searchTerm, contractType]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('postulaciones')
      .select('*, vacantes(titulo)')
      .eq('id_usuario', user?.id);
    setMyPostulations(data || []);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;

  return (
    <LayoutPublic mainClassName="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <h1 className="text-3xl font-black text-slate-900">Mercado de Empleos</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={fetchHistory} variant="outline" className="font-bold border-2"><History className="mr-2 h-4 w-4" /> Historial</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-white">
              <DialogHeader><DialogTitle className="text-xl font-bold">Mis Aplicaciones</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-4">
                {myPostulations.map(p => (
                  <div key={p.id} className="p-3 border rounded-xl flex justify-between bg-slate-50">
                    <span className="font-bold text-sm">{p.vacantes?.titulo}</span>
                    <span className="text-blue-600 font-black">{p.puntuacion_ia}%</span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* FILTROS INTEGRADOS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-2xl border shadow-sm">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar puesto..." 
              className="pl-10 h-10 border-none bg-slate-50" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <select 
              className="w-full h-10 pl-10 bg-slate-50 border-none rounded-md text-sm appearance-none cursor-pointer font-medium"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
            >
              <option value="all">Tipo de contrato</option>
              <option value="tiempo_completo">Tiempo Completo</option>
              <option value="remoto">Remoto</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>
          <Button variant="ghost" className="text-slate-400 h-10" onClick={() => {setSearchTerm(""); setContractType("all")}}>
            <X className="h-4 w-4 mr-1" /> Limpiar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVacancies.map(v => (
            <div key={v.id} onClick={() => setSelectedVacancy(v)} className="cursor-pointer">
              <VacancyCard vacancy={v} isCandidateView={true} />
            </div>
          ))}
        </div>

        <VacancyDetailsModal vacancy={selectedVacancy} isOpen={!!selectedVacancy} onClose={() => setSelectedVacancy(null)} />
      </div>
    </LayoutPublic>
  );
};

export default CandidateDashboard;