import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Loader2, Camera, Save, X, User, Phone, Mail, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FieldHelper from '@/components/FieldHelper';

interface ProfileData {
  nombre_completo: string;
  telefono: string;
  foto_perfil: string;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<ProfileData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    nombre_completo: '',
    telefono: '',
    foto_perfil: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      const profile = {
        nombre_completo: data.nombre_completo || '',
        telefono: data.telefono || '',
        foto_perfil: data.foto_perfil || ''
      };

      setProfileData(profile);
      setOriginalData(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el perfil',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nombre_completo: profileData.nombre_completo,
          telefono: profileData.telefono,
          foto_perfil: profileData.foto_perfil,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      setOriginalData(profileData);
      setIsEditing(false);
      
      toast({
        title: '✓ Cambios guardados con éxito',
        description: 'Tu perfil ha sido actualizado correctamente',
        className: 'bg-green-50 border-green-200'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setProfileData(originalData);
    }
    setIsEditing(false);
    toast({
      title: 'Cambios cancelados',
      description: 'Se restauraron los valores anteriores'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = profileData.nombre_completo
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Mi Perfil</CardTitle>
            <CardDescription>
              Gestiona tu información personal y configuración de cuenta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={profileData.foto_perfil} alt={profileData.nombre_completo} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => {
                      const url = prompt('Ingresa la URL de tu foto de perfil:');
                      if (url) setProfileData({ ...profileData, foto_perfil: url });
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <FieldHelper
                    content="Tu nombre completo como aparecerá en tu perfil público y en las comunicaciones"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nombre"
                    value={profileData.nombre_completo}
                    onChange={(e) => setProfileData({ ...profileData, nombre_completo: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Ej: Juan Pérez García"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <FieldHelper
                    content="Tu correo electrónico registrado. Contáctanos para cambiar este dato"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <FieldHelper
                    content="Tu número de teléfono para contacto. Incluye código de área"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefono"
                    type="tel"
                    value={profileData.telefono}
                    onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Ej: +593 123 456 789"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  Editar perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar cambios
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={saving}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
