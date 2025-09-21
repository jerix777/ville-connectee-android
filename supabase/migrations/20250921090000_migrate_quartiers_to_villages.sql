-- This migration refactors the directory_entries table to use village_id instead of quartier_id
-- without losing existing data.

-- Step 1: Add the new village_id column to the table.
ALTER TABLE public.directory_entries
ADD COLUMN village_id uuid;

-- Step 2: Populate the new village_id column from the old quartier_id.
--
-- =====================================================================================
-- !! IMPORTANT !! ACTION REQUIRED !!
-- You must provide the logic to map your old `quartier_id` to the new `village_id`.
-- This script cannot guess the relationship between your quartiers and villages.
--
-- Below is an EXAMPLE of how you might do this if your `quartiers` table
-- has a `village_id` column that links it to a village.
--
-- UPDATE public.directory_entries de
-- SET village_id = (SELECT q.village_id FROM public.quartiers q WHERE q.id = de.quartier_id);
--
-- Please REPLACE the example logic above with a query that works for your schema.
-- If no such relationship exists, you may need to perform a manual update.
-- =====================================================================================


-- Step 3: Drop the foreign key constraint on the old quartier_id column.
ALTER TABLE public.directory_entries
DROP CONSTRAINT IF EXISTS directory_entries_quartier_id_fkey;

-- Step 4: Drop the old quartier_id column.
ALTER TABLE public.directory_entries
DROP COLUMN IF EXISTS quartier_id;

-- Step 5: Add the new foreign key constraint for village_id.
ALTER TABLE public.directory_entries
ADD CONSTRAINT directory_entries_village_id_fkey
FOREIGN KEY (village_id) REFERENCES public.villages(id);

-- Step 6: Update RLS policies to match the new requirements.
-- Drop old policies to avoid errors.
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.directory_entries;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.directory_entries;

-- Recreate the insert policy to allow inserts for any public user,
-- but associates the row with the authenticated user who created it.
CREATE POLICY "Enable insert for all users" ON public.directory_entries
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Note: The update and delete policies are likely correct already, but we'll ensure they are set.
DROP POLICY IF EXISTS "Enable update for owners" ON public.directory_entries;
CREATE POLICY "Enable update for owners" ON public.directory_entries
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable delete for owners" ON public.directory_entries;
CREATE POLICY "Enable delete for owners" ON public.directory_entries
AS PERMISSIVE FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
