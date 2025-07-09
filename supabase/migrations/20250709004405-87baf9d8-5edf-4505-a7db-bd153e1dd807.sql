-- Amélioration du système de liaison entre profils professionnels et utilisateurs
-- Permet aux professionnels de l'annuaire de créer des comptes pour s'authentifier

-- Ajout d'une politique pour permettre l'insertion de profils utilisateurs
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users_profiles;

CREATE POLICY "Users can insert their own profile"
ON public.users_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fonction pour créer automatiquement un profil utilisateur lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users_profiles (user_id, commune_id)
  VALUES (NEW.id, NULL);
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log l'erreur mais ne pas bloquer l'inscription
    RAISE LOG 'Erreur lors de la création du profil utilisateur: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger pour créer automatiquement un profil utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour lier un professionnel existant à un utilisateur authentifié
CREATE OR REPLACE FUNCTION public.link_professional_to_user(
  professional_id uuid,
  user_email text,
  user_phone text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  professional_record record;
BEGIN
  -- Récupérer l'ID de l'utilisateur connecté
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('error', 'Utilisateur non authentifié');
  END IF;
  
  -- Vérifier que le professionnel existe et n'est pas déjà lié
  SELECT * INTO professional_record
  FROM public.professionnels
  WHERE id = professional_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Professionnel non trouvé');
  END IF;
  
  IF professional_record.user_id IS NOT NULL THEN
    RETURN json_build_object('error', 'Ce professionnel est déjà lié à un compte utilisateur');
  END IF;
  
  -- Mettre à jour le professionnel avec les informations utilisateur
  UPDATE public.professionnels 
  SET 
    user_id = current_user_id,
    email = user_email,
    phone = COALESCE(user_phone, phone)
  WHERE id = professional_id;
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Professionnel lié avec succès au compte utilisateur'
  );
END;
$$;

-- Améliorer les politiques pour l'annuaire
-- Les professionnels non vérifiés peuvent être vus par tous (pour permettre la liaison)
DROP POLICY IF EXISTS "Public can view verified professionals" ON public.professionnels;
DROP POLICY IF EXISTS "Users can view their own professional profile" ON public.professionnels;

CREATE POLICY "Public can view all professionals"
ON public.professionnels
FOR SELECT
USING (true);

-- Les utilisateurs peuvent maintenant voir tous les professionnels
-- mais ne peuvent modifier que leur propre profil