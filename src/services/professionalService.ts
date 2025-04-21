
import { supabase } from "@/integrations/supabase/client";

export interface Metier {
  id: string;
  nom: string;
}

export interface Professional {
  id: string;
  nom: string;
  metier_id: string;
  metier?: Metier;
  surnom?: string;
  contact1: string;
  contact2?: string;
  base: string;
}

export const getMetiers = async (): Promise<Metier[]> => {
  const { data, error } = await supabase
    .from("metiers")
    .select("*");

  if (error) {
    console.error("Error fetching metiers:", error);
    return [];
  }

  return data || [];
};

export const getProfessionals = async (): Promise<Professional[]> => {
  const { data, error } = await supabase
    .from("professionnels")
    .select(`
      *,
      metier:metiers(id, nom)
    `);

  if (error) {
    console.error("Error fetching professionals:", error);
    return [];
  }

  return data?.map(pro => ({
    ...pro,
    metier: pro.metier as unknown as Metier
  })) || [];
};

export const addProfessional = async (professional: Omit<Professional, "id" | "metier">): Promise<Professional | null> => {
  const { data, error } = await supabase
    .from("professionnels")
    .insert([professional])
    .select();

  if (error) {
    console.error("Error adding professional:", error);
    return null;
  }

  return data?.[0] || null;
};
