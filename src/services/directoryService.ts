import { supabase } from "@/integrations/supabase/client";

export interface DirectoryEntry {
  id: string;
  name: string;
  service_type: string;
  address: string | null;
  phone1: string;
  phone2: string | null;
  email: string | null;
  quartier: string;
}

export interface NewDirectoryEntry {
    name: string;
    service_type: string;
    address?: string | null;
    phone1: string;
    phone2?: string | null;
    email?: string | null;
    quartier_id: string;
}

export interface Quartier {
    id: string;
    nom: string;
}

export const getDirectoryEntries = async (): Promise<DirectoryEntry[]> => {
  const { data, error } = await supabase
    .from("directory_entries")
    .select(`
      id,
      name,
      service_type,
      address,
      phone1,
      phone2,
      email,
      quartiers ( nom )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching directory entries:", error);
    throw error;
  }

  return data.map((entry: any) => ({
    ...entry,
    quartier: entry.quartiers ? entry.quartiers.nom : 'N/A',
  }));
};

export const addDirectoryEntry = async (entry: NewDirectoryEntry) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('directory_entries')
        .insert([
            { ...entry, user_id: user?.id }
        ])
        .select()
        .single();

    if (error) {
        console.error('Error adding directory entry:', error);
        throw error;
    }

    return data;
}

export const getQuartiers = async (): Promise<Quartier[]> => {
    const { data, error } = await supabase
        .from('quartiers')
        .select('id, nom')
        .order('nom', { ascending: true });

    if (error) {
        console.error('Error fetching quartiers:', error);
        throw error;
    }

    return data;
}
