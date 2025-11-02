export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analisis_compatibilidad: {
        Row: {
          created_at: string | null
          habilidades_coincidentes: string[] | null
          habilidades_faltantes: string[] | null
          id: string
          id_cv: string
          id_vacante: string
          puntaje_total: number
        }
        Insert: {
          created_at?: string | null
          habilidades_coincidentes?: string[] | null
          habilidades_faltantes?: string[] | null
          id?: string
          id_cv: string
          id_vacante: string
          puntaje_total: number
        }
        Update: {
          created_at?: string | null
          habilidades_coincidentes?: string[] | null
          habilidades_faltantes?: string[] | null
          id?: string
          id_cv?: string
          id_vacante?: string
          puntaje_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "analisis_compatibilidad_id_cv_fkey"
            columns: ["id_cv"]
            isOneToOne: false
            referencedRelation: "curriculos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analisis_compatibilidad_id_vacante_fkey"
            columns: ["id_vacante"]
            isOneToOne: false
            referencedRelation: "vacantes"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculos: {
        Row: {
          certificaciones: string[] | null
          created_at: string | null
          cv_pdf: string | null
          educacion: string | null
          experiencia: string | null
          habilidades: string[] | null
          id: string
          id_usuario: string
          idiomas: string[] | null
          porcentaje_compatibilidad: number | null
          recomendaciones: string | null
          resumen_perfil: string | null
          updated_at: string | null
        }
        Insert: {
          certificaciones?: string[] | null
          created_at?: string | null
          cv_pdf?: string | null
          educacion?: string | null
          experiencia?: string | null
          habilidades?: string[] | null
          id?: string
          id_usuario: string
          idiomas?: string[] | null
          porcentaje_compatibilidad?: number | null
          recomendaciones?: string | null
          resumen_perfil?: string | null
          updated_at?: string | null
        }
        Update: {
          certificaciones?: string[] | null
          created_at?: string | null
          cv_pdf?: string | null
          educacion?: string | null
          experiencia?: string | null
          habilidades?: string[] | null
          id?: string
          id_usuario?: string
          idiomas?: string[] | null
          porcentaje_compatibilidad?: number | null
          recomendaciones?: string | null
          resumen_perfil?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculos_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          created_at: string | null
          descripcion: string | null
          direccion: string | null
          id: string
          id_usuario: string
          logo_empresa: string | null
          nombre_empresa: string
          sector: string | null
          sitio_web: string | null
          tamano_empresa: Database["public"]["Enums"]["company_size"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          id?: string
          id_usuario: string
          logo_empresa?: string | null
          nombre_empresa: string
          sector?: string | null
          sitio_web?: string | null
          tamano_empresa?: Database["public"]["Enums"]["company_size"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          id?: string
          id_usuario?: string
          logo_empresa?: string | null
          nombre_empresa?: string
          sector?: string | null
          sitio_web?: string | null
          tamano_empresa?: Database["public"]["Enums"]["company_size"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mensajes: {
        Row: {
          contenido: string
          created_at: string | null
          id: string
          id_destinatario: string
          id_remitente: string
          leido: boolean | null
        }
        Insert: {
          contenido: string
          created_at?: string | null
          id?: string
          id_destinatario: string
          id_remitente: string
          leido?: boolean | null
        }
        Update: {
          contenido?: string
          created_at?: string | null
          id?: string
          id_destinatario?: string
          id_remitente?: string
          leido?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "mensajes_id_destinatario_fkey"
            columns: ["id_destinatario"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensajes_id_remitente_fkey"
            columns: ["id_remitente"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      postulaciones: {
        Row: {
          comentarios_reclutador: string | null
          created_at: string | null
          estado: Database["public"]["Enums"]["application_status"] | null
          id: string
          id_usuario: string
          id_vacante: string
          puntuacion_ia: number | null
          updated_at: string | null
        }
        Insert: {
          comentarios_reclutador?: string | null
          created_at?: string | null
          estado?: Database["public"]["Enums"]["application_status"] | null
          id?: string
          id_usuario: string
          id_vacante: string
          puntuacion_ia?: number | null
          updated_at?: string | null
        }
        Update: {
          comentarios_reclutador?: string | null
          created_at?: string | null
          estado?: Database["public"]["Enums"]["application_status"] | null
          id?: string
          id_usuario?: string
          id_vacante?: string
          puntuacion_ia?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "postulaciones_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postulaciones_id_vacante_fkey"
            columns: ["id_vacante"]
            isOneToOne: false
            referencedRelation: "vacantes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          estado: Database["public"]["Enums"]["user_status"] | null
          foto_perfil: string | null
          id: string
          nombre_completo: string
          rol: Database["public"]["Enums"]["user_role"]
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: Database["public"]["Enums"]["user_status"] | null
          foto_perfil?: string | null
          id: string
          nombre_completo: string
          rol: Database["public"]["Enums"]["user_role"]
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: Database["public"]["Enums"]["user_status"] | null
          foto_perfil?: string | null
          id?: string
          nombre_completo?: string
          rol?: Database["public"]["Enums"]["user_role"]
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recomendaciones: {
        Row: {
          created_at: string | null
          id: string
          id_usuario: string
          id_vacante: string
          motivo: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          id_usuario: string
          id_vacante: string
          motivo?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          id_usuario?: string
          id_vacante?: string
          motivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recomendaciones_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recomendaciones_id_vacante_fkey"
            columns: ["id_vacante"]
            isOneToOne: false
            referencedRelation: "vacantes"
            referencedColumns: ["id"]
          },
        ]
      }
      vacantes: {
        Row: {
          created_at: string | null
          descripcion: string
          estado: Database["public"]["Enums"]["vacancy_status"] | null
          habilidades_necesarias: string[] | null
          id: string
          id_empresa: string
          requisitos: string | null
          salario: string | null
          tipo_contrato: Database["public"]["Enums"]["contract_type"] | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion: string
          estado?: Database["public"]["Enums"]["vacancy_status"] | null
          habilidades_necesarias?: string[] | null
          id?: string
          id_empresa: string
          requisitos?: string | null
          salario?: string | null
          tipo_contrato?: Database["public"]["Enums"]["contract_type"] | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string
          estado?: Database["public"]["Enums"]["vacancy_status"] | null
          habilidades_necesarias?: string[] | null
          id?: string
          id_empresa?: string
          requisitos?: string | null
          salario?: string | null
          tipo_contrato?: Database["public"]["Enums"]["contract_type"] | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vacantes_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status: "en_revision" | "aceptado" | "rechazado"
      company_size: "pequena" | "mediana" | "grande"
      contract_type: "tiempo_completo" | "medio_tiempo" | "remoto" | "hibrido"
      user_role: "candidato" | "reclutador"
      user_status: "activo" | "inactivo"
      vacancy_status: "abierta" | "cerrada"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["en_revision", "aceptado", "rechazado"],
      company_size: ["pequena", "mediana", "grande"],
      contract_type: ["tiempo_completo", "medio_tiempo", "remoto", "hibrido"],
      user_role: ["candidato", "reclutador"],
      user_status: ["activo", "inactivo"],
      vacancy_status: ["abierta", "cerrada"],
    },
  },
} as const
