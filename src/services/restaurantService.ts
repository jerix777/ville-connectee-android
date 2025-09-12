import { supabase } from "@/integrations/supabase/client";

export interface RestaurantBuvette {
  id: string;
  nom: string;
  type: 'restaurant' | 'buvette' | 'maquis' | 'cafe' | 'bar';
  description?: string;
  adresse: string;
  telephone?: string;
  email?: string;
  horaires?: string;
  prix_moyen?: number;
  specialites?: string[];
  services?: string[];
  image_url?: string;
  quartier_id?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface RestaurantBuvetteInput {
  nom: string;
  type: string;
  description?: string;
  adresse: string;
  telephone?: string;
  email?: string;
  horaires?: string;
  prix_moyen?: string;
  specialites?: string;
  services?: string;
  image_url?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export const restaurantService = {
  async getAllRestaurants(): Promise<RestaurantBuvette[]> {
    const { data, error } = await supabase
      .from('restaurants_buvettes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }

    return (data || []) as RestaurantBuvette[];
  },

  async getRestaurantsByType(type: string): Promise<RestaurantBuvette[]> {
    const { data, error } = await supabase
      .from('restaurants_buvettes')
      .select('*')
      .eq('type', type)
      .order('nom', { ascending: true });

    if (error) {
      console.error('Error fetching restaurants by type:', error);
      throw error;
    }

    return (data || []) as RestaurantBuvette[];
  },

  async getNearbyRestaurants(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<RestaurantBuvette[]> {
    // Pour l'instant, on récupère tous les restaurants et on filtre côté client
    // On peut implémenter la logique de distance plus tard
    const { data, error } = await supabase
      .from('restaurants_buvettes')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('nom', { ascending: true });

    if (error) {
      console.error('Error fetching nearby restaurants:', error);
      throw error;
    }

    const allRestaurants = (data || []) as RestaurantBuvette[];
    
    // Filtrer par distance si on a les coordonnées
    return allRestaurants.filter(restaurant => {
      if (!restaurant.latitude || !restaurant.longitude) return false;
      
      // Calcul simple de distance (approximatif)
      const deltaLat = Math.abs(latitude - restaurant.latitude);
      const deltaLon = Math.abs(longitude - restaurant.longitude);
      const distance = Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon) * 111; // Conversion approximative en km
      
      return distance <= radiusKm;
    });
  },

  async addRestaurant(restaurant: RestaurantBuvetteInput): Promise<RestaurantBuvette> {
    // Convertir les chaînes en tableaux et les prix en nombres
    const restaurantData = {
      ...restaurant,
      specialites: restaurant.specialites ? restaurant.specialites.split(',').map(s => s.trim()) : [],
      services: restaurant.services ? restaurant.services.split(',').map(s => s.trim()) : [],
      prix_moyen: restaurant.prix_moyen ? parseFloat(restaurant.prix_moyen) : null
    };

    const { data, error } = await supabase
      .from('restaurants_buvettes')
      .insert([restaurantData])
      .select()
      .single();

    if (error) {
      console.error('Error adding restaurant:', error);
      throw error;
    }

    return data as RestaurantBuvette;
  },

  async uploadRestaurantImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `restaurants/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('restaurants')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('restaurants')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};