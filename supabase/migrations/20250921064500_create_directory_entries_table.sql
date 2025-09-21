CREATE TABLE public.directory_entries (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    service_type text NOT NULL,
    name text NOT NULL,
    contact_1 text,
    contact_2 text,
    postal_box text,
    email text,
    CONSTRAINT directory_entries_pkey PRIMARY KEY (id)
);

ALTER TABLE public.directory_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.directory_entries
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.directory_entries
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.directory_entries
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON public.directory_entries
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);
