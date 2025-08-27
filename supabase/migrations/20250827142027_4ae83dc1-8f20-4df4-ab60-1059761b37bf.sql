-- Fix security issue: Restrict access to contact information to authenticated users only

-- Update marche table policies
DROP POLICY IF EXISTS "Public Select marche" ON public.marche;
DROP POLICY IF EXISTS "marche_select_policy" ON public.marche;

CREATE POLICY "Authenticated users can view marche listings" 
ON public.marche 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Update evenements table policies  
DROP POLICY IF EXISTS "Public Select evenements" ON public.evenements;

CREATE POLICY "Authenticated users can view events" 
ON public.evenements 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Update immobilier table policies
DROP POLICY IF EXISTS "Public Select immobilier" ON public.immobilier;
DROP POLICY IF EXISTS "immobilier_select_policy" ON public.immobilier;

CREATE POLICY "Authenticated users can view real estate listings" 
ON public.immobilier 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Update professionnels table policies
DROP POLICY IF EXISTS "Public can view all professionals" ON public.professionnels;

CREATE POLICY "Authenticated users can view professionals" 
ON public.professionnels 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Keep existing INSERT/UPDATE/DELETE policies as they are already properly secured