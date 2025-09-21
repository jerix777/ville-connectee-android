import { supabase } from '@/integrations/supabase/client';

export interface StationHotel {
  id: string;
  nom: string;
  type: string;
  adresse: string;
  telephone?: string | null;
  email?: string | null;
  horaires?: string | null;
  services: string[] | null;
  latitude?: number | null;
  longitude?: number | null;
  quartier_id?: string | null;
  image_url?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StationHotelInput {
  nom: string;
  type: string;
  adresse: string;
  telephone?: string;
  email?: string;
  horaires?: string;
  services?: string;
  latitude?: number | null;
  longitude?: number | null;
  image_url?: string;
  description?: string;
}

export const hotelService = {
  async getAllStations(): Promise<StationHotel[]> {
    const { data, error } = await supabase
      .from('hotels')
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
  ): Promise<StationHotel[]> {
    let query = supabase
      .from('hotels')
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

    const cleanedData = data.map((station: any) => ({
      ...station,
      services: station.services || []
    }));

    const stationsWithDistance = cleanedData
      .map((station: any) => ({
        ...station,
        distance: calculateDistance(
          userLat,
          userLon,
          station.latitude,
          station.longitude
        )
      }))
      .filter((station: any) => station.distance <= radiusKm)
      .sort((a: any, b: any) => a.distance - b.distance);

    return stationsWithDistance;
  },

  async addStation(station: StationHotelInput): Promise<StationHotel> {
    const stationData = {
      ...station,
      services: station.services ? station.services.split(',').map((s) => s.trim()) : [],
    };

    const { data, error } = await supabase
      .from('hotels')
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
    const filePath = `hotels/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('hotels')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('hotels')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
