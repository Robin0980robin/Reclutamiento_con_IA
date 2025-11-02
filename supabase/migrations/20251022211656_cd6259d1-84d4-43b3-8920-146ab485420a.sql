-- Crear tipos enum para roles y estados
CREATE TYPE public.user_role AS ENUM ('candidato', 'reclutador');
CREATE TYPE public.user_status AS ENUM ('activo', 'inactivo');
CREATE TYPE public.contract_type AS ENUM ('tiempo_completo', 'medio_tiempo', 'remoto', 'hibrido');
CREATE TYPE public.company_size AS ENUM ('pequena', 'mediana', 'grande');
CREATE TYPE public.vacancy_status AS ENUM ('abierta', 'cerrada');
CREATE TYPE public.application_status AS ENUM ('en_revision', 'aceptado', 'rechazado');

-- Tabla de perfiles de usuarios
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  rol user_role NOT NULL,
  foto_perfil TEXT,
  telefono TEXT,
  estado user_status DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de empresas
CREATE TABLE public.empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre_empresa TEXT NOT NULL,
  sector TEXT,
  tamano_empresa company_size,
  direccion TEXT,
  sitio_web TEXT,
  descripcion TEXT,
  logo_empresa TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de currículums
CREATE TABLE public.curriculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  experiencia TEXT,
  educacion TEXT,
  habilidades TEXT[],
  idiomas TEXT[],
  certificaciones TEXT[],
  resumen_perfil TEXT,
  cv_pdf TEXT,
  porcentaje_compatibilidad INTEGER DEFAULT 0,
  recomendaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de vacantes
CREATE TABLE public.vacantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_empresa UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  requisitos TEXT,
  habilidades_necesarias TEXT[],
  salario TEXT,
  tipo_contrato contract_type,
  estado vacancy_status DEFAULT 'abierta',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de postulaciones
CREATE TABLE public.postulaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_vacante UUID NOT NULL REFERENCES public.vacantes(id) ON DELETE CASCADE,
  id_usuario UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  estado application_status DEFAULT 'en_revision',
  puntuacion_ia INTEGER,
  comentarios_reclutador TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(id_vacante, id_usuario)
);

-- Tabla de análisis de compatibilidad
CREATE TABLE public.analisis_compatibilidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_cv UUID NOT NULL REFERENCES public.curriculos(id) ON DELETE CASCADE,
  id_vacante UUID NOT NULL REFERENCES public.vacantes(id) ON DELETE CASCADE,
  puntaje_total INTEGER NOT NULL CHECK (puntaje_total >= 0 AND puntaje_total <= 100),
  habilidades_coincidentes TEXT[],
  habilidades_faltantes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes
CREATE TABLE public.mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_remitente UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  id_destinatario UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de recomendaciones
CREATE TABLE public.recomendaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  id_vacante UUID NOT NULL REFERENCES public.vacantes(id) ON DELETE CASCADE,
  motivo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_empresas_usuario ON public.empresas(id_usuario);
CREATE INDEX idx_curriculos_usuario ON public.curriculos(id_usuario);
CREATE INDEX idx_vacantes_empresa ON public.vacantes(id_empresa);
CREATE INDEX idx_vacantes_estado ON public.vacantes(estado);
CREATE INDEX idx_postulaciones_vacante ON public.postulaciones(id_vacante);
CREATE INDEX idx_postulaciones_usuario ON public.postulaciones(id_usuario);
CREATE INDEX idx_mensajes_remitente ON public.mensajes(id_remitente);
CREATE INDEX idx_mensajes_destinatario ON public.mensajes(id_destinatario);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON public.empresas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_curriculos_updated_at BEFORE UPDATE ON public.curriculos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vacantes_updated_at BEFORE UPDATE ON public.vacantes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_postulaciones_updated_at BEFORE UPDATE ON public.postulaciones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre_completo, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', ''),
    COALESCE((NEW.raw_user_meta_data->>'rol')::user_role, 'candidato')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postulaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analisis_compatibilidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recomendaciones ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Todos pueden ver perfiles públicos"
  ON public.profiles FOR SELECT
  USING (true);

-- Políticas RLS para empresas
CREATE POLICY "Los reclutadores pueden crear empresas"
  ON public.empresas FOR INSERT
  WITH CHECK (auth.uid() = id_usuario);

CREATE POLICY "Los reclutadores pueden ver sus empresas"
  ON public.empresas FOR SELECT
  USING (auth.uid() = id_usuario);

CREATE POLICY "Los reclutadores pueden actualizar sus empresas"
  ON public.empresas FOR UPDATE
  USING (auth.uid() = id_usuario);

CREATE POLICY "Todos pueden ver empresas"
  ON public.empresas FOR SELECT
  USING (true);

-- Políticas RLS para curriculos
CREATE POLICY "Los candidatos pueden crear su currículum"
  ON public.curriculos FOR INSERT
  WITH CHECK (auth.uid() = id_usuario);

CREATE POLICY "Los usuarios pueden ver su currículum"
  ON public.curriculos FOR SELECT
  USING (auth.uid() = id_usuario);

CREATE POLICY "Los usuarios pueden actualizar su currículum"
  ON public.curriculos FOR UPDATE
  USING (auth.uid() = id_usuario);

-- Políticas RLS para vacantes
CREATE POLICY "Las empresas pueden crear vacantes"
  ON public.vacantes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.empresas WHERE id = id_empresa AND id_usuario = auth.uid()
  ));

CREATE POLICY "Todos pueden ver vacantes abiertas"
  ON public.vacantes FOR SELECT
  USING (estado = 'abierta' OR EXISTS (
    SELECT 1 FROM public.empresas WHERE id = id_empresa AND id_usuario = auth.uid()
  ));

CREATE POLICY "Las empresas pueden actualizar sus vacantes"
  ON public.vacantes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.empresas WHERE id = id_empresa AND id_usuario = auth.uid()
  ));

-- Políticas RLS para postulaciones
CREATE POLICY "Los candidatos pueden crear postulaciones"
  ON public.postulaciones FOR INSERT
  WITH CHECK (auth.uid() = id_usuario);

CREATE POLICY "Los usuarios pueden ver sus postulaciones"
  ON public.postulaciones FOR SELECT
  USING (
    auth.uid() = id_usuario OR
    EXISTS (
      SELECT 1 FROM public.vacantes v
      JOIN public.empresas e ON v.id_empresa = e.id
      WHERE v.id = id_vacante AND e.id_usuario = auth.uid()
    )
  );

CREATE POLICY "Los reclutadores pueden actualizar postulaciones de sus vacantes"
  ON public.postulaciones FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.vacantes v
    JOIN public.empresas e ON v.id_empresa = e.id
    WHERE v.id = id_vacante AND e.id_usuario = auth.uid()
  ));

-- Políticas RLS para análisis_compatibilidad
CREATE POLICY "Los usuarios pueden ver sus análisis"
  ON public.analisis_compatibilidad FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.curriculos WHERE id = id_cv AND id_usuario = auth.uid()
  ));

CREATE POLICY "Sistema puede crear análisis"
  ON public.analisis_compatibilidad FOR INSERT
  WITH CHECK (true);

-- Políticas RLS para mensajes
CREATE POLICY "Los usuarios pueden crear mensajes"
  ON public.mensajes FOR INSERT
  WITH CHECK (auth.uid() = id_remitente);

CREATE POLICY "Los usuarios pueden ver sus mensajes"
  ON public.mensajes FOR SELECT
  USING (auth.uid() = id_remitente OR auth.uid() = id_destinatario);

CREATE POLICY "Los usuarios pueden actualizar mensajes recibidos"
  ON public.mensajes FOR UPDATE
  USING (auth.uid() = id_destinatario);

-- Políticas RLS para recomendaciones
CREATE POLICY "Los usuarios pueden ver sus recomendaciones"
  ON public.recomendaciones FOR SELECT
  USING (auth.uid() = id_usuario);

CREATE POLICY "Sistema puede crear recomendaciones"
  ON public.recomendaciones FOR INSERT
  WITH CHECK (true);