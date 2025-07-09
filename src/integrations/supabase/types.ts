export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          quartier_id: string | null
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
          quartier_id?: string | null
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
          quartier_id?: string | null
          titre?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "actualites_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      associations: {
        Row: {
          contact: string
          created_at: string | null
          description: string
          id: string
          nom: string
          quartier_id: string | null
        }
        Insert: {
          contact: string
          created_at?: string | null
          description: string
          id?: string
          nom: string
          quartier_id?: string | null
        }
        Update: {
          contact?: string
          created_at?: string | null
          description?: string
          id?: string
          nom?: string
          quartier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "associations_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      commune: {
        Row: {
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          nom: string
          superficie: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom: string
          superficie?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom?: string
          superficie?: number | null
        }
        Relationships: []
      }
      commune_preferences: {
        Row: {
          commune_id: string
          created_at: string | null
          id: string
          session_id: string
        }
        Insert: {
          commune_id: string
          created_at?: string | null
          id?: string
          session_id: string
        }
        Update: {
          commune_id?: string
          created_at?: string | null
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commune_preferences_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "commune"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          participant1_id: string
          participant2_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant1_id: string
          participant2_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant1_id?: string
          participant2_id?: string
          updated_at?: string
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
          quartier_id: string | null
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
          quartier_id?: string | null
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
          quartier_id?: string | null
          titre?: string
          type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evenements_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
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
      immobilier: {
        Row: {
          adresse: string
          chambres: number | null
          contact: string
          created_at: string | null
          description: string
          id: string
          is_for_sale: boolean | null
          pieces: number | null
          prix: number
          quartier_id: string | null
          surface: number
          titre: string
          type: string
          vendeur: string
        }
        Insert: {
          adresse: string
          chambres?: number | null
          contact: string
          created_at?: string | null
          description: string
          id?: string
          is_for_sale?: boolean | null
          pieces?: number | null
          prix: number
          quartier_id?: string | null
          surface: number
          titre: string
          type: string
          vendeur: string
        }
        Update: {
          adresse?: string
          chambres?: number | null
          contact?: string
          created_at?: string | null
          description?: string
          id?: string
          is_for_sale?: boolean | null
          pieces?: number | null
          prix?: number
          quartier_id?: string | null
          surface?: number
          titre?: string
          type?: string
          vendeur?: string
        }
        Relationships: [
          {
            foreignKeyName: "immobilier_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
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
          quartier_id: string | null
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
          quartier_id?: string | null
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
          quartier_id?: string | null
          titre?: string
          vendeur?: string
        }
        Relationships: [
          {
            foreignKeyName: "marche_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
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
      necrologie: {
        Row: {
          created_at: string | null
          date_deces: string
          date_naissance: string | null
          id: string
          lieu_deces: string | null
          message: string | null
          nom: string
          photo_url: string | null
          prenom: string
          quartier_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_deces: string
          date_naissance?: string | null
          id?: string
          lieu_deces?: string | null
          message?: string | null
          nom: string
          photo_url?: string | null
          prenom: string
          quartier_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_deces?: string
          date_naissance?: string | null
          id?: string
          lieu_deces?: string | null
          message?: string | null
          nom?: string
          photo_url?: string | null
          prenom?: string
          quartier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "necrologie_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      offres_emploi: {
        Row: {
          created_at: string | null
          description: string
          employeur: string
          id: string
          localisation: string
          publie_le: string | null
          quartier_id: string | null
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
          quartier_id?: string | null
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
          quartier_id?: string | null
          titre?: string
          type_contrat?: string
        }
        Relationships: [
          {
            foreignKeyName: "offres_emploi_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      professionnels: {
        Row: {
          base: string
          contact1: string
          contact2: string | null
          created_at: string | null
          email: string | null
          id: string
          is_verified: boolean | null
          metier_id: string
          nom: string
          phone: string | null
          quartier_id: string | null
          surnom: string | null
          user_id: string | null
          verification_method: string | null
        }
        Insert: {
          base: string
          contact1: string
          contact2?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          metier_id: string
          nom: string
          phone?: string | null
          quartier_id?: string | null
          surnom?: string | null
          user_id?: string | null
          verification_method?: string | null
        }
        Update: {
          base?: string
          contact1?: string
          contact2?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          metier_id?: string
          nom?: string
          phone?: string | null
          quartier_id?: string | null
          surnom?: string | null
          user_id?: string | null
          verification_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionnels_metier_id_fkey"
            columns: ["metier_id"]
            isOneToOne: false
            referencedRelation: "metiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professionnels_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      quartiers: {
        Row: {
          code_postal: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          nom: string
          population: number | null
          village_id: string
        }
        Insert: {
          code_postal?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          nom: string
          population?: number | null
          village_id: string
        }
        Update: {
          code_postal?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          nom?: string
          population?: number | null
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quartiers_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      services_commerces: {
        Row: {
          adresse: string
          categorie: string
          contact: string
          created_at: string | null
          description: string
          horaires: string | null
          id: string
          image_url: string | null
          nom: string
          quartier_id: string | null
          updated_at: string | null
        }
        Insert: {
          adresse: string
          categorie: string
          contact: string
          created_at?: string | null
          description: string
          horaires?: string | null
          id?: string
          image_url?: string | null
          nom: string
          quartier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          adresse?: string
          categorie?: string
          contact?: string
          created_at?: string | null
          description?: string
          horaires?: string | null
          id?: string
          image_url?: string | null
          nom?: string
          quartier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_commerces_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      souvenirs: {
        Row: {
          auteur: string
          created_at: string | null
          date_souvenir: string
          description: string
          id: string
          photo_url: string | null
          quartier_id: string | null
          titre: string
        }
        Insert: {
          auteur: string
          created_at?: string | null
          date_souvenir: string
          description: string
          id?: string
          photo_url?: string | null
          quartier_id?: string | null
          titre: string
        }
        Update: {
          auteur?: string
          created_at?: string | null
          date_souvenir?: string
          description?: string
          id?: string
          photo_url?: string | null
          quartier_id?: string | null
          titre?: string
        }
        Relationships: [
          {
            foreignKeyName: "souvenirs_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          auteur: string
          contenu: string
          created_at: string | null
          id: string
          image_url: string | null
          quartier_id: string | null
          reponse: string | null
          status: string | null
          titre: string
          updated_at: string | null
        }
        Insert: {
          auteur: string
          contenu: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          quartier_id?: string | null
          reponse?: string | null
          status?: string | null
          titre: string
          updated_at?: string | null
        }
        Update: {
          auteur?: string
          contenu?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          quartier_id?: string | null
          reponse?: string | null
          status?: string | null
          titre?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      tribune: {
        Row: {
          approuve: boolean | null
          auteur: string
          contenu: string
          created_at: string | null
          id: string
          image_url: string | null
          quartier_id: string | null
          titre: string
        }
        Insert: {
          approuve?: boolean | null
          auteur: string
          contenu: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          quartier_id?: string | null
          titre: string
        }
        Update: {
          approuve?: boolean | null
          auteur?: string
          contenu?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          quartier_id?: string | null
          titre?: string
        }
        Relationships: [
          {
            foreignKeyName: "tribune_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role_type"]
          sub_role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_type"]
          sub_role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_type"]
          sub_role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users_profiles: {
        Row: {
          commune_id: string | null
          created_at: string | null
          id: string
          nom: string | null
          prenom: string | null
          user_id: string
        }
        Insert: {
          commune_id?: string | null
          created_at?: string | null
          id?: string
          nom?: string | null
          prenom?: string | null
          user_id: string
        }
        Update: {
          commune_id?: string | null
          created_at?: string | null
          id?: string
          nom?: string | null
          prenom?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_profiles_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      villages: {
        Row: {
          code_postal: string | null
          commune_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          nom: string
          population: number | null
        }
        Insert: {
          code_postal?: string | null
          commune_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          nom: string
          population?: number | null
        }
        Update: {
          code_postal?: string | null
          commune_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          nom?: string
          population?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "villages_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "commune"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role_type"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role_type"]
        }
        Returns: boolean
      }
      link_professional_to_user: {
        Args: {
          professional_id: string
          user_email: string
          user_phone?: string
        }
        Returns: Json
      }
      request_professional_verification: {
        Args: { professional_id: string; method: string }
        Returns: Json
      }
      verify_professional: {
        Args: { professional_id: string; verification_code: string }
        Returns: Json
      }
    }
    Enums: {
      user_role_type:
        | "autorite_administrative"
        | "autorite_villageoise"
        | "administre"
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
      user_role_type: [
        "autorite_administrative",
        "autorite_villageoise",
        "administre",
      ],
    },
  },
} as const
