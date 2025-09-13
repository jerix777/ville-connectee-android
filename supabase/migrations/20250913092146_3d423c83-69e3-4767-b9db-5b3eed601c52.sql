-- Create storage bucket for stations
INSERT INTO storage.buckets (id, name, public) VALUES ('stations', 'stations', true);

-- Create policies for station image uploads
CREATE POLICY "Station images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'stations');

CREATE POLICY "Authenticated users can upload station images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'stations' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update station images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'stations' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete station images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'stations' AND auth.role() = 'authenticated');