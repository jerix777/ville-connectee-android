
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface Souvenir {
  id: string;
  titre: string;
  description: string;
  date_souvenir: string;
  auteur: string;
  photo_url?: string;
  quartier_id?: string;
  created_at?: string;
}

export const fetchSouvenirs = async () => {
  const { data, error } = await (supabase as any)
    .from("souvenirs")
    .select(`
      *,
      quartiers (
        id,
        nom
      )
    `)
    .order("date_souvenir", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des souvenirs:", error);
    throw error;
  }

  return data as any;
};

export const fetchSouvenirsByQuartier = async (quartierId: string) => {
  const { data, error } = await (supabase as any)
    .from("souvenirs")
    .select(`
      *,
      quartiers (
        id,
        nom
      )
    `)
    .eq("quartier_id", quartierId)
    .order("date_souvenir", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des souvenirs:", error);
    throw error;
  }

  return data as any;
};

export const addSouvenir = async (souvenir: Omit<Souvenir, "id" | "created_at">) => {
  const { data, error } = await (supabase as any)
    .from("souvenirs")
    .insert([{ ...souvenir, id: uuidv4() }] as any)
    .select();

  if (error) {
    console.error("Erreur lors de l'ajout du souvenir:", error);
    throw error;
  }

  return data[0] as any;
};

export const uploadSouvenirPhoto = async (file: File) => {
  const filename = `${uuidv4()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("souvenirs")
    .upload(filename, file);

  if (error) {
    console.error("Erreur lors de l'upload de la photo:", error);
    throw error;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from("souvenirs")
    .getPublicUrl(filename);

  return publicUrl;
};
