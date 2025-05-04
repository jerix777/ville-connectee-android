
import { getVillageById } from "@/services/villageService";

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
