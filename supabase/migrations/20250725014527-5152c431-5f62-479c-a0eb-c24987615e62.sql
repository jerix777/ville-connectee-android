-- Enable RLS on tables that don't have it
ALTER TABLE public.catalogue_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxi_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxi_bookings ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for catalogue_categories
CREATE POLICY "Public can view categories" ON public.catalogue_categories
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create categories" ON public.catalogue_categories
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" ON public.catalogue_categories
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete categories" ON public.catalogue_categories
FOR DELETE TO authenticated USING (true);

-- Add RLS policies for catalogue_items
CREATE POLICY "Public can view items" ON public.catalogue_items
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create items" ON public.catalogue_items
FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own items" ON public.catalogue_items
FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own items" ON public.catalogue_items
FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Add RLS policies for taxi_drivers
CREATE POLICY "Public can view available drivers" ON public.taxi_drivers
FOR SELECT USING (is_available = true);

CREATE POLICY "Users can create their own driver profile" ON public.taxi_drivers
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own driver profile" ON public.taxi_drivers
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own driver profile" ON public.taxi_drivers
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add RLS policies for taxi_bookings
CREATE POLICY "Users can view their own bookings" ON public.taxi_bookings
FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = driver_id);

CREATE POLICY "Users can create their own bookings" ON public.taxi_bookings
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.taxi_bookings
FOR UPDATE TO authenticated USING (auth.uid() = user_id OR auth.uid() = driver_id);

CREATE POLICY "Users can delete their own bookings" ON public.taxi_bookings
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix database functions security by adding SET search_path = ''
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.conversations 
  SET updated_at = now(), last_message_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.link_professional_to_user(professional_id uuid, user_email text, user_phone text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role_type)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS user_role_type
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$function$;

CREATE OR REPLACE FUNCTION public.request_professional_verification(professional_id uuid, method text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  professional_record record;
  verification_code text;
BEGIN
  -- Vérifier que l'utilisateur peut modifier ce profil
  SELECT * INTO professional_record
  FROM public.professionnels
  WHERE id = professional_id AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Professionnel non trouvé ou accès non autorisé');
  END IF;
  
  -- Générer un code de vérification (6 chiffres)
  verification_code := lpad((random() * 999999)::int::text, 6, '0');
  
  -- Stocker le code temporairement (vous pourriez créer une table séparée pour cela)
  UPDATE public.professionnels 
  SET verification_method = method
  WHERE id = professional_id;
  
  -- Retourner le code (en production, l'envoyer par email/SMS)
  RETURN json_build_object(
    'success', true, 
    'verification_code', verification_code,
    'method', method
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_professional(professional_id uuid, verification_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  professional_record record;
BEGIN
  -- Vérifier que l'utilisateur peut modifier ce profil
  SELECT * INTO professional_record
  FROM public.professionnels
  WHERE id = professional_id AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Professionnel non trouvé ou accès non autorisé');
  END IF;
  
  -- En production, vérifier le code contre celui stocké/envoyé
  -- Pour l'instant, on accepte tout code de 6 chiffres
  IF length(verification_code) = 6 AND verification_code ~ '^[0-9]+$' THEN
    UPDATE public.professionnels 
    SET is_verified = true
    WHERE id = professional_id;
    
    RETURN json_build_object('success', true, 'message', 'Professionnel vérifié avec succès');
  ELSE
    RETURN json_build_object('error', 'Code de vérification invalide');
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;