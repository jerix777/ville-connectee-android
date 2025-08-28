-- Phase 1: Critical Data Protection - Secure sensitive contact information

-- 1. Fix professionnels table policies - already mostly secure, just need to ensure INSERT policy is correct
DROP POLICY IF EXISTS "Authenticated users can create professional profile" ON public.professionnels;

CREATE POLICY "Users can create their own professional profile" 
ON public.professionnels 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 2. Secure association_membres data - restrict to association admins and the member themselves
-- First, check if the table exists and has RLS enabled
ALTER TABLE public.association_membres ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Association members can view members" ON public.association_membres;
DROP POLICY IF EXISTS "Association members can manage members" ON public.association_membres;

-- Create new secure policies
CREATE POLICY "Association admins can manage members" 
ON public.association_membres 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM associations a 
    WHERE a.id = association_membres.association_id 
    AND a.responsable_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own membership" 
ON public.association_membres 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own membership" 
ON public.association_membres 
FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Add data access logging table for sensitive operations
CREATE TABLE IF NOT EXISTS public.data_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  resource_type text NOT NULL,
  resource_id text,
  action text NOT NULL,
  sensitive_data_accessed boolean DEFAULT false,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.data_access_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "System can insert data access logs" ON public.data_access_logs;
DROP POLICY IF EXISTS "Admins can view data access logs" ON public.data_access_logs;

CREATE POLICY "System can insert data access logs" 
ON public.data_access_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view data access logs" 
ON public.data_access_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  )
);

-- 4. Create function to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access(
  p_resource_type text,
  p_resource_id text DEFAULT NULL,
  p_action text DEFAULT 'view'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.data_access_logs (
    user_id,
    resource_type,
    resource_id,
    action,
    sensitive_data_accessed,
    ip_address
  ) VALUES (
    auth.uid(),
    p_resource_type,
    p_resource_id,
    p_action,
    true,
    inet_client_addr()
  );
EXCEPTION
  WHEN others THEN
    -- Log errors but don't fail the main operation
    NULL;
END;
$$;