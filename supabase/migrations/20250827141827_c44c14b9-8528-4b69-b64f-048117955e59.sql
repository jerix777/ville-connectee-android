-- Fix security issue: Restrict user profile access to owner only
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view basic profile info of all users" ON public.users_profiles;

-- Create a more secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile only" 
ON public.users_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Keep the existing policies for insert and update (they're already secure)
-- Users can insert their own profile: auth.uid() = user_id
-- Users can update their own profile: auth.uid() = user_id