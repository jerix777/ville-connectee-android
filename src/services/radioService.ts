import { supabase } from "@/integrations/supabase/client";

export interface Radio {
  id: string;
  nom: string;
  description?: string;
  logo_url?: string;
  flux_url: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const radioService = {
  async getAll(): Promise<Radio[]> {
    const { data, error } = await supabase
      .from('radios')
      .select('*')
      .eq('is_active', true)
      .order('nom');

    if (error) {
      console.error('Error fetching radios:', error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<Radio> {
    const { data, error } = await supabase
      .from('radios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching radio:', error);
      throw error;
    }

    return data;
  },

  async create(radio: Omit<Radio, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<Radio> {
    const { data, error } = await supabase
      .from('radios')
      .insert({
        ...radio,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating radio:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, updates: Partial<Omit<Radio, 'id' | 'created_at' | 'updated_at' | 'created_by'>>): Promise<Radio> {
    const { data, error } = await supabase
      .from('radios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating radio:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('radios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting radio:', error);
      throw error;
    }
  }
};