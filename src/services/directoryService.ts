import { supabase } from "@/integrations/supabase/client";

export interface Village {
  id: string;
  nom: string;
}

export interface DirectoryEntry {
  id: string;
  name: string;
  service_type: string;
  address: string | null;
  phone1: string;
  phone2: string | null;
  email: string | null;
  village: { nom: string } | null;
}

export interface NewDirectoryEntry {
    name: string;
    service_type: string;
    village_id: string;
    address?: string | null;
    phone1: string;
    phone2?: string | null;
    email?: string | null;
}

export const getDirectoryEntries = async (): Promise<DirectoryEntry[]> => {
  const { data: entries, error: entriesError } = await supabase
    .from("directory_entries")
    .select(
      `
      id,
      name,
      service_type,
      address,
      phone1,
      phone2,
      email,
      village:villages(nom)
    `
    )
    .order("name", { ascending: true });

  if (entriesError) {
    console.error("Error fetching directory entries:", entriesError);
    throw entriesError;
  }

  return entries || [];
};

export const getVillages = async (): Promise<Village[]> => {
    const { data, error } = await supabase.from("villages").select("id, nom");
  
    if (error) {
      console.error("Error fetching villages:", error);
      throw error;
    }
  
    return data || [];
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
