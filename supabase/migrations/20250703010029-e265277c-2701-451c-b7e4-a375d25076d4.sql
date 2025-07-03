-- Ajouter seulement les politiques INSERT/UPDATE/DELETE manquantes

-- Pour les événements (a déjà SELECT, manque INSERT/UPDATE/DELETE)
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

-- Pour les types d'événements (a déjà SELECT, manque INSERT/UPDATE/DELETE)
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

-- Pour les métiers (a déjà SELECT, manque INSERT/UPDATE/DELETE)
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

-- Pour les professionnels (a déjà SELECT, manque INSERT/UPDATE/DELETE)
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

-- Pour les associations (a déjà SELECT, manque INSERT/UPDATE/DELETE)
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