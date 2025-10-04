
import { supabase } from "@/integrations/supabase/client";

export interface Obituary {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string | null;
  date_deces: string;
  lieu_deces: string | null;
  message: string | null;
  photo_url: string | null;
  created_at?: string | null;
}

export async function getObituaries(): Promise<Obituary[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("necrologie")
      .select("*")
      .order("date_deces", { ascending: false });
      
    if (error) {
      console.error("Erreur chargement nécrologie:", error);
      return [];
    }
    
    return (data as Obituary[]) || [];
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return [];
  }
}

export async function getObituaryById(id: string): Promise<Obituary | null> {
  try {
    const { data, error } = await (supabase as any)
      .from("necrologie")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      console.error("Erreur chargement nécrologie:", error);
      return null;
    }
    
    return data as Obituary;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}

export async function addObituary(obituary: Omit<Obituary, "id" | "created_at">): Promise<Obituary | null> {
  try {
    const { data, error } = await (supabase as any)
      .from("necrologie")
      .insert([obituary as any])
      .select();

    if (error) {
      console.error("Erreur ajout nécrologie:", error);
      return null;
    }
    
    return (data[0] as Obituary) || null;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}

export async function updateObituary(id: string, obituary: Partial<Omit<Obituary, "id" | "created_at">>): Promise<Obituary | null> {
  try {
    const { data, error } = await (supabase as any)
      .from("necrologie")
      .update(obituary as any)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Erreur mise à jour nécrologie:", error);
      return null;
    }
    
    return (data[0] as Obituary) || null;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}

export async function deleteObituary(id: string): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from("necrologie")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur suppression nécrologie:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return false;
  }
}
