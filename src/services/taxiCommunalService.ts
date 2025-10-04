import { supabase } from "@/integrations/supabase/client";

export type TaxiCommunalDriver = any & {
  profiles: {
    full_name: string;
    phone: string;
  } | null;
};

export type TaxiCommunalDriverInsert = any;
export type TaxiCommunalBooking = any;
export type TaxiCommunalBookingInsert = any;

export const getAvailableCommunalDrivers = async (category: 'moto' | 'brousse', search: string = '') => {
  let query = (supabase as any)
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
  return (data as TaxiCommunalDriver[]) || [];
};

export const createCommunalDriverProfile = async (driverData: any) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await (supabase as any)
    .from("taxi_drivers")
    .insert({
      ...driverData,
      user_id: user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as TaxiCommunalDriver;
};

export const createCommunalBooking = async (bookingData: any) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await (supabase as any)
    .from("taxi_bookings")
    .insert({
      ...bookingData,
      user_id: user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as TaxiCommunalBooking;
};

export const getCommunalDriverBookings = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await (supabase as any)
    .from("taxi_bookings")
    .select("*")
    .eq("driver_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return (data as TaxiCommunalBooking[]) || [];
};

export const updateCommunalDriverAvailability = async (isAvailable: boolean) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await (supabase as any)
    .from("taxi_drivers")
    .update({ is_available: isAvailable })
    .eq("user_id", user.id)
    .select()
    .single();
  
  if (error) throw error;
  return data as TaxiCommunalDriver;
};
