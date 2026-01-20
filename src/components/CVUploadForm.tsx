// src/components/CVUploadForm.tsx (CREAR ESTE ARCHIVO)

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud, CheckCircle, XCircle } from 'lucide-react';

interface CVUploadFormProps {
  onUploadSuccess: () => void;
  isUploaded: boolean;
}

const CVUploadForm: React.FC<CVUploadFormProps> = ({ onUploadSuccess, isUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      // Validación simple del tipo de archivo (PDF recomendado)
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Archivo No Válido",
          description: "Por favor, sube tu CV en formato PDF.",
          variant: "destructive"
        });
        setFile(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: "Archivo Requerido",
        description: "Por favor, selecciona un archivo PDF para subir.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // ** SIMULACIÓN DE SUBIDA DE ARCHIVO **
    await new Promise(resolve => setTimeout(resolve, 1500)); // Espera de 1.5 segundos
    
    setIsLoading(false);
    
    // ** SIMULACIÓN DE ÉXITO **
    toast({
      title: "CV Subido con Éxito",
      description: `El archivo "${file.name}" ha sido guardado.`,
      className: 'bg-green-50 border-green-200'
    });
    
    onUploadSuccess();
    setFile(null);
  };

  if (isUploaded) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
        <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
        <p className="font-semibold text-green-800">CV Analizado y Guardado</p>
        <p className="text-sm text-green-700">Puedes subir uno nuevo para actualizar tu perfil.</p>
        <Button 
            variant="ghost" 
            className="mt-3 text-green-600 hover:text-green-800"
            onClick={() => onUploadSuccess()} // Llama a la función para "refrescar" o permitir nueva subida
        >
            Subir nuevo CV
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cv-upload">Sube tu CV (formato PDF)</Label>
        <Input 
          id="cv-upload" 
          type="file" 
          accept=".pdf"
          onChange={handleFileChange} 
          className="file:text-primary file:font-semibold"
        />
        {file && <p className="text-sm text-muted-foreground mt-1">Archivo seleccionado: **{file.name}**</p>}
        {!file && <p className="text-xs text-muted-foreground mt-1 flex items-center"><XCircle className="h-3 w-3 mr-1 text-red-500" /> Archivo no seleccionado.</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !file}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Subiendo y Analizando...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-5 w-5" />
            Subir CV
          </>
        )}
      </Button>
    </form>
  );
};

export default CVUploadForm;