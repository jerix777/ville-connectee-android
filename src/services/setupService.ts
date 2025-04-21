
import { supabase } from "@/integrations/supabase/client";

// Types d'événements par défaut
const DEFAULT_EVENT_TYPES = [
  "Culturel", 
  "Municipal", 
  "Commercial", 
  "Sportif", 
  "Éducatif", 
  "Associatif", 
  "Autre"
];

// Métiers par défaut
const DEFAULT_METIERS = [
  "Maçonnerie",
  "Plomberie", 
  "Électricité",
  "Menuiserie",
  "Peinture",
  "Jardinage",
  "Nettoyage",
  "Cuisine",
  "Transport",
  "Coiffure",
  "Couture",
  "Informatique",
  "Réparation Auto",
  "Autre"
];

// Fonction pour initialiser les données par défaut
export const initDefaultData = async () => {
  try {
    console.log("Initialisation des données par défaut...");
    
    // Vérifier et ajouter les types d'événements par défaut
    const { data: existingEventTypes } = await supabase
      .from("event_types")
      .select("label");
    
    const existingEventTypeLabels = existingEventTypes?.map(type => type.label) || [];
    
    const eventTypesToAdd = DEFAULT_EVENT_TYPES
      .filter(type => !existingEventTypeLabels.includes(type))
      .map(label => ({ label }));
    
    if (eventTypesToAdd.length > 0) {
      await supabase
        .from("event_types")
        .insert(eventTypesToAdd);
      console.log(`${eventTypesToAdd.length} types d'événements ajoutés`);
    }
    
    // Vérifier et ajouter les métiers par défaut
    const { data: existingMetiers } = await supabase
      .from("metiers")
      .select("nom");
    
    const existingMetierNames = existingMetiers?.map(metier => metier.nom) || [];
    
    const metiersToAdd = DEFAULT_METIERS
      .filter(nom => !existingMetierNames.includes(nom))
      .map(nom => ({ nom }));
    
    if (metiersToAdd.length > 0) {
      await supabase
        .from("metiers")
        .insert(metiersToAdd);
      console.log(`${metiersToAdd.length} métiers ajoutés`);
    }
    
    console.log("Initialisation terminée avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données par défaut:", error);
  }
};
