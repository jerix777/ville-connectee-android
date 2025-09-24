-- Enable RLS on the taxi_drivers table
ALTER TABLE public.taxi_drivers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
CREATE POLICY "Allow public read access"
ON public.taxi_drivers
FOR SELECT
USING (true);

-- Allow anonymous users to insert a new driver only if the taxi module is public
CREATE POLICY "Allow anonymous insert if module is public"
ON public.taxi_drivers
FOR INSERT
TO anon
WITH CHECK (
  (SELECT is_public FROM public.module_visibility WHERE id = 'taxi')
);

-- Allow any authenticated user to insert a new driver
CREATE POLICY "Allow insert for authenticated users"
ON public.taxi_drivers
FOR INSERT
TO authenticated
WITH CHECK (true);

-- For now, let's allow authenticated users to update and delete their own records if we add a user_id back in the future.
-- For now, let's just allow any authenticated user to update/delete.
CREATE POLICY "Allow update for authenticated users"
ON public.taxi_drivers
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete for authenticated users"
ON public.taxi_drivers
FOR DELETE
TO authenticated
USING (true);
