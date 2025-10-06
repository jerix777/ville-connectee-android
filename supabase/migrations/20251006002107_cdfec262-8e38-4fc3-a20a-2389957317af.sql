-- Ajouter le champ geolocation_enabled à la table users_profiles
ALTER TABLE public.users_profiles 
ADD COLUMN IF NOT EXISTS geolocation_enabled BOOLEAN DEFAULT true;