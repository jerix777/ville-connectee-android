-- Étendre la table associations existante
ALTER TABLE public.associations 
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS nombre_membres integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS responsable_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS statut text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS date_creation date DEFAULT CURRENT_DATE;

-- Table des membres d'associations
CREATE TABLE IF NOT EXISTS public.association_membres (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  association_id uuid NOT NULL REFERENCES public.associations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  nom text NOT NULL,
  prenom text NOT NULL,
  email text NOT NULL,
  telephone text,
  role text NOT NULL DEFAULT 'membre',
  date_adhesion date DEFAULT CURRENT_DATE,
  date_arrivee date,
  cotisation_a_jour boolean DEFAULT false,
  dernier_paiement date,
  montant_cotisation numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table des annonces d'associations
CREATE TABLE IF NOT EXISTS public.association_annonces (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  association_id uuid NOT NULL REFERENCES public.associations(id) ON DELETE CASCADE,
  titre text NOT NULL,
  contenu text NOT NULL,
  auteur_id uuid NOT NULL REFERENCES auth.users(id),
  priorite text DEFAULT 'normale',
  visible_jusqu date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table des dépenses d'associations
CREATE TABLE IF NOT EXISTS public.association_depenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  association_id uuid NOT NULL REFERENCES public.associations(id) ON DELETE CASCADE,
  description text NOT NULL,
  montant numeric NOT NULL,
  categorie text NOT NULL,
  responsable_id uuid NOT NULL REFERENCES auth.users(id),
  justificatif_url text,
  date_depense date DEFAULT CURRENT_DATE,
  approuve boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.association_membres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.association_annonces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.association_depenses ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour association_membres
CREATE POLICY "Les responsables peuvent gérer les membres" ON public.association_membres
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.associations a 
    WHERE a.id = association_membres.association_id 
    AND a.responsable_id = auth.uid()
  )
);

CREATE POLICY "Les membres peuvent voir les autres membres" ON public.association_membres
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.association_membres am 
    WHERE am.association_id = association_membres.association_id 
    AND am.user_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM public.associations a 
    WHERE a.id = association_membres.association_id 
    AND a.responsable_id = auth.uid()
  )
);

-- Politiques RLS pour association_annonces  
CREATE POLICY "Les responsables peuvent gérer les annonces" ON public.association_annonces
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.associations a 
    WHERE a.id = association_annonces.association_id 
    AND a.responsable_id = auth.uid()
  )
);

CREATE POLICY "Les membres peuvent voir les annonces" ON public.association_annonces
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.association_membres am 
    WHERE am.association_id = association_annonces.association_id 
    AND am.user_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM public.associations a 
    WHERE a.id = association_annonces.association_id 
    AND a.responsable_id = auth.uid()
  )
);

-- Politiques RLS pour association_depenses
CREATE POLICY "Les responsables peuvent gérer les dépenses" ON public.association_depenses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.associations a 
    WHERE a.id = association_depenses.association_id 
    AND a.responsable_id = auth.uid()
  )
);

CREATE POLICY "Les membres peuvent voir les dépenses" ON public.association_depenses
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.association_membres am 
    WHERE am.association_id = association_depenses.association_id 
    AND am.user_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM public.associations a 
    WHERE a.id = association_depenses.association_id 
    AND a.responsable_id = auth.uid()
  )
);

-- Fonction pour mettre à jour le nombre de membres
CREATE OR REPLACE FUNCTION update_association_membre_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.associations 
    SET nombre_membres = (
      SELECT COUNT(*) FROM public.association_membres 
      WHERE association_id = NEW.association_id
    )
    WHERE id = NEW.association_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.associations 
    SET nombre_membres = (
      SELECT COUNT(*) FROM public.association_membres 
      WHERE association_id = OLD.association_id
    )
    WHERE id = OLD.association_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le nombre de membres
CREATE TRIGGER trigger_update_membre_count
AFTER INSERT OR DELETE ON public.association_membres
FOR EACH ROW EXECUTE FUNCTION update_association_membre_count();