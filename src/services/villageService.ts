
import { supabase } from "@/integrations/supabase/client";

export interface Village {
  id: string;
  nom: string;
  description: string | null;
  population: number | null;
  code_postal: string | null;
  image_url: string | null;
  created_at?: string | null;
}

export async function getVillages(): Promise<Village[]> {
  try {
    const { data, error } = await supabase
      .from("villages")
      .select("*")
      .order("nom");
      
    if (error) {
      console.error("Erreur chargement villages:", error);
      return [];
    }
    
    return data as Village[];
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return [];
  }
}

export async function getVillageById(id: string): Promise<Village | null> {
  try {
    const { data, error } = await supabase
      .from("villages")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      console.error("Erreur chargement village:", error);
      return null;
    }
    
    return data as Village;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}

export async function addVillage(village: Omit<Village, "id" | "created_at">): Promise<Village | null> {
  try {
    const { data, error } = await supabase
      .from("villages")
      .insert([village])
      .select();

    if (error) {
      console.error("Erreur ajout village:", error);
      return null;
    }
    
    return data[0] as Village;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}

export async function updateVillage(id: string, village: Partial<Omit<Village, "id" | "created_at">>): Promise<Village | null> {
  try {
    const { data, error } = await supabase
      .from("villages")
      .update(village)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Erreur mise à jour village:", error);
      return null;
    }
    
    return data[0] as Village;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}

export async function deleteVillage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("villages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur suppression village:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return false;
  }
}
