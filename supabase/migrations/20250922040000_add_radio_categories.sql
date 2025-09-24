-- Create the radio_categories table
CREATE TABLE public.radio_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  CONSTRAINT radio_categories_pkey PRIMARY KEY (id)
);

-- Add a category_id column to the radios table
ALTER TABLE public.radios
ADD COLUMN category_id UUID,
ADD CONSTRAINT radios_category_id_fkey
FOREIGN KEY (category_id) REFERENCES public.radio_categories(id);

-- Insert some default categories
INSERT INTO public.radio_categories (name) VALUES
('Actualités'),
('Musique'),
('Sport'),
('Culture'),
('Religion');
