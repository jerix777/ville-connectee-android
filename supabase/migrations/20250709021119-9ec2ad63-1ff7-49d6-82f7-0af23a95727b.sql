-- Mettre à jour la politique RLS pour permettre aux utilisateurs de voir les noms des autres
-- Supprimer l'ancienne politique restrictive
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users_profiles;

-- Créer une nouvelle politique qui permet de voir les noms de tous les utilisateurs
CREATE POLICY "Users can view basic profile info of all users" 
ON public.users_profiles 
FOR SELECT 
TO authenticated
USING (true);