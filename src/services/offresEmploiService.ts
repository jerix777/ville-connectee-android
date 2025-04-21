
import { supabase } from "@/integrations/supabase/client";

export interface OffreEmploi {
  id: string;
  titre: string;
  description: string;
  employeur: string;
  type_contrat: string;
  localisation: string;
  publie_le?: string | null;
}

export async function getOffresEmploi(): Promise<OffreEmploi[]> {
  const { data, error } = await supabase
    .from("offres_emploi")
    .select("*")
    .order("publie_le", { ascending: false });
  if (error) {
    console.error("Erreur chargement offres:", error);
    return [];
  }
  return data as OffreEmploi[];
}

export async function addOffreEmploi(
  offre: Omit<OffreEmploi, "id" | "publie_le">
): Promise<OffreEmploi | null> {
  const { data, error } = await supabase
    .from("offres_emploi")
    .insert([offre])
    .select();
  if (error) {
    console.error("Erreur ajout offre:", error);
    return null;
  }
  return data?.[0] as OffreEmploi;
}
