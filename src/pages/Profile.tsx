import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LayoutPublic from '@/components/LayoutPublic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Building2, Phone, Camera, Loader2, Save, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Estados del formulario basados en metadatos actuales
  const [formData, setFormData] = useState({
    nombre: user?.user_metadata?.nombre_completo || '',
    empresa: user?.user_metadata?.nombre_empresa || '',
    telefono: user?.user_metadata?.telefono || '',
    avatar_url: user?.user_metadata?.avatar_url || '',
  });

  const isReclutador = user?.user_metadata?.rol === 'reclutador';

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        nombre_completo: formData.nombre,
        nombre_empresa: formData.empresa,
        telefono: formData.telefono,
        avatar_url: formData.avatar_url
      }
    });

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil actualizado", description: "Tus cambios se han guardado correctamente." });
    }
  };

  return (
    <LayoutPublic mainClassName="bg-[#f8fafc] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* COLUMNA IZQUIERDA: AVATAR Y ACCIONES RÁPIDAS */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                    <AvatarImage src={formData.avatar_url} />
                    <AvatarFallback className="bg-blue-600 text-white text-3xl font-black">
                      {formData.nombre.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-md">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{formData.nombre}</h2>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">
                  {isReclutador ? 'Reclutador' : 'Candidato'}
                </p>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full text-red-500 hover:bg-red-50 border-red-100" onClick={() => signOut()}>
              Cerrar Sesión
            </Button>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO DE DATOS */}
          <div className="flex-1">
            <Card className="border-none shadow-lg overflow-hidden">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-xl font-bold">Información de Perfil</CardTitle>
                <CardDescription>Configura cómo te ven los demás en la plataforma.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Nombre Completo</Label>
                      <Input 
                        value={formData.nombre} 
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        className="bg-slate-50 border-none h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email (Solo lectura)</Label>
                      <Input value={user?.email} disabled className="bg-slate-100 border-none h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Teléfono</Label>
                      <Input 
                        value={formData.telefono} 
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        className="bg-slate-50 border-none h-12"
                        placeholder="+593 ..."
                      />
                    </div>
                    
                    {isReclutador ? (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Nombre de la Empresa</Label>
                        <Input 
                          value={formData.empresa} 
                          onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                          className="bg-slate-50 border-none h-12"
                          placeholder="Mi Empresa S.A."
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Link a CV Externo</Label>
                        <Input 
                          placeholder="https://drive.google.com/..." 
                          className="bg-slate-50 border-none h-12"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full h-12 bg-blue-600 font-bold text-lg" disabled={loading}>
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                      Guardar Cambios
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </LayoutPublic>
  );
};

export default Profile;