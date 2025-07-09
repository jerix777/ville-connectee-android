-- Étendre la table users_profiles avec les nouveaux champs obligatoires
ALTER TABLE public.users_profiles ADD COLUMN date_naissance DATE;
ALTER TABLE public.users_profiles ADD COLUMN lieu_naissance TEXT;
ALTER TABLE public.users_profiles ADD COLUMN lieu_residence TEXT;
ALTER TABLE public.users_profiles ADD COLUMN contact_telephone TEXT;
ALTER TABLE public.users_profiles ADD COLUMN village_origine_id UUID;

-- Ajouter la contrainte de clé étrangère pour le village d'origine
ALTER TABLE public.users_profiles 
ADD CONSTRAINT fk_village_origine 
FOREIGN KEY (village_origine_id) REFERENCES public.villages(id);

-- Créer une table pour les zones d'influence des autorités
CREATE TABLE public.autorite_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  zone_type TEXT NOT NULL, -- 'commune', 'village', 'quartier', 'regroupement'
  zone_id UUID, -- ID de la zone (commune_id, village_id, quartier_id selon le type)
  zone_nom TEXT NOT NULL, -- Nom de la zone d'influence
  description TEXT, -- Description complémentaire de la zone
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, zone_type, zone_id)
);

-- Activer RLS sur autorite_zones
ALTER TABLE public.autorite_zones ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour autorite_zones
CREATE POLICY "Users can view their own authority zones"
ON public.autorite_zones
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own authority zones"
ON public.autorite_zones
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own authority zones"
ON public.autorite_zones
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own authority zones"
ON public.autorite_zones
FOR DELETE
USING (auth.uid() = user_id);

-- Créer une table pour les domaines de compétence des professionnels
CREATE TABLE public.professionnel_competences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domaine_competence TEXT NOT NULL,
  niveau_competence TEXT, -- 'débutant', 'intermédiaire', 'expert', 'maître'
  certifications TEXT[], -- Tableau des certifications
  experience_annees INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur professionnel_competences
ALTER TABLE public.professionnel_competences ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour professionnel_competences
CREATE POLICY "Users can view their own professional competences"
ON public.professionnel_competences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own professional competences"
ON public.professionnel_competences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own professional competences"
ON public.professionnel_competences
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own professional competences"
ON public.professionnel_competences
FOR DELETE
USING (auth.uid() = user_id);

-- Mettre à jour la fonction handle_new_user pour gérer les nouveaux champs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Créer le profil utilisateur (les champs supplémentaires seront mis à jour par le formulaire)
  INSERT INTO public.users_profiles (user_id, commune_id)
  VALUES (NEW.id, NULL);
  
  -- Créer un rôle par défaut (administré)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'administre');
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log l'erreur mais ne pas bloquer l'inscription
    RAISE LOG 'Erreur lors de la création du profil/rôle utilisateur: %', SQLERRM;
    RETURN NEW;
END;
$$;