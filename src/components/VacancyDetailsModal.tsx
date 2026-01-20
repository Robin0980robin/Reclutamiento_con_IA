import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Clock, DollarSign, Send, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Vacancy } from '@/contexts/DataContext';

interface VacancyDetailsModalProps {
  vacancy: Vacancy | null;
  isOpen: boolean;
  onClose: () => void;
}

const VacancyDetailsModal: React.FC<VacancyDetailsModalProps> = ({ vacancy, isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!vacancy) return null;

  const handlePostular = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // CORRECCIÓN DE CAMPOS: id_usuario y experiencia_resumen según TS
    const { error } = await supabase.from('postulaciones').insert([{
      id_vacante: vacancy.id,
      id_usuario: user?.id, 
      nombre_candidato: user?.user_metadata.nombre_completo || formData.get('nombre') as string,
      email_candidato: user?.email as string,
      experiencia_resumen: formData.get('experiencia') as string,
      habilidades_clave: formData.get('habilidades') as string,
      link_portfolio: formData.get('portfolio') as string
    }]);

    setLoading(false);

    if (error) {
      console.error("Error:", error);
      toast({ title: "Error al postular", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "¡Postulación enviada con éxito!" });
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {submitted ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold">¡Postulación Enviada!</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 bg-muted/30 p-8 border-r">
              <h2 className="text-2xl font-bold mb-4">{vacancy.titulo}</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {vacancy.tipo_contrato}</p>
                <p className="flex items-center gap-2 font-bold text-primary"><DollarSign className="h-4 w-4" /> {vacancy.salario}</p>
              </div>
              <p className="mt-6 text-sm leading-relaxed">{vacancy.descripcion}</p>
            </div>

            <div className="md:col-span-3 p-8">
              <form onSubmit={handlePostular} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input name="nombre" defaultValue={user?.user_metadata.nombre_completo} required />
                </div>
                <div className="space-y-2">
                  <Label>Resumen de Experiencia</Label>
                  <Textarea name="experiencia" required placeholder="Tus logros principales..." />
                </div>
                <div className="space-y-2">
                  <Label>Habilidades (separadas por comas)</Label>
                  <Input name="habilidades" placeholder="React, SQL, Node..." required />
                </div>
                <div className="space-y-2">
                  <Label>Link Portfolio/LinkedIn</Label>
                  <Input name="portfolio" placeholder="https://..." />
                </div>
                <Button type="submit" className="w-full h-12" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
                  Postularme Ahora
                </Button>
              </form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VacancyDetailsModal;