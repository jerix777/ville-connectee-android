
import { supabase } from "@/integrations/supabase/client";

export interface MarketItem {
  id: string;
  titre: string;
  vendeur: string;
  description: string;
  prix: number;
  contact1: string;
  contact2?: string;
  is_for_sale: boolean;
}

export const getMarketItems = async (): Promise<MarketItem[]> => {
  const { data, error } = await supabase
    .from("marche")
    .select("*");

  if (error) {
    console.error("Error fetching market items:", error);
    return [];
  }

  return data || [];
};

export const addMarketItem = async (item: Omit<MarketItem, "id">): Promise<MarketItem | null> => {
  const { data, error } = await supabase
    .from("marche")
    .insert([item])
    .select();

  if (error) {
    console.error("Error adding market item:", error);
    return null;
  }

  return data?.[0] || null;
};
