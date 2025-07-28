import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type TaxiCommunalDriver = Tables<"taxi_drivers"> & {
  profiles: {
    full_name: string;
    phone: string;
  } | null;
};

export type TaxiCommunalDriverInsert = TablesInsert<"taxi_drivers">;
export type TaxiCommunalBooking = Tables<"taxi_bookings">;
export type TaxiCommunalBookingInsert = TablesInsert<"taxi_bookings">;

export const getAvailableCommunalDrivers = async (category: 'moto' | 'brousse', search: string = '') => {
  let query = supabase
    .from("taxi_drivers")
    .select(`
      *,
      profiles:user_id(full_name, phone)
    `)
    .eq("is_available", true);

  // Filtrer par catégorie
  if (category === 'moto') {
    query = query.in("vehicle_type", ['moto', 'tricycle']);
  } else {
    query = query.eq("vehicle_type", 'brousse');
  }

  // Filtrer par recherche
  if (search.trim()) {
    query = query.ilike('profiles.full_name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createCommunalDriverProfile = async (driverData: Omit<TaxiCommunalDriverInsert, 'user_id'>) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("taxi_drivers")
    .insert({
      ...driverData,
      user_id: user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createCommunalBooking = async (bookingData: Omit<TaxiCommunalBookingInsert, 'user_id'>) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("taxi_bookings")
    .insert({
      ...bookingData,
      user_id: user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getCommunalDriverBookings = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("taxi_bookings")
    .select("*")
    .eq("driver_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const updateCommunalDriverAvailability = async (isAvailable: boolean) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("taxi_drivers")
    .update({ is_available: isAvailable })
    .eq("user_id", user.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
