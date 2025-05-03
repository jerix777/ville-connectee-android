
import { supabase } from "@/integrations/supabase/client";

export interface Annonce {
  id: string;
  titre: string;
  contenu: string;
  emetteur: string;
  publie_le?: string | null;
  image_url?: string | null;
  created_at?: string | null;
}

export async function getAnnonces(): Promise<Annonce[]> {
  try {
    // For now, we'll use the actualites table with a filter for "communiqué" type
    // This could be changed later to a dedicated table if needed
    const { data, error } = await supabase
      .from("actualites")
      .select("*")
      .eq("type", "communiqué officiel")
      .order("publie_le", { ascending: false });
      
    if (error) {
      console.error("Erreur chargement communiqués:", error);
      return [];
    }
    return data as Annonce[];
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return [];
  }
}

export async function addAnnonce(annonce: Omit<Annonce, "id" | "created_at" | "publie_le">): Promise<Annonce | null> {
  try {
    // Using the existing actualites table with a specific type
    const { data, error } = await supabase
      .from("actualites")
      .insert([{
        ...annonce,
        type: "communiqué officiel",
        publie_le: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error("Erreur ajout communiqué:", error);
      return null;
    }
    return data?.[0] as Annonce;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}
