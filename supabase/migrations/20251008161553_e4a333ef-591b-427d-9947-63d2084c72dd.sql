-- Créer la table service_rapide
CREATE TABLE public.service_rapide (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type_service TEXT NOT NULL CHECK (type_service IN ('public', 'prive')),
  nom_etablissement TEXT NOT NULL,
  contact1 TEXT NOT NULL,
  contact2 TEXT,
  logo_url TEXT,
  quartier_id UUID REFERENCES public.commune(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Activer RLS
ALTER TABLE public.service_rapide ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Public peut consulter les services rapides"
ON public.service_rapide
FOR SELECT
USING (true);

-- Politique d'insertion pour utilisateurs authentifiés
CREATE POLICY "Utilisateurs authentifiés peuvent ajouter des services"
ON public.service_rapide
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Politique de modification pour utilisateurs authentifiés (leurs propres services)
CREATE POLICY "Utilisateurs peuvent modifier leurs services"
ON public.service_rapide
FOR UPDATE
USING (auth.uid() = created_by);

-- Politique de suppression pour utilisateurs authentifiés (leurs propres services)
CREATE POLICY "Utilisateurs peuvent supprimer leurs services"
ON public.service_rapide
FOR DELETE
USING (auth.uid() = created_by);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_service_rapide_updated_at
BEFORE UPDATE ON public.service_rapide
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();