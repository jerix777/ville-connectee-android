import { supabase } from "@/integrations/supabase/client";

export type EtablissementSante = {
  id: string;
  nom: string;
  type: 'hopital' | 'pharmacie' | 'clinique' | 'centre_sante';
  adresse: string;
  latitude: number;
  longitude: number;
  telephone?: string | null;
  email?: string | null;
  horaires?: string | null;
  services?: string[] | null;
  urgences?: boolean;
  garde_permanente?: boolean;
  description?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateEtablissementSanteDTO = Omit<
  EtablissementSante,
  'id' | 'created_at' | 'updated_at'
>;

const TABLE = 'etablissements_sante';

export const santeService = {
  async getEtablissements() {
    const { data, error } = await supabase
      .from(TABLE)
      .select()
      .order('nom');

    if (error) throw error;
    return data as EtablissementSante[];
  },

  async searchEtablissements(query: string) {
    const { data, error } = await supabase
      .from(TABLE)
      .select()
      .or(`nom.ilike.%${query}%,adresse.ilike.%${query}%,description.ilike.%${query}%`)
      .order('nom');

    if (error) throw error;
    return data as EtablissementSante[];
  },

  async getEtablissementById(id: string) {
    const { data, error } = await supabase
      .from(TABLE)
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as EtablissementSante;
  },

  async addEtablissement(etablissement: CreateEtablissementSanteDTO) {
    const timestamp = new Date().toISOString();
    const { data, error } = await supabase
      .from(TABLE)
      .insert([{
        ...etablissement,
        created_at: timestamp,
        updated_at: timestamp
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Échec de la création de l'établissement");
    return data as EtablissementSante;
  }
};
