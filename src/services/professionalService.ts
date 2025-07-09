
import { supabase } from "@/integrations/supabase/client";

export interface Metier {
  id: string;
  nom: string;
}

export interface Professional {
  id: string;
  nom: string;
  metier_id: string;
  metier?: Metier;
  surnom?: string;
  contact1: string;
  contact2?: string;
  base: string;
  user_id?: string;
  email?: string;
  phone?: string;
  is_verified?: boolean;
  verification_method?: 'email' | 'phone';
}

export const getMetiers = async (): Promise<Metier[]> => {
  const { data, error } = await supabase
    .from("metiers")
    .select("*");

  if (error) {
    console.error("Error fetching metiers:", error);
    return [];
  }

  return data || [];
};

export const getProfessionals = async (): Promise<Professional[]> => {
  const { data, error } = await supabase
    .from("professionnels")
    .select(`
      *,
      metier:metiers(id, nom)
    `);

  if (error) {
    console.error("Error fetching professionals:", error);
    return [];
  }

  return data?.map(pro => ({
    ...pro,
    metier: pro.metier as unknown as Metier,
    verification_method: pro.verification_method as 'email' | 'phone' | undefined
  })) || [];
};

export const addProfessional = async (professional: Omit<Professional, "id" | "metier">): Promise<Professional | null> => {
  const { data, error } = await supabase
    .from("professionnels")
    .insert([professional])
    .select();

  if (error) {
    console.error("Error adding professional:", error);
    return null;
  }

  return data?.[0] ? {
    ...data[0],
    verification_method: data[0].verification_method as 'email' | 'phone' | undefined
  } : null;
};

// Fonction pour demander la vérification d'un professionnel
export const requestProfessionalVerification = async (
  professionalId: string, 
  method: 'email' | 'phone'
): Promise<{ success: boolean; verificationCode?: string; error?: string }> => {
  const { data, error } = await supabase.rpc('request_professional_verification', {
    professional_id: professionalId,
    method: method
  });

  if (error) {
    console.error("Error requesting verification:", error);
    return { success: false, error: error.message };
  }

  return data as { success: boolean; verificationCode?: string; error?: string };
};

// Fonction pour vérifier le code de vérification
export const verifyProfessional = async (
  professionalId: string, 
  verificationCode: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  const { data, error } = await supabase.rpc('verify_professional', {
    professional_id: professionalId,
    verification_code: verificationCode
  });

  if (error) {
    console.error("Error verifying professional:", error);
    return { success: false, error: error.message };
  }

  return data as { success: boolean; message?: string; error?: string };
};

// Fonction pour créer un profil professionnel pour l'utilisateur connecté
export const createMyProfessionalProfile = async (
  profileData: Omit<Professional, "id" | "metier" | "user_id" | "is_verified">
): Promise<Professional | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error("User not authenticated");
    return null;
  }

  const professional = {
    ...profileData,
    user_id: user.id
  };

  return addProfessional(professional);
};

// Fonction pour récupérer le profil professionnel de l'utilisateur connecté
export const getMyProfessionalProfile = async (): Promise<Professional | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("professionnels")
    .select(`
      *,
      metier:metiers(id, nom)
    `)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error("Error fetching my professional profile:", error);
    return null;
  }

  return data ? {
    ...data,
    metier: data.metier as unknown as Metier,
    verification_method: data.verification_method as 'email' | 'phone' | undefined
  } : null;
};

// Fonction pour lier un professionnel existant à l'utilisateur connecté
export const linkProfessionalToUser = async (
  professionalId: string,
  email: string,
  phone?: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  const { data, error } = await supabase.rpc('link_professional_to_user', {
    professional_id: professionalId,
    user_email: email,
    user_phone: phone
  });

  if (error) {
    console.error("Error linking professional to user:", error);
    return { success: false, error: error.message };
  }

  return data as { success: boolean; message?: string; error?: string };
};
