
import { supabase } from "@/integrations/supabase/client";

export interface OffreEmploi {
  id: string;
  titre: string;
  description: string;
  employeur: string;
  type_contrat: string;
  localisation: string;
  publie_le?: string | null;
  created_at?: string | null;
}

// Charger toutes les offres d'emploi, en les triant par date de publication
export async function getOffresEmploi(): Promise<OffreEmploi[]> {
  const { data, error } = await supabase
    .from("offres_emploi" as any)
    .select("*")
    .order("publie_le", { ascending: false });

  if (error) {
    console.error("Erreur chargement offres:", error);
    return [];
  }
  // Filtrer pour ne garder que les objets correspondant à l’interface attendue
  return (data ?? []).filter(
    (o): o is OffreEmploi =>
      typeof o === "object" &&
      o !== null &&
      "titre" in o &&
      "description" in o &&
      "employeur" in o &&
      "type_contrat" in o &&
      "localisation" in o
  );
}

// Ajouter une offre d'emploi (en omettant l’id et la date de publication, gérés côté BDD)
export async function addOffreEmploi(
  offre: Omit<OffreEmploi, "id" | "publie_le" | "created_at">
): Promise<OffreEmploi | null> {
  const { data, error } = await supabase
    .from("offres_emploi" as any)
    .insert([offre])
    .select();

  if (error) {
    console.error("Erreur ajout offre:", error);
    return null;
  }

  const record = data?.[0];
  if (
    record &&
    typeof record === "object" &&
    "titre" in record &&
    "description" in record &&
    "employeur" in record &&
    "type_contrat" in record &&
    "localisation" in record
  ) {
    return record as OffreEmploi;
  }
  return null;
}
