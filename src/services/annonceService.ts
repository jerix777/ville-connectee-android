
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
    const { data, error } = await (supabase as any)
      .from("actualites")
      .select("*")
      .eq("type", "communiqué officiel")
      .order("publie_le", { ascending: false });
      
    if (error) {
      console.error("Erreur chargement communiqués:", error);
      return [];
    }
    
    // Map database fields to our Annonce interface
    return ((data as any[]) || []).map((item: any) => ({
      id: item.id,
      titre: item.titre,
      contenu: item.contenu,
      emetteur: item.auteur || '', // Map auteur to emetteur
      publie_le: item.publie_le,
      image_url: item.image_url,
      created_at: item.created_at
    })) as Annonce[];
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return [];
  }
}

export async function addAnnonce(annonce: Omit<Annonce, "id" | "created_at" | "publie_le">): Promise<Annonce | null> {
  try {
    // Using the existing actualites table with a specific type
    const { data, error } = await (supabase as any)
      .from("actualites")
      .insert([{
        titre: annonce.titre,
        contenu: annonce.contenu,
        auteur: annonce.emetteur, // Map emetteur to auteur field
        image_url: annonce.image_url,
        type: "communiqué officiel",
        publie_le: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error("Erreur ajout communiqué:", error);
      return null;
    }
    
    // Map the returned data to our Annonce interface
    if (data && data[0]) {
      const item = data[0] as any;
      return {
        id: item.id,
        titre: item.titre,
        contenu: item.contenu,
        emetteur: item.auteur || '', // Map auteur to emetteur
        publie_le: item.publie_le,
        image_url: item.image_url,
        created_at: item.created_at
      } as Annonce;
    }
    
    return null;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}
