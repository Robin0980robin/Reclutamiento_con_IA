import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Briefcase } from 'lucide-react';

const VacancySchema = z.object({
  titulo: z.string().min(5, "Título demasiado corto"),
  descripcion: z.string().min(20, "Descripción demasiado corta"),
  requisitos: z.string().min(10, "Los requisitos son necesarios para la IA"),
  salario: z.string().optional(),
  tipo_contrato: z.enum(['tiempo_completo', 'medio_tiempo', 'remoto', 'hibrido']),
});

type VacancyFormValues = z.infer<typeof VacancySchema>;

const CreateVacancyForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { createVacancy } = useData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<VacancyFormValues>({
    resolver: zodResolver(VacancySchema),
    defaultValues: { tipo_contrato: 'tiempo_completo' }
  });

  const onSubmit = async (data: VacancyFormValues) => {
    setIsLoading(true);
    const success = await createVacancy({
      titulo: data.titulo,
      descripcion: data.descripcion,
      requisitos: data.requisitos,
      salario: data.salario || 'A convenir',
      tipo_contrato: data.tipo_contrato
    });
    
    setIsLoading(false);
    
    if (success) {
      toast({ title: "Vacante publicada correctamente" });
      onSuccess();
    } else {
      toast({ title: "Error al publicar", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-1">
        <Label>Título del Puesto</Label>
        <Input {...register("titulo")} placeholder="Ej: Desarrollador React" />
        {errors.titulo && <p className="text-xs text-red-500">{errors.titulo.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Contrato</Label>
          <Select onValueChange={(v) => setValue("tipo_contrato", v as any)} defaultValue="tiempo_completo">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tiempo_completo">Tiempo Completo</SelectItem>
              <SelectItem value="medio_tiempo">Medio Tiempo</SelectItem>
              <SelectItem value="remoto">Remoto</SelectItem>
              <SelectItem value="hibrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Salario</Label>
          <Input {...register("salario")} placeholder="Ej: $2000" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Descripción</Label>
        <Textarea {...register("descripcion")} rows={3} />
      </div>
      <div className="space-y-1">
        <Label>Requisitos (Claves para la IA)</Label>
        <Textarea {...register("requisitos")} rows={2} placeholder="Habilidades técnicas..." />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Publicar Ahora"}
      </Button>
    </form>
  );
};

export default CreateVacancyForm;