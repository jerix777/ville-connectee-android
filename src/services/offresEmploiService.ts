
import { supabase } from "@/integrations/supabase/client";

export interface OffreEmploi {
  id: string;
  titre: string;
  description: string;
  employeur: string;
  type_contrat: string;
  localisation: string;
  publie_le: string | null;
  created_at: string | null;
}

// Charger toutes les offres d'emploi, en les triant par date de publication
export async function getOffresEmploi(): Promise<OffreEmploi[]> {
  const { data, error } = await supabase
    .from("offres_emploi")
    .select("*")
    .order("publie_le", { ascending: false });

  if (error) {
    console.error("Erreur chargement offres:", error);
    return [];
  }
  
  return (data || []) as OffreEmploi[];
}

// Ajouter une offre d'emploi (en omettant l'id et la date de publication, gérés côté BDD)
export async function addOffreEmploi(
  offre: Omit<OffreEmploi, "id" | "publie_le" | "created_at">
): Promise<OffreEmploi | null> {
  const { data, error } = await supabase
    .from("offres_emploi")
    .insert([offre])
    .select();

  if (error) {
    console.error("Erreur ajout offre:", error);
    return null;
  }

  if (data && data.length > 0) {
    return data[0] as OffreEmploi;
  }
  return null;
}
