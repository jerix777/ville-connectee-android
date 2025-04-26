export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      actualites: {
        Row: {
          auteur: string | null
          contenu: string
          created_at: string | null
          id: string
          image_url: string | null
          publie_le: string | null
          titre: string
          type: string
        }
        Insert: {
          auteur?: string | null
          contenu: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          publie_le?: string | null
          titre: string
          type: string
        }
        Update: {
          auteur?: string | null
          contenu?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          publie_le?: string | null
          titre?: string
          type?: string
        }
        Relationships: []
      }
      associations: {
        Row: {
          contact: string
          created_at: string | null
          description: string
          id: string
          nom: string
        }
        Insert: {
          contact: string
          created_at?: string | null
          description: string
          id?: string
          nom: string
        }
        Update: {
          contact?: string
          created_at?: string | null
          description?: string
          id?: string
          nom?: string
        }
        Relationships: []
      }
      evenements: {
        Row: {
          contact1: string
          contact2: string | null
          created_at: string | null
          date_debut: string
          date_fin: string
          heure_debut: string
          heure_fin: string
          id: string
          lieu: string
          organisateur: string
          titre: string
          type_id: string
        }
        Insert: {
          contact1: string
          contact2?: string | null
          created_at?: string | null
          date_debut: string
          date_fin: string
          heure_debut: string
          heure_fin: string
          id?: string
          lieu: string
          organisateur: string
          titre: string
          type_id: string
        }
        Update: {
          contact1?: string
          contact2?: string | null
          created_at?: string | null
          date_debut?: string
          date_fin?: string
          heure_debut?: string
          heure_fin?: string
          id?: string
          lieu?: string
          organisateur?: string
          titre?: string
          type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evenements_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
        ]
      }
      event_types: {
        Row: {
          id: string
          label: string
        }
        Insert: {
          id?: string
          label: string
        }
        Update: {
          id?: string
          label?: string
        }
        Relationships: []
      }
      marche: {
        Row: {
          contact1: string
          contact2: string | null
          created_at: string | null
          description: string
          id: string
          is_for_sale: boolean
          prix: number
          titre: string
          vendeur: string
        }
        Insert: {
          contact1: string
          contact2?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_for_sale?: boolean
          prix: number
          titre: string
          vendeur: string
        }
        Update: {
          contact1?: string
          contact2?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_for_sale?: boolean
          prix?: number
          titre?: string
          vendeur?: string
        }
        Relationships: []
      }
      metiers: {
        Row: {
          id: string
          nom: string
        }
        Insert: {
          id?: string
          nom: string
        }
        Update: {
          id?: string
          nom?: string
        }
        Relationships: []
      }
      offres_emploi: {
        Row: {
          created_at: string | null
          description: string
          employeur: string
          id: string
          localisation: string
          publie_le: string | null
          titre: string
          type_contrat: string
        }
        Insert: {
          created_at?: string | null
          description: string
          employeur: string
          id?: string
          localisation: string
          publie_le?: string | null
          titre: string
          type_contrat: string
        }
        Update: {
          created_at?: string | null
          description?: string
          employeur?: string
          id?: string
          localisation?: string
          publie_le?: string | null
          titre?: string
          type_contrat?: string
        }
        Relationships: []
      }
      professionnels: {
        Row: {
          base: string
          contact1: string
          contact2: string | null
          created_at: string | null
          id: string
          metier_id: string
          nom: string
          surnom: string | null
        }
        Insert: {
          base: string
          contact1: string
          contact2?: string | null
          created_at?: string | null
          id?: string
          metier_id: string
          nom: string
          surnom?: string | null
        }
        Update: {
          base?: string
          contact1?: string
          contact2?: string | null
          created_at?: string | null
          id?: string
          metier_id?: string
          nom?: string
          surnom?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionnels_metier_id_fkey"
            columns: ["metier_id"]
            isOneToOne: false
            referencedRelation: "metiers"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
