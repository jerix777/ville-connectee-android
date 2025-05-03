
import { supabase } from "@/integrations/supabase/client";

export interface ImmobilierAlerte {
  id: string;
  email: string;
  prix_max?: number;
  is_location: boolean;
  is_vente: boolean;
  created_at?: string;
}

// Since there's no dedicated alertes_immobilier table,
// we'll store alerts in a new field in localStorage
export const saveAlerte = async (alerte: Omit<ImmobilierAlerte, "id" | "created_at">): Promise<ImmobilierAlerte | null> => {
  try {
    // Generate a random UUID for the alert
    const id = crypto.randomUUID();
    
    // Create the complete alert object
    const newAlerte: ImmobilierAlerte = {
      id,
      email: alerte.email,
      prix_max: alerte.prix_max,
      is_location: alerte.is_location,
      is_vente: alerte.is_vente,
      created_at: new Date().toISOString()
    };
    
    // Get existing alerts from localStorage
    const existingAlertesString = localStorage.getItem('alertes_immobilier');
    const existingAlertes: ImmobilierAlerte[] = existingAlertesString 
      ? JSON.parse(existingAlertesString) 
      : [];
    
    // Add the new alert and save back to localStorage
    existingAlertes.push(newAlerte);
    localStorage.setItem('alertes_immobilier', JSON.stringify(existingAlertes));
    
    return newAlerte;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
};

export const getAlertes = async (email: string): Promise<ImmobilierAlerte[]> => {
  try {
    // Get alerts from localStorage
    const alertesString = localStorage.getItem('alertes_immobilier');
    if (!alertesString) {
      return [];
    }
    
    const allAlertes: ImmobilierAlerte[] = JSON.parse(alertesString);
    
    // Filter alerts by email
    return allAlertes.filter(alerte => alerte.email === email);
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return [];
  }
};

export const deleteAlerte = async (id: string): Promise<boolean> => {
  try {
    // Get existing alerts from localStorage
    const alertesString = localStorage.getItem('alertes_immobilier');
    if (!alertesString) {
      return false;
    }
    
    const alertes: ImmobilierAlerte[] = JSON.parse(alertesString);
    
    // Filter out the alert to be deleted
    const updatedAlertes = alertes.filter(alerte => alerte.id !== id);
    
    // Save the updated alerts back to localStorage
    localStorage.setItem('alertes_immobilier', JSON.stringify(updatedAlertes));
    
    return true;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return false;
  }
};
