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
    PostgrestVersion: "13.0.4"
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
      association_annonces: {
        Row: {
          association_id: string
          auteur_id: string
          contenu: string
          created_at: string | null
          id: string
          priorite: string | null
          titre: string
          updated_at: string | null
          visible_jusqu: string | null
        }
        Insert: {
          association_id: string
          auteur_id: string
          contenu: string
          created_at?: string | null
          id?: string
          priorite?: string | null
          titre: string
          updated_at?: string | null
          visible_jusqu?: string | null
        }
        Update: {
          association_id?: string
          auteur_id?: string
          contenu?: string
          created_at?: string | null
          id?: string
          priorite?: string | null
          titre?: string
          updated_at?: string | null
          visible_jusqu?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "association_annonces_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      association_depenses: {
        Row: {
          approuve: boolean | null
          association_id: string
          categorie: string
          created_at: string | null
          date_depense: string | null
          description: string
          id: string
          justificatif_url: string | null
          montant: number
          responsable_id: string
          updated_at: string | null
        }
        Insert: {
          approuve?: boolean | null
          association_id: string
          categorie: string
          created_at?: string | null
          date_depense?: string | null
          description: string
          id?: string
          justificatif_url?: string | null
          montant: number
          responsable_id: string
          updated_at?: string | null
        }
        Update: {
          approuve?: boolean | null
          association_id?: string
          categorie?: string
          created_at?: string | null
          date_depense?: string | null
          description?: string
          id?: string
          justificatif_url?: string | null
          montant?: number
          responsable_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "association_depenses_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      association_membres: {
        Row: {
          association_id: string
          cotisation_a_jour: boolean | null
          created_at: string | null
          date_adhesion: string | null
          date_arrivee: string | null
          dernier_paiement: string | null
          email: string
          id: string
          montant_cotisation: number | null
          nom: string
          prenom: string
          role: string
          telephone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          association_id: string
          cotisation_a_jour?: boolean | null
          created_at?: string | null
          date_adhesion?: string | null
          date_arrivee?: string | null
          dernier_paiement?: string | null
          email: string
          id?: string
          montant_cotisation?: number | null
          nom: string
          prenom: string
          role?: string
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          association_id?: string
          cotisation_a_jour?: boolean | null
          created_at?: string | null
          date_adhesion?: string | null
          date_arrivee?: string | null
          dernier_paiement?: string | null
          email?: string
          id?: string
          montant_cotisation?: number | null
          nom?: string
          prenom?: string
          role?: string
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "association_membres_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      associations: {
        Row: {
          contact: string
          created_at: string | null
          date_creation: string | null
          description: string
          id: string
          logo_url: string | null
          nom: string
          nombre_membres: number | null
          quartier_id: string | null
          responsable_id: string | null
          statut: string | null
        }
        Insert: {
          contact: string
          created_at?: string | null
          date_creation?: string | null
          description: string
          id?: string
          logo_url?: string | null
          nom: string
          nombre_membres?: number | null
          quartier_id?: string | null
          responsable_id?: string | null
          statut?: string | null
        }
        Update: {
          contact?: string
          created_at?: string | null
          date_creation?: string | null
          description?: string
          id?: string
          logo_url?: string | null
          nom?: string
          nombre_membres?: number | null
          quartier_id?: string | null
          responsable_id?: string | null
          statut?: string | null
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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      autorite_zones: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          user_id: string
          zone_id: string | null
          zone_nom: string
          zone_type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          user_id: string
          zone_id?: string | null
          zone_nom: string
          zone_type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          user_id?: string
          zone_id?: string | null
          zone_nom?: string
          zone_type?: string
        }
        Relationships: []
      }
      catalogue: {
        Row: {
          categorie: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string
          quartier_id: string | null
          tags: string[] | null
          titre: string
        }
        Insert: {
          categorie: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url: string
          quartier_id?: string | null
          tags?: string[] | null
          titre: string
        }
        Update: {
          categorie?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string
          quartier_id?: string | null
          tags?: string[] | null
          titre?: string
        }
        Relationships: []
      }
      catalogue_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          nom: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          nom: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          nom?: string
        }
        Relationships: []
      }
      catalogue_items: {
        Row: {
          category_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
        }
        Insert: {
          category_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
        }
        Update: {
          category_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogue_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "catalogue_categories"
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
      data_access_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          sensitive_data_accessed: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          sensitive_data_accessed?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          sensitive_data_accessed?: boolean | null
          user_agent?: string | null
          user_id?: string | null
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
      jukebox_sessions: {
        Row: {
          created_at: string
          current_musique_id: string | null
          current_position: number | null
          description: string | null
          host_user_id: string
          id: string
          is_active: boolean | null
          is_playing: boolean | null
          nom: string
          quartier_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_musique_id?: string | null
          current_position?: number | null
          description?: string | null
          host_user_id: string
          id?: string
          is_active?: boolean | null
          is_playing?: boolean | null
          nom: string
          quartier_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_musique_id?: string | null
          current_position?: number | null
          description?: string | null
          host_user_id?: string
          id?: string
          is_active?: boolean | null
          is_playing?: boolean | null
          nom?: string
          quartier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jukebox_sessions_current_musique_id_fkey"
            columns: ["current_musique_id"]
            isOneToOne: false
            referencedRelation: "musiques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jukebox_sessions_quartier_id_fkey"
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
      musiques: {
        Row: {
          album: string | null
          annee: number | null
          artiste: string
          cover_url: string | null
          created_at: string
          duree: number | null
          file_url: string
          genre: string | null
          id: string
          quartier_id: string | null
          titre: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          album?: string | null
          annee?: number | null
          artiste: string
          cover_url?: string | null
          created_at?: string
          duree?: number | null
          file_url: string
          genre?: string | null
          id?: string
          quartier_id?: string | null
          titre: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          album?: string | null
          annee?: number | null
          artiste?: string
          cover_url?: string | null
          created_at?: string
          duree?: number | null
          file_url?: string
          genre?: string | null
          id?: string
          quartier_id?: string | null
          titre?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "musiques_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
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
      playlist_musiques: {
        Row: {
          added_at: string
          id: string
          musique_id: string
          playlist_id: string
          position: number
        }
        Insert: {
          added_at?: string
          id?: string
          musique_id: string
          playlist_id: string
          position?: number
        }
        Update: {
          added_at?: string
          id?: string
          musique_id?: string
          playlist_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "playlist_musiques_musique_id_fkey"
            columns: ["musique_id"]
            isOneToOne: false
            referencedRelation: "musiques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_musiques_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_public: boolean
          nom: string
          quartier_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean
          nom: string
          quartier_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean
          nom?: string
          quartier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlists_quartier_id_fkey"
            columns: ["quartier_id"]
            isOneToOne: false
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
        ]
      }
      professionnel_competences: {
        Row: {
          certifications: string[] | null
          created_at: string | null
          description: string | null
          domaine_competence: string
          experience_annees: number | null
          id: string
          niveau_competence: string | null
          user_id: string
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          domaine_competence: string
          experience_annees?: number | null
          id?: string
          niveau_competence?: string | null
          user_id: string
        }
        Update: {
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          domaine_competence?: string
          experience_annees?: number | null
          id?: string
          niveau_competence?: string | null
          user_id?: string
        }
        Relationships: []
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
      radios: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          flux_url: string
          id: string
          is_active: boolean
          logo_url: string | null
          nom: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          flux_url: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          nom: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          flux_url?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          nom?: string
          updated_at?: string
        }
        Relationships: []
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
      session_participants: {
        Row: {
          id: string
          joined_at: string
          session_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          session_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "jukebox_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_queue: {
        Row: {
          added_at: string
          added_by: string
          id: string
          musique_id: string
          played: boolean | null
          position: number
          session_id: string
        }
        Insert: {
          added_at?: string
          added_by: string
          id?: string
          musique_id: string
          played?: boolean | null
          position: number
          session_id: string
        }
        Update: {
          added_at?: string
          added_by?: string
          id?: string
          musique_id?: string
          played?: boolean | null
          position?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_queue_musique_id_fkey"
            columns: ["musique_id"]
            isOneToOne: false
            referencedRelation: "musiques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_queue_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "jukebox_sessions"
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
      taxi_bookings: {
        Row: {
          created_at: string
          destination: string
          driver_id: string | null
          id: string
          pickup_location: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destination: string
          driver_id?: string | null
          id?: string
          pickup_location: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destination?: string
          driver_id?: string | null
          id?: string
          pickup_location?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "taxi_bookings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "taxi_drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      taxi_drivers: {
        Row: {
          created_at: string
          id: string
          is_available: boolean
          license_plate: string | null
          user_id: string
          vehicle_model: string | null
          vehicle_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean
          license_plate?: string | null
          user_id: string
          vehicle_model?: string | null
          vehicle_type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean
          license_plate?: string | null
          user_id?: string
          vehicle_model?: string | null
          vehicle_type?: string
        }
        Relationships: []
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
          contact_telephone: string | null
          created_at: string | null
          date_naissance: string | null
          id: string
          lieu_naissance: string | null
          lieu_residence: string | null
          nom: string | null
          prenom: string | null
          user_id: string
          village_origine_id: string | null
        }
        Insert: {
          commune_id?: string | null
          contact_telephone?: string | null
          created_at?: string | null
          date_naissance?: string | null
          id?: string
          lieu_naissance?: string | null
          lieu_residence?: string | null
          nom?: string | null
          prenom?: string | null
          user_id: string
          village_origine_id?: string | null
        }
        Update: {
          commune_id?: string | null
          contact_telephone?: string | null
          created_at?: string | null
          date_naissance?: string | null
          id?: string
          lieu_naissance?: string | null
          lieu_residence?: string | null
          nom?: string | null
          prenom?: string | null
          user_id?: string
          village_origine_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_village_origine"
            columns: ["village_origine_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
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
          _role: Database["public"]["Enums"]["user_role_type"]
          _user_id: string
        }
        Returns: boolean
      }
      is_association_member: {
        Args: { p_association_id: string; p_user_id: string }
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
      log_audit_event: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type: string
        }
        Returns: undefined
      }
      log_sensitive_data_access: {
        Args: {
          p_action?: string
          p_resource_id?: string
          p_resource_type: string
        }
        Returns: undefined
      }
      request_professional_verification: {
        Args: { method: string; professional_id: string }
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
