-- Add missing services column to restaurants_buvettes table
ALTER TABLE public.restaurants_buvettes 
ADD COLUMN services text[] DEFAULT '{}';

-- Create storage bucket for restaurants images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('restaurants', 'restaurants', true);

-- Create storage policies for restaurants bucket
CREATE POLICY "Restaurant images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'restaurants');

CREATE POLICY "Authenticated users can upload restaurant images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'restaurants' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update restaurant images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'restaurants' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete restaurant images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'restaurants' AND auth.role() = 'authenticated');