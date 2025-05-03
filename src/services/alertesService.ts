
import { supabase } from "@/integrations/supabase/client";

export interface ImmobilierAlerte {
  id: string;
  email: string;
  prix_max?: number;
  is_location: boolean;
  is_vente: boolean;
  created_at?: string;
}

export const saveAlerte = async (alerte: Omit<ImmobilierAlerte, "id" | "created_at">): Promise<ImmobilierAlerte | null> => {
  try {
    const { data, error } = await supabase
      .from("alertes_immobilier")
      .insert([alerte])
      .select();

    if (error) {
      console.error("Erreur lors de l'enregistrement de l'alerte:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
};

export const getAlertes = async (email: string): Promise<ImmobilierAlerte[]> => {
  try {
    const { data, error } = await supabase
      .from("alertes_immobilier")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des alertes:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return [];
  }
};

export const deleteAlerte = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("alertes_immobilier")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression de l'alerte:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return false;
  }
};
