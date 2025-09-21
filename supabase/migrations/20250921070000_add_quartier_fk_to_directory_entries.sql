ALTER TABLE public.directory_entries
ADD COLUMN quartier_id uuid REFERENCES public.quartiers(id);
