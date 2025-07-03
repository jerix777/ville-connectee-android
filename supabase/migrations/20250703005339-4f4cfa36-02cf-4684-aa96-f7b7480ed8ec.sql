-- Ajouter les politiques RLS manquantes pour les événements
CREATE POLICY "Public Insert evenements" 
ON public.evenements 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update evenements" 
ON public.evenements 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete evenements" 
ON public.evenements 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les types d'événements (pour pouvoir les gérer)
CREATE POLICY "Public Insert event_types" 
ON public.event_types 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update event_types" 
ON public.event_types 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete event_types" 
ON public.event_types 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les métiers
CREATE POLICY "Public Insert metiers" 
ON public.metiers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update metiers" 
ON public.metiers 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete metiers" 
ON public.metiers 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les professionnels
CREATE POLICY "Public Insert professionnels" 
ON public.professionnels 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update professionnels" 
ON public.professionnels 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete professionnels" 
ON public.professionnels 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les associations
CREATE POLICY "Public Insert associations" 
ON public.associations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update associations" 
ON public.associations 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete associations" 
ON public.associations 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les immobiliers
ALTER TABLE public.immobilier ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select immobilier" 
ON public.immobilier 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert immobilier" 
ON public.immobilier 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update immobilier" 
ON public.immobilier 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete immobilier" 
ON public.immobilier 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour la nécrologie
ALTER TABLE public.necrologie ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select necrologie" 
ON public.necrologie 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert necrologie" 
ON public.necrologie 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update necrologie" 
ON public.necrologie 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete necrologie" 
ON public.necrologie 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les services et commerces
ALTER TABLE public.services_commerces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select services_commerces" 
ON public.services_commerces 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert services_commerces" 
ON public.services_commerces 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update services_commerces" 
ON public.services_commerces 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete services_commerces" 
ON public.services_commerces 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les souvenirs
ALTER TABLE public.souvenirs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select souvenirs" 
ON public.souvenirs 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert souvenirs" 
ON public.souvenirs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update souvenirs" 
ON public.souvenirs 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete souvenirs" 
ON public.souvenirs 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les suggestions
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select suggestions" 
ON public.suggestions 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert suggestions" 
ON public.suggestions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update suggestions" 
ON public.suggestions 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete suggestions" 
ON public.suggestions 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour la tribune
ALTER TABLE public.tribune ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select tribune" 
ON public.tribune 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert tribune" 
ON public.tribune 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update tribune" 
ON public.tribune 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete tribune" 
ON public.tribune 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les villages
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select villages" 
ON public.villages 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert villages" 
ON public.villages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update villages" 
ON public.villages 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete villages" 
ON public.villages 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les quartiers
ALTER TABLE public.quartiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select quartiers" 
ON public.quartiers 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert quartiers" 
ON public.quartiers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update quartiers" 
ON public.quartiers 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete quartiers" 
ON public.quartiers 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les communes
ALTER TABLE public.commune ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select commune" 
ON public.commune 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert commune" 
ON public.commune 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update commune" 
ON public.commune 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete commune" 
ON public.commune 
FOR DELETE 
USING (true);

-- Ajouter les politiques RLS manquantes pour les préférences de commune
ALTER TABLE public.commune_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select commune_preferences" 
ON public.commune_preferences 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert commune_preferences" 
ON public.commune_preferences 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update commune_preferences" 
ON public.commune_preferences 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete commune_preferences" 
ON public.commune_preferences 
FOR DELETE 
USING (true);