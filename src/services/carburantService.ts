import { supabase } from '@/integrations/supabase/client';

export interface StationCarburant {
  id: string;
  nom: string;
  type: string;
  adresse: string;
  telephone?: string | null;
  email?: string | null;
  horaires?: string | null;
  services: string[] | null;
  prix_essence?: number | null;
  prix_gasoil?: number | null;
  prix_gaz?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  quartier_id?: string | null;
  image_url?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StationCarburantInput {
  nom: string;
  type: string;
  adresse: string;
  telephone?: string;
  email?: string;
  horaires?: string;
  services?: string;
  prix_essence?: string;
  prix_gasoil?: string;
  prix_gaz?: string;
  latitude?: number | null;
  longitude?: number | null;
  image_url?: string;
  description?: string;
}

export const carburantService = {
  async getAllStations(): Promise<StationCarburant[]> {
    const { data, error } = await supabase
      .from('stations_carburant')
      .select('*')
      .order('nom');

    if (error) {
      throw error;
    }

    return data || [];
  },

  async getNearbyStations(
    userLat: number, 
    userLon: number, 
    radiusKm: number = 10,
    type?: string
  ): Promise<StationCarburant[]> {
    let query = supabase
      .from('stations_carburant')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (type && type !== 'tous') {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

            if (!data) return [];

            // Filtrer les services null et les convertir en array vide si nécessaire
            const cleanedData = data.map(station => ({
              ...station,
              services: station.services || []
            }));

            // Calculer la distance et filtrer par rayon
            const stationsWithDistance = cleanedData
      .map(station => ({
        ...station,
        distance: calculateDistance(
          userLat, 
          userLon, 
          station.latitude!, 
          station.longitude!
        )
      }))
      .filter(station => station.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return stationsWithDistance;
  },

  async createStation(station: Omit<StationCarburant, 'id' | 'created_at' | 'updated_at'>): Promise<StationCarburant> {
    const { data, error } = await supabase
      .from('stations_carburant')
      .insert([station])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateStation(id: string, updates: Partial<StationCarburant>): Promise<StationCarburant> {
    const { data, error } = await supabase
      .from('stations_carburant')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteStation(id: string): Promise<void> {
    const { error } = await supabase
      .from('stations_carburant')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  async addStation(station: StationCarburantInput): Promise<StationCarburant> {
    // Convertir les chaînes de services en tableau
    const stationData = {
      ...station,
      services: station.services ? station.services.split(',').map(s => s.trim()) : [],
      prix_essence: station.prix_essence ? parseFloat(station.prix_essence) : null,
      prix_gasoil: station.prix_gasoil ? parseFloat(station.prix_gasoil) : null,
      prix_gaz: station.prix_gaz ? parseFloat(station.prix_gaz) : null
    };

    const { data, error } = await supabase
      .from('stations_carburant')
      .insert([stationData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async uploadStationImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `stations/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('stations')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('stations')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};

// Fonction utilitaire pour calculer la distance entre deux points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}