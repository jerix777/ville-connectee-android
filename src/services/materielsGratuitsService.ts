// src/services/materielsGratuitsService.ts
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type DemandeMateriel = {
  id: number;
  user_id: string;
  materiel_id: number;
  quantite: number;
  quantite_accordee: number | null;
  date_demande: string;
  date_validation: string | null;
  justification: string | null;
  reference: string;
  statut: "en_attente" | "approuvee" | "rejetee";
  valide_par: string | null;
  commentaires: string | null;
  contact1: string | null;
  contact2: string | null;
  nom_demandeur: string | null;
  date_debut_evenement: string | null;
  heure_debut_evenement: string | null;
  date_fin_evenement: string | null;
  heure_fin_evenement: string | null;
  lieu_evenement: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateDemandeMaterielDTO = Omit<
  DemandeMateriel,
  "id" | "created_at" | "updated_at" | "statut" | "quantite_accordee" | "date_validation" | "reference" | "valide_par" | "commentaires"
> & {
  contact1: string;
  contact2?: string;
  nom_demandeur: string;
  date_debut_evenement: string;
  heure_debut_evenement: string;
  date_fin_evenement: string;
  heure_fin_evenement: string;
  lieu_evenement: string;
  materiel_id: number;
};

const TABLE = "demandes_materiels";

export const materielsGratuitsService = {
  async getDemandes() {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false }) as { data: Database['public']['Tables']['demandes_materiels']['Row'][] | null; error: any };

    if (error) {
      console.error("Erreur Supabase :", error);
      throw error;
    }

    // console.log("Demandes récupérées :", data);
    return data as unknown as DemandeMateriel[];
  },

  async addDemande(demande: CreateDemandeMaterielDTO) {
    const now = new Date().toISOString();
    const reference = `DEM-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    const { data, error } = await supabase
      .from(TABLE)
      .insert([
        {
          ...demande,
          statut: "en_attente",
          reference,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single() as { data: Database['public']['Tables']['demandes_materiels']['Row'] | null; error: any };

    if (error) throw error;
    return data as unknown as DemandeMateriel;
  },

  async updateStatut(id: number, statut: "approuvee" | "rejetee", valide_par: string, commentaires?: string) {
    const { error } = await supabase
      .from(TABLE)
      .update({
        statut,
        valide_par,
        commentaires,
        date_validation: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id) as { error: any };
    if (error) throw error;
  },
};
