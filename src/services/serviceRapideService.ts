import { supabase } from "@/integrations/supabase/client";

export interface ServiceRapide {
  id: string;
  type_service: 'public' | 'prive';
  nom_etablissement: string;
  contact1: string;
  contact2?: string;
  logo_url?: string;
  quartier_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ServiceRapideInsert {
  type_service: 'public' | 'prive';
  nom_etablissement: string;
  contact1: string;
  contact2?: string;
  logo_url?: string;
  quartier_id?: string;
  created_by?: string;
}

export const serviceRapideService = {
  async getAll(): Promise<ServiceRapide[]> {
    const { data, error } = await supabase
      .from('service_rapide')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as ServiceRapide[];
  },

  async getByType(type: 'public' | 'prive'): Promise<ServiceRapide[]> {
    const { data, error } = await supabase
      .from('service_rapide')
      .select('*')
      .eq('type_service', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as ServiceRapide[];
  },

  async create(service: ServiceRapideInsert): Promise<ServiceRapide> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('service_rapide')
      .insert({ ...service, created_by: user?.id })
      .select()
      .single();
    
    if (error) throw error;
    return data as ServiceRapide;
  },

  async update(id: string, service: Partial<ServiceRapideInsert>): Promise<ServiceRapide> {
    const { data, error } = await supabase
      .from('service_rapide')
      .update(service)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as ServiceRapide;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('service_rapide')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
