
import { supabase } from "@/integrations/supabase/client";

export type NewsType = "actualité" | "communiqué";

export interface News {
  id: string;
  titre: string;
  contenu: string;
  type: NewsType;
  auteur?: string | null;
  publie_le?: string | null;
  image_url?: string | null;
  created_at?: string | null;
}

export async function getNews(): Promise<News[]> {
  const { data, error } = await (supabase as any)
    .from("actualites")
    .select("*")
    .order("publie_le", { ascending: false });
  if (error) {
    console.error("Erreur chargement actualités:", error);
    return [];
  }
  return (data as News[]) || [];
}

export async function addNews(news: Omit<News, "id" | "created_at" | "publie_le">): Promise<News | null> {
  const { data, error } = await (supabase as any)
    .from("actualites")
    .insert([news as any])
    .select();
  if (error) {
    console.error("Erreur ajout actualités:", error);
    return null;
  }
  return (data?.[0] as News) || null;
}
