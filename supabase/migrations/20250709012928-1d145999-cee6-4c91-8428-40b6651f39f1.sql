-- Vérifier et ajouter les colonnes qui n'existent pas encore
DO $$ 
BEGIN
    -- Vérifier et ajouter date_naissance si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users_profiles' AND column_name = 'date_naissance') THEN
        ALTER TABLE public.users_profiles ADD COLUMN date_naissance DATE;
    END IF;
    
    -- Vérifier et ajouter lieu_naissance si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users_profiles' AND column_name = 'lieu_naissance') THEN
        ALTER TABLE public.users_profiles ADD COLUMN lieu_naissance TEXT;
    END IF;
    
    -- Vérifier et ajouter lieu_residence si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users_profiles' AND column_name = 'lieu_residence') THEN
        ALTER TABLE public.users_profiles ADD COLUMN lieu_residence TEXT;
    END IF;
    
    -- Vérifier et ajouter contact_telephone si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users_profiles' AND column_name = 'contact_telephone') THEN
        ALTER TABLE public.users_profiles ADD COLUMN contact_telephone TEXT;
    END IF;
    
    -- Vérifier et ajouter village_origine_id si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users_profiles' AND column_name = 'village_origine_id') THEN
        ALTER TABLE public.users_profiles ADD COLUMN village_origine_id UUID;
    END IF;
END $$;

-- Ajouter la contrainte de clé étrangère pour le village d'origine si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_village_origine') THEN
        ALTER TABLE public.users_profiles 
        ADD CONSTRAINT fk_village_origine 
        FOREIGN KEY (village_origine_id) REFERENCES public.villages(id);
    END IF;
END $$;

-- Créer la table autorite_zones si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.autorite_zones (
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

-- Créer les politiques RLS pour autorite_zones si elles n'existent pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own authority zones' AND tablename = 'autorite_zones') THEN
        CREATE POLICY "Users can view their own authority zones"
        ON public.autorite_zones
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own authority zones' AND tablename = 'autorite_zones') THEN
        CREATE POLICY "Users can insert their own authority zones"
        ON public.autorite_zones
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own authority zones' AND tablename = 'autorite_zones') THEN
        CREATE POLICY "Users can update their own authority zones"
        ON public.autorite_zones
        FOR UPDATE
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own authority zones' AND tablename = 'autorite_zones') THEN
        CREATE POLICY "Users can delete their own authority zones"
        ON public.autorite_zones
        FOR DELETE
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Créer la table professionnel_competences si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.professionnel_competences (
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

-- Créer les politiques RLS pour professionnel_competences si elles n'existent pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own professional competences' AND tablename = 'professionnel_competences') THEN
        CREATE POLICY "Users can view their own professional competences"
        ON public.professionnel_competences
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own professional competences' AND tablename = 'professionnel_competences') THEN
        CREATE POLICY "Users can insert their own professional competences"
        ON public.professionnel_competences
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own professional competences' AND tablename = 'professionnel_competences') THEN
        CREATE POLICY "Users can update their own professional competences"
        ON public.professionnel_competences
        FOR UPDATE
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own professional competences' AND tablename = 'professionnel_competences') THEN
        CREATE POLICY "Users can delete their own professional competences"
        ON public.professionnel_competences
        FOR DELETE
        USING (auth.uid() = user_id);
    END IF;
END $$;