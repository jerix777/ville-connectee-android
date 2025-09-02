-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for radio stations
CREATE TABLE public.radios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  flux_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.radios ENABLE ROW LEVEL SECURITY;

-- Public can view active radios
CREATE POLICY "Public can view active radios" 
ON public.radios 
FOR SELECT 
USING (is_active = true);

-- Only administrative authorities can manage radios
CREATE POLICY "Administrative authorities can manage radios" 
ON public.radios 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'autorite_administrative'::user_role_type
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_radios_updated_at
BEFORE UPDATE ON public.radios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();