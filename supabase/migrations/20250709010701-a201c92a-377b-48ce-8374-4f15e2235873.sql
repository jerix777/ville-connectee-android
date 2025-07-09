-- Création d'un enum pour les rôles d'utilisateurs
CREATE TYPE public.user_role_type AS ENUM (
  'autorite_administrative',
  'autorite_villageoise', 
  'administre'
);

-- Création de la table des rôles utilisateur
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role_type NOT NULL DEFAULT 'administre',
  sub_role TEXT, -- Pour spécifier le sous-rôle (ex: "maire", "chef_village", "professionnel")
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Activer RLS sur la table user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role on signup"
ON public.user_roles  
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Fonction security definer pour vérifier les rôles (évite la récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role_type)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fonction pour obtenir le rôle d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role_type
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Mise à jour de la fonction handle_new_user pour créer un rôle par défaut
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Créer le profil utilisateur
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