import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type TaxiCommunalDriver = Tables<"taxi_drivers">;
export type TaxiCommunalDriverInsert = TablesInsert<"taxi_drivers">;

export const getAvailableCommunalDrivers = async (category: 'moto' | 'brousse', search: string) => {
  let query = supabase
    .from("taxi_drivers")
    .select("*, profiles:profiles(full_name, phone)")
    .eq("is_available", true)
    .ilike("vehicle_type", category === 'moto' ? '%moto%' : '%brousse%');

  if (search) {
    query = query.ilike('profiles.full_name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};
