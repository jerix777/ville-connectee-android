import { supabase } from '@/integrations/supabase/client';
import { type HotelFormInput } from '@/pages/Hotelerie/components/AddHotelForm';

// Corresponds to the `hotels` table in the database
export interface Hotel {
  id: string;
  nom: string;
  type: string;
  adresse: string;
  contact1: string;
  contact2?: string | null;
  email?: string | null;
  description?: string | null;
  created_at: string;
}

export const hotelService = {
  async getAllHotels(): Promise<Hotel[]> {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }

    return data || [];
  },

  async addHotel(hotelData: HotelFormInput): Promise<Hotel> {
    const { data, error } = await supabase
      .from('hotels')
      .insert([hotelData])
      .select()
      .single();

    if (error) {
      console.error('Error adding hotel:', error);
      throw error;
    }

    return data;
  },
};
