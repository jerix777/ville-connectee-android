
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export interface UserProfile {
  id: string;
  user_id: string;
  nom: string | null;
  prenom: string | null;
  commune_id: string | null;
  created_at?: string | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  communeId: string | null;
  sessionId: string;
}

// Récupère ou crée un ID de session pour les utilisateurs non connectés
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

// Récupère l'ID de la commune sélectionnée localement
export const getLocalCommuneId = (): string | null => {
  return localStorage.getItem("communeId");
};

// Enregistre l'ID de la commune sélectionnée localement
export const setLocalCommuneId = (communeId: string): void => {
  localStorage.setItem("communeId", communeId);
};

// Récupère le profil utilisateur
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("users_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
      
    if (error) {
      console.error("Erreur récupération profil:", error);
      return null;
    }
    
    return data as UserProfile;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}

// Met à jour le profil utilisateur
export async function updateUserProfile(
  userId: string, 
  updates: Partial<Omit<UserProfile, "id" | "user_id" | "created_at">>
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("users_profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();
      
    if (error) {
      console.error("Erreur mise à jour profil:", error);
      return null;
    }
    
    return data as UserProfile;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}

// Enregistre les préférences de commune pour les utilisateurs non connectés
export async function saveSessionCommune(
  sessionId: string,
  communeId: string
): Promise<boolean> {
  try {
    // Vérifie si une préférence existe déjà pour ce sessionId
    const { data: existingPref } = await supabase
      .from("commune_preferences")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();
    
    if (existingPref) {
      // Mise à jour
      const { error } = await supabase
        .from("commune_preferences")
        .update({ commune_id: communeId })
        .eq("session_id", sessionId);
        
      if (error) {
        console.error("Erreur mise à jour préférence:", error);
        return false;
      }
    } else {
      // Nouvelle insertion
      const { error } = await supabase
        .from("commune_preferences")
        .insert({ session_id: sessionId, commune_id: communeId });
        
      if (error) {
        console.error("Erreur insertion préférence:", error);
        return false;
      }
    }
    
    // Sauvegarde locale également
    setLocalCommuneId(communeId);
    return true;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return false;
  }
}

// Récupère les préférences de commune pour les utilisateurs non connectés
export async function getSessionCommune(sessionId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("commune_preferences")
      .select("commune_id")
      .eq("session_id", sessionId)
      .maybeSingle();
      
    if (error || !data) {
      console.error("Erreur récupération préférence:", error);
      return null;
    }
    
    return data.commune_id;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return null;
  }
}

// Connexion utilisateur
export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Erreur connexion:", err);
    return { success: false, error: "Une erreur s'est produite lors de la connexion" };
  }
}

// Inscription utilisateur
export async function signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Erreur inscription:", err);
    return { success: false, error: "Une erreur s'est produite lors de l'inscription" };
  }
}

// Déconnexion utilisateur
export async function signOut(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Erreur déconnexion:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return false;
  }
}
