import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Vacancy } from '@/contexts/DataContext';
import LayoutPublic from '@/components/LayoutPublic'; 
import { 
  Loader2, PlusCircle, Briefcase, ChevronRight, 
  Users, LayoutDashboard, CheckCircle2, XCircle, Search, Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CreateVacancyForm from '@/components/CreateVacancyForm'; 
import AdminPostulations from '@/components/AdminPostulations';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user } = useAuth();
  const { vacancies, loading, fetchVacancies } = useData();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  
  // ESTADOS PARA BÚSQUEDA Y FILTROS AVANZADOS
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contractFilter, setContractFilter] = useState("all");

  // LÓGICA DE FILTRADO UNIFICADA
  const filteredVacancies = useMemo(() => {
    let result = [...vacancies];
    
    if (searchTerm) {
      result = result.filter(v => 
        v.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.requisitos.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      result = result.filter(v => v.estado === statusFilter);
    }

    if (contractFilter !== "all") {
      result = result.filter(v => v.tipo_contrato === contractFilter);
    }
    
    return result;
  }, [vacancies, searchTerm, statusFilter, contractFilter]);

  const stats = useMemo(() => ({
    total: vacancies.length,
    activas: vacancies.filter(v => v.estado === 'abierta').length,
    cerradas: vacancies.filter(v => v.estado === 'cerrada').length
  }), [vacancies]);

  if (user?.user_metadata?.rol !== 'reclutador') {
    return <LayoutPublic><div className="py-20 text-center"><h1>Acceso Restringido</h1></div></LayoutPublic>;
  }

  return (
    <LayoutPublic mainClassName="bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
              Recruiter Hub
            </h1>
            <p className="text-slate-500 font-medium">Gestiona tu talento y optimiza con IA.</p>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-blue-200">
                <PlusCircle className="mr-2 h-5 w-5" /> Nueva Vacante
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white overflow-y-auto sm:max-w-2xl border-l-4 border-blue-600">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-3xl font-black">Publicar Oferta</SheetTitle>
              </SheetHeader>
              <CreateVacancyForm onSuccess={() => { setIsSheetOpen(false); fetchVacancies(); }} />
            </SheetContent>
          </Sheet>
        </div>

        {/* MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Vacantes', value: stats.total, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Activas', value: stats.activas, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Finalizadas', value: stats.cerradas, icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-50' }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white shadow-sm bg-white flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PANEL DE FILTROS Y LISTADO */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Buscar por título o requisitos..." 
                  className="pl-10 bg-slate-50 border-none h-12 rounded-xl text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo de Contrato</label>
                <select 
                  className="w-full h-11 px-4 bg-slate-50 border-none rounded-xl text-xs font-bold appearance-none cursor-pointer"
                  value={contractFilter}
                  onChange={(e) => setContractFilter(e.target.value)}
                >
                  <option value="all">Todos los Contratos</option>
                  <option value="tiempo_completo">Tiempo Completo</option>
                  <option value="medio_tiempo">Medio Tiempo</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant={statusFilter === 'all' ? 'default' : 'outline'} 
                  className="flex-1 text-[10px] font-bold uppercase rounded-xl h-10"
                  onClick={() => setStatusFilter('all')}
                >
                  Todas
                </Button>
                <Button 
                  variant={statusFilter === 'abierta' ? 'default' : 'outline'} 
                  className="flex-1 text-[10px] font-bold uppercase rounded-xl h-10 border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => setStatusFilter('abierta')}
                >
                  Abiertas
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600 h-10 w-10" /></div>
              ) : filteredVacancies.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border-2 border-dashed text-center">
                  <p className="text-slate-400 text-xs italic font-medium">No hay vacantes que coincidan con los filtros.</p>
                </div>
              ) : (
                filteredVacancies.map((v) => (
                  <button 
                    key={v.id} 
                    onClick={() => setSelectedVacancy(v)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex flex-col gap-2 relative overflow-hidden group shadow-sm ${
                      selectedVacancy?.id === v.id 
                      ? 'border-blue-600 bg-white ring-4 ring-blue-50' 
                      : 'border-transparent bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-slate-800 text-md leading-tight group-hover:text-blue-600 transition-colors">
                        {v.titulo}
                      </span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${selectedVacancy?.id === v.id ? 'text-blue-600 rotate-90' : 'text-slate-300'}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={v.estado === 'abierta' ? 'default' : 'secondary'} className="text-[9px] font-bold uppercase py-0 px-1.5">
                        {v.estado}
                      </Badge>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {v.tipo_contrato.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ÁREA DE TRABAJO */}
          <div className="lg:col-span-8">
            {selectedVacancy ? (
              <AdminPostulations 
                vacancyId={selectedVacancy.id} 
                vacancyRequirements={selectedVacancy.requisitos} 
              />
            ) : (
              <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 shadow-inner">
                <Users className="h-20 w-20 opacity-10 text-blue-600 mb-4" />
                <p className="font-black text-2xl text-slate-500">Centro de Candidatos</p>
                <p className="text-sm font-medium">Usa los filtros de la izquierda para navegar entre tus ofertas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutPublic>
  );
};

export default Dashboard;