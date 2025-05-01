
import { supabase } from "@/integrations/supabase/client";

export interface Immobilier {
  id: string;
  titre: string;
  type: string;
  description: string;
  prix: number;
  surface: number;
  pieces?: number;
  chambres?: number;
  adresse: string;
  contact: string;
  created_at?: string;
  is_for_sale: boolean;
  vendeur: string;
}

export const getImmobilier = async (): Promise<Immobilier[]> => {
  try {
    const { data, error } = await supabase
      .from("immobilier")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des biens immobiliers:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return [];
  }
};

export const addImmobilier = async (bien: Omit<Immobilier, "id" | "created_at">): Promise<Immobilier | null> => {
  try {
    const { data, error } = await supabase
      .from("immobilier")
      .insert([bien])
      .select();

    if (error) {
      console.error("Erreur lors de l'ajout d'un bien immobilier:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
};
