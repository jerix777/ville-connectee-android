import { supabase } from "@/integrations/supabase/client";

export type RegimeType = 'public' | 'mutuelle' | 'indigent' | 'cmuc';

export type Medicament = {
  id: string;
  nom: string;
  dci?: string | null;
  forme: string;
  dosage?: string | null;
  prix_public: number;
  prix_mutuelle?: number | null;
  prix_indigent?: number | null;
  prix_cmuc?: number | null;
  laboratoire?: string | null;
  disponible?: boolean;
  prescription_requise?: boolean;
  description?: string | null;
  code_produit?: string | null;
  groupe_therapeutique?: string | null;
  categorie?: string | null;
  regime?: string | null;
  type_medicament?: string | null;
  created_at: string;
  updated_at: string;
};

export type MedicamentPanier = Medicament & {
  quantite: number;
};

export const medicamentService = {
  async searchMedicaments(query: string): Promise<Medicament[]> {
    const { data, error } = await supabase
      .from('medicament')
      .select('*')
      .or(`nom.ilike.%${query}%,dci.ilike.%${query}%`)
      .eq('disponible', true)
      .order('nom');

    if (error) throw error;
    return data as Medicament[];
  },

  async getAllMedicaments(): Promise<Medicament[]> {
    const { data, error } = await supabase
      .from('medicament')
      .select('*')
      .eq('disponible', true)
      .order('nom');

    if (error) throw error;
    return data as Medicament[];
  },

  getPrixByRegime(medicament: Medicament, regime: RegimeType): number {
    switch (regime) {
      case 'mutuelle':
        return medicament.prix_mutuelle || medicament.prix_public;
      case 'indigent':
        return medicament.prix_indigent || medicament.prix_public;
      case 'cmuc':
        return medicament.prix_cmuc || medicament.prix_public;
      default:
        return medicament.prix_public;
    }
  },

  calculerTotal(panier: MedicamentPanier[], regime: RegimeType): number {
    return panier.reduce((total, item) => {
      const prix = this.getPrixByRegime(item, regime);
      return total + (prix * item.quantite);
    }, 0);
  }
};
