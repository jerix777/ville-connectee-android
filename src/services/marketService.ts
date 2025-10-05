
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
  try {
    const { data, error } = await (supabase as any)
      .from("marche")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching market items:", error);
      return [];
    }

    return (data as MarketItem[]) || [];
  } catch (err) {
    console.error("Unexpected error fetching market items:", err);
    return [];
  }
};

export const addMarketItem = async (item: Omit<MarketItem, "id">): Promise<MarketItem | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from("marche")
      .insert([item as any])
      .select();

    if (error) {
      console.error("Error adding market item:", error);
      return null;
    }

    return (data?.[0] as MarketItem) || null;
  } catch (err) {
    console.error("Unexpected error adding market item:", err);
    return null;
  }
};
