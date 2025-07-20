-- Créer les profils manquants pour les utilisateurs existants
INSERT INTO public.users_profiles (user_id, commune_id)
SELECT 
  au.id as user_id,
  NULL as commune_id
FROM auth.users au
LEFT JOIN public.users_profiles up ON au.id = up.user_id
WHERE up.user_id IS NULL;

-- Créer les rôles manquants pour les utilisateurs existants
INSERT INTO public.user_roles (user_id, role)
SELECT 
  au.id as user_id,
  'administre'::user_role_type as role
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE ur.user_id IS NULL;