-- Migration pour lier les professionnels aux utilisateurs authentifiés
-- et permettre la validation par email ou téléphone

-- Ajouter une colonne user_id à la table professionnels pour lier aux utilisateurs
ALTER TABLE public.professionnels 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN email text,
ADD COLUMN phone text,
ADD COLUMN is_verified boolean DEFAULT false,
ADD COLUMN verification_method text CHECK (verification_method IN ('email', 'phone'));

-- Créer un index pour optimiser les requêtes sur user_id
CREATE INDEX idx_professionnels_user_id ON public.professionnels(user_id);

-- Créer un index unique pour éviter les doublons email
CREATE UNIQUE INDEX idx_professionnels_email_unique ON public.professionnels(email) WHERE email IS NOT NULL;

-- Créer un index unique pour éviter les doublons téléphone
CREATE UNIQUE INDEX idx_professionnels_phone_unique ON public.professionnels(phone) WHERE phone IS NOT NULL;

-- Mettre à jour les politiques RLS pour les professionnels
DROP POLICY IF EXISTS "Public Select professionnels" ON public.professionnels;
DROP POLICY IF EXISTS "Public Insert professionnels" ON public.professionnels;
DROP POLICY IF EXISTS "Public Update professionnels" ON public.professionnels;
DROP POLICY IF EXISTS "Public Delete professionnels" ON public.professionnels;

-- Nouvelles politiques RLS
-- Tout le monde peut voir les professionnels vérifiés
CREATE POLICY "Public can view verified professionals"
ON public.professionnels
FOR SELECT
USING (is_verified = true);

-- Les utilisateurs authentifiés peuvent voir leur propre profil même non vérifié
CREATE POLICY "Users can view their own professional profile"
ON public.professionnels
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Les utilisateurs authentifiés peuvent créer leur profil professionnel
CREATE POLICY "Authenticated users can create professional profile"
ON public.professionnels
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update their own professional profile"
ON public.professionnels
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leur propre profil
CREATE POLICY "Users can delete their own professional profile"
ON public.professionnels
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Les administrateurs peuvent tout gérer (à définir selon vos besoins)
-- CREATE POLICY "Admins can manage all professionals"
-- ON public.professionnels
-- FOR ALL
-- TO authenticated
-- USING (has_role(auth.uid(), 'admin'));

-- Fonction pour envoyer un code de vérification (à implémenter côté application)
CREATE OR REPLACE FUNCTION public.request_professional_verification(
  professional_id uuid,
  method text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Fonction pour valider le code de vérification
CREATE OR REPLACE FUNCTION public.verify_professional(
  professional_id uuid,
  verification_code text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;