export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      directory_entries: {
        Row: {
          id: string
          created_at: string
          name: string
          service_type: string
          address: string | null
          phone1: string
          phone2: string | null
          email: string | null
          quartier_id: string
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          service_type: string
          address?: string | null
          phone1: string
          phone2?: string | null
          email?: string | null
          quartier_id: string
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          service_type?: string
          address?: string | null
          phone1?: string
          phone2?: string | null
          email?: string | null
          quartier_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directory_entries_quartier_id_fkey"
            columns: ["quartier_id"]
            referencedRelation: "quartiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directory_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quartiers: {
        Row: {
          id: string
          nom: string
          village_id: string
        }
        Insert: {
          id?: string
          nom: string
          village_id: string
        }
        Update: {
          id?: string
          nom?: string
          village_id?: string
        }
        Relationships: [
            {
                foreignKeyName: "quartiers_village_id_fkey"
                columns: ["village_id"]
                referencedRelation: "villages"
                referencedColumns: ["id"]
            }
        ]
      }
      villages: {
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
