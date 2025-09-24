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
  category_id?: string;
}

export interface RadioCategory {
  id: string;
  name: string;
}

export const radioService = {
  async getAll(categoryId?: string): Promise<Radio[]> {
    let query = supabase
      .from('radios')
      .select('*')
      .eq('is_active', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('nom');

    if (error) {
      console.error('Error fetching radios:', error);
      throw error;
    }

    return data || [];
  },

  async getCategories(): Promise<RadioCategory[]> {
    const { data, error } = await supabase
      .from('radio_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching radio categories:', error);
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
