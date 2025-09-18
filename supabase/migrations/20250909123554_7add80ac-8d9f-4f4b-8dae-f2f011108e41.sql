-- Créer la table pour les stations de carburant et gaz
CREATE TABLE public.stations_carburant (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom text NOT NULL,
  type text NOT NULL, -- 'station-service', 'depot-gaz', 'station-mixte'
  adresse text NOT NULL,
  telephone text,
  email text,
  horaires text,
  services text[], -- 'essence', 'gasoil', 'gaz-butane', 'lavage', 'mecanique'
  prix_essence numeric,
  prix_gasoil numeric,
  prix_gaz numeric,
  latitude numeric,
  longitude numeric,
  quartier_id uuid,
  image_url text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.stations_carburant ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Public can view stations carburant"
ON public.stations_carburant
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create stations carburant"
ON public.stations_carburant
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update stations carburant"
ON public.stations_carburant
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete stations carburant"
ON public.stations_carburant
FOR DELETE
USING (auth.role() = 'authenticated');

-- Trigger pour updated_at
CREATE TRIGGER update_stations_carburant_updated_at
BEFORE UPDATE ON public.stations_carburant
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();