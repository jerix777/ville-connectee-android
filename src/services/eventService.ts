
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
  const { data, error } = await (supabase as any)
    .from("event_types")
    .select("*");

  if (error) {
    console.error("Error fetching event types:", error);
    return [];
  }

  return (data as EventType[]) || [];
};

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await (supabase as any)
    .from("evenements")
    .select(`
      *,
      type:event_types(id, label)
    `);

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return ((data as any[])?.map((event: any) => ({
    ...event,
    type: event.type as unknown as EventType
  })) || []) as Event[];
};

export const addEvent = async (event: Omit<Event, "id" | "type">): Promise<Event | null> => {
  const { data, error } = await (supabase as any)
    .from("evenements")
    .insert([event as any])
    .select();

  if (error) {
    console.error("Error adding event:", error);
    return null;
  }

  return (data?.[0] as Event) || null;
};

// Helper function to format date for display
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
