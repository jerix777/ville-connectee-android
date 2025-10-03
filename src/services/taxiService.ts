import { supabase } from "@/integrations/supabase/client";

export interface TaxiDriver {
  id: string;
  name: string;
  contact1: string;
  contact2?: string;
  vehicle_type: string;
  description?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  status: string;
  location: string;
}

export type TaxiDriverInsert = Omit<TaxiDriver, 'id'>;
export type TaxiBooking = Tables<"taxi_bookings">;
export type TaxiBookingInsert = TablesInsert<"taxi_bookings">;

export const getAvailableDrivers = async () => {
  const { data, error } = await supabase
    .from("taxi_drivers")
    .select("*")
    .eq("is_available", true);
  
  if (error) throw error;
  return data || [];
};

export const createDriverProfile = async (driverData: TaxiDriverInsert) => {
  const { data, error } = await supabase
    .from("taxi_drivers")
    .insert(driverData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createBooking = async (bookingData: Omit<TaxiBookingInsert, 'user_id'>) => {
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

export const getUserBookings = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("taxi_bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  const { data, error } = await supabase
    .from("taxi_bookings")
    .update({ status })
    .eq("id", bookingId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
