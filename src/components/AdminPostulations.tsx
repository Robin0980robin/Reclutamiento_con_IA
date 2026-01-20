import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { 
  Loader2, BrainCircuit, User, Trophy, FileDown, Trash2, CheckCircle2 
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AdminPostulationsProps {
  vacancyId: string;
  vacancyRequirements: string;
}

const AdminPostulations = ({ vacancyId, vacancyRequirements }: AdminPostulationsProps) => {
  const [postulations, setPostulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const fetchPostulations = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('postulaciones')
      .select('*') as any)
      .eq('id_vacante', vacancyId)
      .order('puntuacion_ia', { ascending: false });

    if (!error) setPostulations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (vacancyId) fetchPostulations();
  }, [vacancyId]);

  // FUNCIÓN PARA ELIMINAR POSTULACIÓN
  const deletePostulation = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este candidato?")) return;

    const { error } = await supabase
      .from('postulaciones')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: "No se pudo eliminar.", variant: "destructive" });
    } else {
      toast({ title: "Eliminado", description: "Candidato removido de la lista." });
      setPostulations(postulations.filter(p => p.id !== id));
    }
  };

  const analyzeWithIA = async () => {
    setAnalyzing(true);
    const normalize = (text: string) => 
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9, ]/g, "");

    const requirements = normalize(vacancyRequirements).split(',').map(r => r.trim()).filter(r => r.length > 0);

    // Creamos una copia para actualizar el estado local inmediatamente
    const updatedPostulations = [];

    for (const post of postulations) {
      const candidateProfile = normalize(`${post.habilidades_clave} ${post.experiencia_resumen}`);
      let matches = 0;
      requirements.forEach(req => {
        const regex = new RegExp(`\\b${req}\\b`, 'gi');
        if (candidateProfile.match(regex)) matches++;
      });

      const finalScore = Math.round(Math.min((matches / requirements.length) * 100, 100));
      let feedback = finalScore >= 85 ? "Perfil de alta prioridad." : 
                     finalScore >= 60 ? "Candidato competente." : 
                     finalScore >= 30 ? "Requiere capacitación." : "Baja afinidad.";

      await (supabase.from('postulaciones') as any).update({ 
        puntuacion_ia: finalScore,
        comentarios_reclutador: feedback
      }).eq('id', post.id);

      updatedPostulations.push({ ...post, puntuacion_ia: finalScore, comentarios_reclutador: feedback });
    }

    setPostulations(updatedPostulations.sort((a, b) => b.puntuacion_ia - a.puntuacion_ia));
    toast({ title: "IA Actualizada", description: "Ahora puedes exportar el PDF con los comentarios." });
    setAnalyzing(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text("Reporte de Selección IA", 14, 20);
    
    // Mapeo asegurando que comentarios_reclutador no sea null
    const tableRows = postulations.map(p => [
      p.nombre_candidato,
      `${p.puntuacion_ia}%`,
      p.habilidades_clave,
      p.comentarios_reclutador || "Pendiente de análisis"
    ]);

    autoTable(doc, {
      head: [['Candidato', 'Match', 'Habilidades', 'IA Feedback']],
      body: tableRows,
      startY: 30,
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 8 }
    });

    doc.save(`Reporte_IA.pdf`);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600 h-10 w-10" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-xl font-black text-slate-800">Candidatos</h3>
        <div className="flex gap-2">
          <Button onClick={exportPDF} variant="outline" className="font-bold"><FileDown className="mr-2 h-4 w-4" /> PDF</Button>
          <Button onClick={analyzeWithIA} disabled={analyzing} className="bg-blue-600 font-bold">
            {analyzing ? <Loader2 className="animate-spin h-4 w-4" /> : <BrainCircuit className="mr-2 h-4 w-4" />} Analizar
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {postulations.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border shadow-sm relative group">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deletePostulation(p.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <div className="flex gap-4 mb-4">
              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                {p.nombre_candidato[0]}
              </div>
              <div>
                <h4 className="font-bold text-lg">{p.nombre_candidato}</h4>
                <p className="text-2xl font-black text-blue-600">{p.puntuacion_ia}% Match</p>
              </div>
            </div>

            {p.comentarios_reclutador && (
              <div className="p-3 bg-blue-50 rounded-xl border-l-4 border-blue-600 text-xs text-blue-800 italic">
                <strong>IA:</strong> {p.comentarios_reclutador}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPostulations;