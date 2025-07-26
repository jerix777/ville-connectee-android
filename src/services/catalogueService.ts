import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type CatalogueCategorie = Tables<"catalogue_categories">;
export type CatalogueItem = Tables<"catalogue_items">;
export type CatalogueCategorieInsert = TablesInsert<"catalogue_categories">;
export type CatalogueItemInsert = TablesInsert<"catalogue_items">;

// Categories
export const getCatalogueCategories = async () => {
  const { data, error } = await supabase
    .from("catalogue_categories")
    .select(`
      *,
      catalogue_items(count)
    `)
    .order("nom", { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createCatalogueCategory = async (category: CatalogueCategorieInsert) => {
  const { data, error } = await supabase
    .from("catalogue_categories")
    .insert(category)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCatalogueCategory = async (id: string, category: Partial<CatalogueCategorieInsert>) => {
  const { data, error } = await supabase
    .from("catalogue_categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCatalogueCategory = async (id: string) => {
  const { error } = await supabase
    .from("catalogue_categories")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
};

// Items
export const getCatalogueItems = async (categoryId?: string) => {
  let query = supabase
    .from("catalogue_items")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createCatalogueItem = async (item: CatalogueItemInsert) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("catalogue_items")
    .insert({
      ...item,
      created_by: user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCatalogueItem = async (id: string, item: Partial<CatalogueItemInsert>) => {
  const { data, error } = await supabase
    .from("catalogue_items")
    .update(item)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCatalogueItem = async (id: string) => {
  const { error } = await supabase
    .from("catalogue_items")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
};