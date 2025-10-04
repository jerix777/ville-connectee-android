-- Créer ou recréer la table taxi_drivers avec le bon schéma
DROP TABLE IF EXISTS public.taxi_drivers CASCADE;

CREATE TABLE public.taxi_drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact1 TEXT NOT NULL,
  contact2 TEXT,
  vehicle_type TEXT NOT NULL,
  description TEXT,
  village_id UUID REFERENCES public.villages(id),
  is_available BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.taxi_drivers ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Public can view available taxi drivers"
  ON public.taxi_drivers
  FOR SELECT
  USING (is_available = true);

CREATE POLICY "Authenticated users can create taxi drivers"
  ON public.taxi_drivers
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update taxi drivers"
  ON public.taxi_drivers
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete taxi drivers"
  ON public.taxi_drivers
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_taxi_drivers_updated_at
  BEFORE UPDATE ON public.taxi_drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();