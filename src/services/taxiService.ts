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
  village_id?: string;
  villages?: {
    id: string;
    nom: string;
  };
}

export type TaxiDriverInsert = Omit<TaxiDriver, 'id'>;
export type TaxiBooking = any;
export type TaxiBookingInsert = any;

export const getAvailableDrivers = async () => {
  const { data, error } = await (supabase as any)
    .from("taxi_drivers")
    .select(`
      *,
      villages (
        id,
        nom
      )
    `)
    .eq("is_available", true)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return (data as TaxiDriver[]) || [];
};

export const createDriverProfile = async (driverData: TaxiDriverInsert) => {
  const { data, error } = await (supabase as any)
    .from("taxi_drivers")
    .insert(driverData)
    .select()
    .single();
  
  if (error) throw error;
  return data as TaxiDriver;
};

export const createBooking = async (bookingData: any) => {
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
  return data as TaxiBooking;
};

export const getUserBookings = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await (supabase as any)
    .from("taxi_bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return (data as TaxiBooking[]) || [];
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  const { data, error } = await (supabase as any)
    .from("taxi_bookings")
    .update({ status })
    .eq("id", bookingId)
    .select()
    .single();
  
  if (error) throw error;
  return data as TaxiBooking;
};
