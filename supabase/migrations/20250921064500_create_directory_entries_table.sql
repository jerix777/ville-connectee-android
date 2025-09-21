-- Drop table if it exists to start fresh
DROP TABLE IF EXISTS public.directory_entries CASCADE;

CREATE TABLE public.directory_entries (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    service_type text NOT NULL,
    address text NULL,
    phone1 text NULL,
    phone2 text NULL,
    email text NULL,
    village_id uuid NULL,
    user_id uuid NULL DEFAULT auth.uid(),
    CONSTRAINT directory_entries_pkey PRIMARY KEY (id),
    CONSTRAINT directory_entries_village_id_fkey FOREIGN KEY (village_id) REFERENCES public.villages(id),
    CONSTRAINT directory_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

ALTER TABLE public.directory_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.directory_entries
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for all users" ON public.directory_entries
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for owners" ON public.directory_entries
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for owners" ON public.directory_entries
AS PERMISSIVE FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
