import { supabase } from "@/integrations/supabase/client";

export interface ExtendedUserProfile {
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
  created_at?: string | null;
}

export interface AutoriteZone {
  id: string;
  user_id: string;
  zone_type: string;
  zone_id: string | null;
  zone_nom: string;
  description: string | null;
  created_at?: string | null;
}

export interface ProfessionnelCompetence {
  id: string;
  user_id: string;
  domaine_competence: string;
  niveau_competence: string | null;
  certifications: string[] | null;
  experience_annees: number | null;
  description: string | null;
  created_at?: string | null;
}

// Mettre à jour le profil utilisateur étendu
export async function updateExtendedUserProfile(
  userId: string,
  profileData: Partial<Omit<ExtendedUserProfile, "id" | "user_id" | "created_at">>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase as any)
      .from('users_profiles')
      .update(profileData)
      .eq('user_id', userId);

    if (error) {
      console.error('Erreur mise à jour profil étendu:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Ajouter une zone d'autorité
export async function addAutoriteZone(
  userId: string,
  zoneData: Omit<AutoriteZone, "id" | "user_id" | "created_at">
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase as any)
      .from('autorite_zones')
      .insert({
        user_id: userId,
        ...zoneData
      });

    if (error) {
      console.error('Erreur ajout zone autorité:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Récupérer les zones d'autorité d'un utilisateur
export async function getAutoriteZones(userId: string): Promise<AutoriteZone[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('autorite_zones')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Erreur récupération zones autorité:', error);
      return [];
    }

    return (data as AutoriteZone[]) || [];
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return [];
  }
}

// Ajouter une compétence professionnelle
export async function addProfessionnelCompetence(
  userId: string,
  competenceData: Omit<ProfessionnelCompetence, "id" | "user_id" | "created_at">
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase as any)
      .from('professionnel_competences')
      .insert({
        user_id: userId,
        ...competenceData
      });

    if (error) {
      console.error('Erreur ajout compétence:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Récupérer les compétences professionnelles d'un utilisateur
export async function getProfessionnelCompetences(userId: string): Promise<ProfessionnelCompetence[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('professionnel_competences')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Erreur récupération compétences:', error);
      return [];
    }

    return (data as ProfessionnelCompetence[]) || [];
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return [];
  }
}

// Niveaux de compétence disponibles
export const NIVEAUX_COMPETENCE = [
  'Débutant',
  'Intermédiaire', 
  'Expérimenté',
  'Expert',
  'Maître'
];

// Types de zones d'autorité
export const TYPES_ZONES_AUTORITE = [
  { value: 'commune', label: 'Commune' },
  { value: 'village', label: 'Village' },
  { value: 'quartier', label: 'Quartier' },
  { value: 'regroupement', label: 'Regroupement socio-culturel' }
];
