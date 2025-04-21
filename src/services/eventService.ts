
import { supabase } from "@/integrations/supabase/client";

export interface EventType {
  id: string;
  label: string;
}

export interface Event {
  id: string;
  titre: string;
  type_id: string;
  type?: EventType;
  organisateur: string;
  lieu: string;
  date_debut: string;
  heure_debut: string;
  date_fin: string;
  heure_fin: string;
  contact1: string;
  contact2?: string;
}

export const getEventTypes = async (): Promise<EventType[]> => {
  const { data, error } = await supabase
    .from("event_types")
    .select("*");

  if (error) {
    console.error("Error fetching event types:", error);
    return [];
  }

  return data || [];
};

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from("evenements")
    .select(`
      *,
      type:event_types(id, label)
    `);

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data?.map(event => ({
    ...event,
    type: event.type as unknown as EventType
  })) || [];
};

export const addEvent = async (event: Omit<Event, "id" | "type">): Promise<Event | null> => {
  const { data, error } = await supabase
    .from("evenements")
    .insert([event])
    .select();

  if (error) {
    console.error("Error adding event:", error);
    return null;
  }

  return data?.[0] || null;
};

// Helper function to format date for display
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
