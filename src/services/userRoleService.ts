import { supabase } from "@/integrations/supabase/client";

export type UserRoleType = 'autorite_administrative' | 'autorite_villageoise' | 'administre';

export interface UserRole {
  id: string;
  user_id: string;
  role: UserRoleType;
  sub_role?: string;
  created_at: string;
}

export const ROLE_LABELS: Record<UserRoleType, string> = {
  'autorite_administrative': 'Autorité Administrative',
  'autorite_villageoise': 'Autorité Villageoise',
  'administre': 'Administré'
};

export const SUB_ROLE_OPTIONS: Record<UserRoleType, string[]> = {
  'autorite_administrative': ['Sous-préfet', 'Maire', 'Adjoint au Maire'],
  'autorite_villageoise': ['Chef de village', 'Notable', 'Président de regroupement socio-culturel'],
  'administre': ['Professionnel', 'Villageois', 'Habitant']
};

// Créer ou mettre à jour le rôle d'un utilisateur
export async function setUserRole(
  userId: string, 
  role: UserRoleType, 
  subRole?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Security check: only allow users to set their own role, or admin users to set others
    const currentUser = await supabase.auth.getUser();
    if (!currentUser.data.user) {
      return { success: false, error: 'Utilisateur non authentifié' };
    }

    // Users can only modify their own role unless they are admin
    if (currentUser.data.user.id !== userId) {
      const currentUserRole = await getUserRole(currentUser.data.user.id);
      if (!currentUserRole || currentUserRole.role !== 'autorite_administrative') {
        return { success: false, error: 'Accès non autorisé' };
      }
    }

    const { error } = await (supabase as any)
      .from('user_roles')
      .upsert({
        user_id: userId,
        role,
        sub_role: subRole
      } as any, {
        onConflict: 'user_id,role'
      });

    if (error) {
      console.error('Erreur création rôle:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
}

// Récupérer le rôle d'un utilisateur
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Erreur récupération rôle:', error);
      return null;
    }

    return data as any;
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return null;
  }
}

// Vérifier si un utilisateur a un rôle spécifique
export async function checkUserRole(userId: string, role: UserRoleType): Promise<boolean> {
  try {
    const { data, error } = await (supabase as any)
      .rpc('has_role', { _user_id: userId, _role: role });

    if (error) {
      console.error('Erreur vérification rôle:', error);
      return false;
    }

    return data as boolean;
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return false;
  }
}