
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { SecurityAudit } from "@/lib/auditLog";
import { validateEmail, validatePassword } from "@/lib/security";

export interface UserProfile {
  id: string;
  user_id: string;
  nom: string | null;
  prenom: string | null;
  date_naissance: string | null;
  lieu_naissance: string | null;
  lieu_residence: string | null;
  contact_telephone: string | null;
  commune_id: string | null;
  village_origine_id: string | null;
  geolocation_enabled?: boolean | null;
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
  if (communeId) {
    localStorage.setItem("communeId", communeId);
  } else {
    localStorage.removeItem("communeId");
  }
};

// Récupère le profil utilisateur
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await (supabase as any)
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
    // Vérifiez d'abord si le profil existe
    const existingProfile = await getUserProfile(userId);
    
    if (!existingProfile) {
      // Créer un nouveau profil si aucun n'existe
      const { data, error } = await (supabase as any)
        .from("users_profiles")
        .insert({
          user_id: userId,
          ...updates
        })
        .select()
        .single();
        
      if (error) {
        console.error("Erreur création profil:", error);
        return null;
      }
      
      // Si une commune est spécifiée, mettre à jour le stockage local
      if (updates.commune_id) {
        setLocalCommuneId(updates.commune_id);
      }
      
      return data as UserProfile;
    }
    
    // Mettre à jour le profil existant
    const { data, error } = await (supabase as any)
      .from("users_profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();
      
    if (error) {
      console.error("Erreur mise à jour profil:", error);
      return null;
    }
    
    // Si une commune est spécifiée, mettre à jour le stockage local
    if (updates.commune_id) {
      setLocalCommuneId(updates.commune_id);
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
    if (!sessionId || !communeId) {
      console.error("ID de session ou de commune manquant");
      return false;
    }
    
    // Vérifie si une préférence existe déjà pour ce sessionId
    const { data: existingPref, error: queryError } = await (supabase as any)
      .from("commune_preferences")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();
    
    if (queryError) {
      console.error("Erreur vérification préférence:", queryError);
      // On continue pour essayer d'insérer une nouvelle préférence
    }
    
    if (existingPref) {
      // Mise à jour
      const { error } = await (supabase as any)
        .from("commune_preferences")
        .update({ commune_id: communeId })
        .eq("session_id", sessionId);
        
      if (error) {
        console.error("Erreur mise à jour préférence:", error);
        return false;
      }
    } else {
      // Nouvelle insertion
      const { error } = await (supabase as any)
        .from("commune_preferences")
        .insert({ session_id: sessionId, commune_id: communeId });
        
      if (error) {
        console.error("Erreur insertion préférence:", error);
        return false;
      }
    }
    
    // Sauvegarde locale également
    setLocalCommuneId(communeId);
    
    toast({
      title: "Commune sélectionnée",
      description: "Votre préférence de commune a été enregistrée"
    });
    
    return true;
  } catch (err) {
    console.error("Erreur inattendue:", err);
    return false;
  }
}

// Récupère les préférences de commune pour les utilisateurs non connectés
export async function getSessionCommune(sessionId: string): Promise<string | null> {
  try {
    if (!sessionId) {
      console.error("ID de session manquant");
      return null;
    }
    
    // Essayons d'abord la valeur stockée localement
    const localCommuneId = getLocalCommuneId();
    if (localCommuneId) {
      return localCommuneId;
    }
    
    const { data, error } = await (supabase as any)
      .from("commune_preferences")
      .select("commune_id")
      .eq("session_id", sessionId)
      .maybeSingle();
      
    if (error) {
      console.error("Erreur récupération préférence:", error);
      return null;
    }
    
    const result = data as any;
    if (result && result.commune_id) {
      // Met à jour aussi le stockage local
      setLocalCommuneId(result.commune_id);
      return result.commune_id;
    }
    
    return null;
  } catch (err) {
    console.error("Erreur inattendue lors de la récupération de la commune:", err);
    return null;
  }
}

// Connexion utilisateur
export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      await SecurityAudit.logLogin(false, email, emailValidation.error);
      return { success: false, error: emailValidation.error };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      await SecurityAudit.logLogin(false, email, error.message);
      return { success: false, error: error.message };
    }
    
    await SecurityAudit.logLogin(true, email);
    return { success: true };
  } catch (err) {
    console.error("Erreur connexion:", err);
    await SecurityAudit.logLogin(false, email, "Erreur système");
    return { success: false, error: "Une erreur s'est produite lors de la connexion" };
  }
}

// Inscription utilisateur
export async function signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.error };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
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
