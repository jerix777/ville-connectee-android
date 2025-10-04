import { supabase } from "@/integrations/supabase/client";

export interface Association {
  id: string;
  nom: string;
  description: string;
  contact: string;
  quartier_id?: string;
  logo_url?: string;
  nombre_membres: number;
  responsable_id?: string;
  statut: string;
  date_creation: string;
  created_at: string;
}

export interface AssociationMembre {
  id: string;
  association_id: string;
  user_id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: string;
  date_adhesion: string;
  date_arrivee?: string;
  cotisation_a_jour: boolean;
  dernier_paiement?: string;
  montant_cotisation: number;
  created_at: string;
  updated_at: string;
}

export interface AssociationAnnonce {
  id: string;
  association_id: string;
  titre: string;
  contenu: string;
  auteur_id: string;
  priorite: 'haute' | 'moyenne' | 'normale';
  visible_jusqu?: string;
  created_at: string;
  updated_at: string;
}

export type AssociationAnnonceInsert = Omit<AssociationAnnonce, 'id' | 'created_at' | 'updated_at'>;
export type AssociationDepenseInsert = Omit<AssociationDepense, 'id' | 'created_at' | 'updated_at'>;

export interface AssociationDepense {
  id: string;
  association_id: string;
  description: string;
  montant: number;
  categorie: string;
  responsable_id: string;
  justificatif_url?: string;
  date_depense: string;
  approuve: boolean;
  created_at: string;
  updated_at: string;
}

// Services pour les associations
export const associationService = {
  // CRUD Associations
  async getAll(): Promise<Association[]> {
    const { data, error } = await (supabase as any)
      .from('associations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Association[]) || [];
  },

  async getById(id: string): Promise<Association | null> {
    const { data, error } = await (supabase as any)
      .from('associations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Association;
  },

  async create(association: Omit<Association, 'id' | 'created_at' | 'nombre_membres'>): Promise<Association> {
    const { data, error } = await (supabase as any)
      .from('associations')
      .insert([association])
      .select()
      .single();

    if (error) throw error;
    return data as Association;
  },

  async update(id: string, updates: Partial<Association>): Promise<Association> {
    const { data, error } = await (supabase as any)
      .from('associations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Association;
  },

  async delete(id: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('associations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // CRUD Membres
  async getMembers(associationId: string): Promise<AssociationMembre[]> {
    const { data, error } = await (supabase as any)
      .from('association_membres')
      .select('*')
      .eq('association_id', associationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Log sensitive member data access
    if (data && data.length > 0) {
      try {
        await (supabase as any).rpc('log_sensitive_data_access', {
          p_resource_type: 'association_membres',
          p_resource_id: associationId,
          p_action: 'view_members'
        });
      } catch (logError) {
        console.warn("Failed to log member data access:", logError);
      }
    }
    
    return (data as AssociationMembre[]) || [];
  },

  async addMember(membre: Omit<AssociationMembre, 'id' | 'created_at' | 'updated_at'>): Promise<AssociationMembre> {
    const { data, error } = await (supabase as any)
      .from('association_membres')
      .insert([membre])
      .select()
      .single();

    if (error) throw error;
    return data as AssociationMembre;
  },

  async updateMember(id: string, updates: Partial<AssociationMembre>): Promise<AssociationMembre> {
    const { data, error } = await (supabase as any)
      .from('association_membres')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AssociationMembre;
  },

  async deleteMember(id: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('association_membres')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // CRUD Annonces
  async getAnnonces(associationId: string): Promise<AssociationAnnonce[]> {
    const { data, error } = await (supabase as any)
      .from('association_annonces')
      .select('*')
      .eq('association_id', associationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as AssociationAnnonce[]) || [];
  },

  async createAnnonce(annonce: AssociationAnnonceInsert): Promise<AssociationAnnonce> {
    const { data, error } = await (supabase as any)
      .from('association_annonces')
      .insert([annonce as any])
      .select()
      .single();

    if (error) throw error;
    return data as AssociationAnnonce;
  },

  async updateAnnonce(id: string, updates: Partial<AssociationAnnonce>): Promise<AssociationAnnonce> {
    const { data, error } = await (supabase as any)
      .from('association_annonces')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AssociationAnnonce;
  },

  async deleteAnnonce(id: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('association_annonces')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // CRUD Dépenses
  async getDepenses(associationId: string): Promise<AssociationDepense[]> {
    const { data, error } = await (supabase as any)
      .from('association_depenses')
      .select('*')
      .eq('association_id', associationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as AssociationDepense[]) || [];
  },

  async createDepense(depense: AssociationDepenseInsert): Promise<AssociationDepense> {
    const { data, error } = await (supabase as any)
      .from('association_depenses')
      .insert([depense as any])
      .select()
      .single();

    if (error) throw error;
    return data as AssociationDepense;
  },

  async updateDepense(id: string, updates: Partial<AssociationDepense>): Promise<AssociationDepense> {
    const { data, error } = await (supabase as any)
      .from('association_depenses')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AssociationDepense;
  },

  async deleteDepense(id: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('association_depenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Statistiques
  async getStatistics(associationId: string) {
    const [membres, annonces, depenses] = await Promise.all([
      this.getMembers(associationId),
      this.getAnnonces(associationId),
      this.getDepenses(associationId)
    ]);

    const membresAJour = membres.filter(m => m.cotisation_a_jour).length;
    const totalCotisations = membres.reduce((sum, m) => sum + (m.montant_cotisation || 0), 0);
    const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);
    const depensesEnAttente = depenses.filter(d => !d.approuve).length;

    return {
      totalMembres: membres.length,
      membresAJour,
      membresEnRetard: membres.length - membresAJour,
      totalAnnonces: annonces.length,
      totalCotisations,
      totalDepenses,
      depensesEnAttente,
      solde: totalCotisations - totalDepenses
    };
  }
};
