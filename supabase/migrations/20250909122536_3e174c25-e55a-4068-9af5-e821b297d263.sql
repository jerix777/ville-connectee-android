-- Create restaurants_buvettes table
CREATE TABLE public.restaurants_buvettes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('restaurant', 'buvette', 'maquis')),
  description TEXT,
  adresse TEXT NOT NULL,
  telephone TEXT,
  email TEXT,
  horaires TEXT,
  prix_moyen NUMERIC,
  specialites TEXT[],
  image_url TEXT,
  quartier_id UUID,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurants_buvettes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view restaurants and buvettes" 
ON public.restaurants_buvettes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create restaurants and buvettes" 
ON public.restaurants_buvettes 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can update restaurants and buvettes" 
ON public.restaurants_buvettes 
FOR UPDATE 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can delete restaurants and buvettes" 
ON public.restaurants_buvettes 
FOR DELETE 
USING (auth.role() = 'authenticated'::text);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_restaurants_buvettes_updated_at
BEFORE UPDATE ON public.restaurants_buvettes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();