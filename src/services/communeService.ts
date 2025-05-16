
import { getVillageById } from "@/services/villageService";
import { supabase } from "@/integrations/supabase/client";

export async function getCommune(id: string | null) {
  if (!id) {
    return {
      id: null,
      nom: "Ville Connectée",
    };
  }
  
  try {
    const village = await getVillageById(id);
    return village ? village : { id: null, nom: "Ville Connectée" };
  } catch (error) {
    console.error("Erreur lors de la récupération de la commune:", error);
    return {
      id: null,
      nom: "Ville Connectée",
    };
  }
}

// Fonction pour vérifier si une commune existe
export async function checkCommuneExists(id: string): Promise<boolean> {
  if (!id) return false;
  
  try {
    const { data, error } = await supabase
      .from('villages')
      .select('id')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Erreur lors de la vérification de la commune:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Erreur lors de la vérification de la commune:", error);
    return false;
  }
}
