import { supabase } from "@/integrations/supabase/client";

export interface EtablissementSante {
  id: string;
  nom: string;
  type: string;
  adresse: string;
  latitude: number;
  longitude: number;
  telephone?: string | null;
  email?: string | null;
  horaires?: string | null;
  services?: string[] | null;
  urgences: boolean | null;
  garde_permanente: boolean | null;
  quartier_id?: string | null;
  image_url?: string | null;
  description?: string | null;
  distance?: number;
  created_at: string;
  updated_at: string;
}

export const santeService = {
  async getAllEtablissements(): Promise<EtablissementSante[]> {
    const { data, error } = await (supabase as any)
      .from('etablissements_sante')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching etablissements:', error);
      throw error;
    }

    return (data as EtablissementSante[]) || [];
  },

  async getEtablissementsProches(
    userLat: number, 
    userLon: number, 
    radiusKm: number = 10,
    type?: string
  ): Promise<EtablissementSante[]> {
    let query = (supabase as any)
      .from('etablissements_sante')
      .select('*');

    if (type && type !== 'tous') {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching nearby etablissements:', error);
      throw error;
    }

    if (!data) return [];

    // Calculer la distance pour chaque établissement et filtrer par rayon
    const etablissementsAvecDistance = (data as any[])
      .map((etablissement: any) => {
        const distance = calculateDistance(
          userLat, 
          userLon, 
          Number(etablissement.latitude), 
          Number(etablissement.longitude)
        );
        
        return {
          ...etablissement,
          distance: Number(distance.toFixed(2))
        };
      })
      .filter(etablissement => etablissement.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return etablissementsAvecDistance as EtablissementSante[];
  },

  async createEtablissement(etablissement: Omit<EtablissementSante, 'id' | 'created_at' | 'updated_at'>): Promise<EtablissementSante> {
    const { data, error } = await (supabase as any)
      .from('etablissements_sante')
      .insert([etablissement as any])
      .select()
      .single();

    if (error) {
      console.error('Error creating etablissement:', error);
      throw error;
    }

    return data as EtablissementSante;
  },

  async updateEtablissement(id: string, updates: Partial<EtablissementSante>): Promise<EtablissementSante> {
    const { data, error } = await (supabase as any)
      .from('etablissements_sante')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating etablissement:', error);
      throw error;
    }

    return data as EtablissementSante;
  },

  async deleteEtablissement(id: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('etablissements_sante')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting etablissement:', error);
      throw error;
    }
  }
};

// Fonction utilitaire pour calculer la distance entre deux points (formule haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
