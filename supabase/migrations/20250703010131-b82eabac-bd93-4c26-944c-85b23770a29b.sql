-- Activer RLS et ajouter les politiques pour les tables qui n'en ont pas

-- Pour les immobiliers
ALTER TABLE public.immobilier ENABLE ROW LEVEL SECURITY;

CREATE POLICY "immobilier_select_policy" 
ON public.immobilier 
FOR SELECT 
USING (true);

CREATE POLICY "immobilier_insert_policy" 
ON public.immobilier 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "immobilier_update_policy" 
ON public.immobilier 
FOR UPDATE 
USING (true);

CREATE POLICY "immobilier_delete_policy" 
ON public.immobilier 
FOR DELETE 
USING (true);

-- Pour la nécrologie
ALTER TABLE public.necrologie ENABLE ROW LEVEL SECURITY;

CREATE POLICY "necrologie_select_policy" 
ON public.necrologie 
FOR SELECT 
USING (true);

CREATE POLICY "necrologie_insert_policy" 
ON public.necrologie 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "necrologie_update_policy" 
ON public.necrologie 
FOR UPDATE 
USING (true);

CREATE POLICY "necrologie_delete_policy" 
ON public.necrologie 
FOR DELETE 
USING (true);

-- Pour les services et commerces
ALTER TABLE public.services_commerces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "services_commerces_select_policy" 
ON public.services_commerces 
FOR SELECT 
USING (true);

CREATE POLICY "services_commerces_insert_policy" 
ON public.services_commerces 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "services_commerces_update_policy" 
ON public.services_commerces 
FOR UPDATE 
USING (true);

CREATE POLICY "services_commerces_delete_policy" 
ON public.services_commerces 
FOR DELETE 
USING (true);

-- Pour les souvenirs
ALTER TABLE public.souvenirs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "souvenirs_select_policy" 
ON public.souvenirs 
FOR SELECT 
USING (true);

CREATE POLICY "souvenirs_insert_policy" 
ON public.souvenirs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "souvenirs_update_policy" 
ON public.souvenirs 
FOR UPDATE 
USING (true);

CREATE POLICY "souvenirs_delete_policy" 
ON public.souvenirs 
FOR DELETE 
USING (true);

-- Pour les suggestions
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suggestions_select_policy" 
ON public.suggestions 
FOR SELECT 
USING (true);

CREATE POLICY "suggestions_insert_policy" 
ON public.suggestions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "suggestions_update_policy" 
ON public.suggestions 
FOR UPDATE 
USING (true);

CREATE POLICY "suggestions_delete_policy" 
ON public.suggestions 
FOR DELETE 
USING (true);

-- Pour la tribune
ALTER TABLE public.tribune ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tribune_select_policy" 
ON public.tribune 
FOR SELECT 
USING (true);

CREATE POLICY "tribune_insert_policy" 
ON public.tribune 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "tribune_update_policy" 
ON public.tribune 
FOR UPDATE 
USING (true);

CREATE POLICY "tribune_delete_policy" 
ON public.tribune 
FOR DELETE 
USING (true);

-- Pour les villages
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "villages_select_policy" 
ON public.villages 
FOR SELECT 
USING (true);

CREATE POLICY "villages_insert_policy" 
ON public.villages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "villages_update_policy" 
ON public.villages 
FOR UPDATE 
USING (true);

CREATE POLICY "villages_delete_policy" 
ON public.villages 
FOR DELETE 
USING (true);

-- Pour les quartiers
ALTER TABLE public.quartiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quartiers_select_policy" 
ON public.quartiers 
FOR SELECT 
USING (true);

CREATE POLICY "quartiers_insert_policy" 
ON public.quartiers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "quartiers_update_policy" 
ON public.quartiers 
FOR UPDATE 
USING (true);

CREATE POLICY "quartiers_delete_policy" 
ON public.quartiers 
FOR DELETE 
USING (true);

-- Pour les communes
ALTER TABLE public.commune ENABLE ROW LEVEL SECURITY;

CREATE POLICY "commune_select_policy" 
ON public.commune 
FOR SELECT 
USING (true);

CREATE POLICY "commune_insert_policy" 
ON public.commune 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "commune_update_policy" 
ON public.commune 
FOR UPDATE 
USING (true);

CREATE POLICY "commune_delete_policy" 
ON public.commune 
FOR DELETE 
USING (true);

-- Pour les préférences de commune
ALTER TABLE public.commune_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "commune_preferences_select_policy" 
ON public.commune_preferences 
FOR SELECT 
USING (true);

CREATE POLICY "commune_preferences_insert_policy" 
ON public.commune_preferences 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "commune_preferences_update_policy" 
ON public.commune_preferences 
FOR UPDATE 
USING (true);

CREATE POLICY "commune_preferences_delete_policy" 
ON public.commune_preferences 
FOR DELETE 
USING (true);