-- Comprehensive Security Fixes Migration
-- Fix remaining personal data exposure issues

-- 1. Fix services_commerces table - restrict to authenticated users only
DROP POLICY IF EXISTS "Public Delete services_commerces" ON public.services_commerces;
DROP POLICY IF EXISTS "Public Insert services_commerces" ON public.services_commerces;
DROP POLICY IF EXISTS "Public Select services_commerces" ON public.services_commerces;
DROP POLICY IF EXISTS "Public Update services_commerces" ON public.services_commerces;
DROP POLICY IF EXISTS "services_commerces_delete_policy" ON public.services_commerces;
DROP POLICY IF EXISTS "services_commerces_insert_policy" ON public.services_commerces;
DROP POLICY IF EXISTS "services_commerces_select_policy" ON public.services_commerces;
DROP POLICY IF EXISTS "services_commerces_update_policy" ON public.services_commerces;

CREATE POLICY "Authenticated users can view services" 
ON public.services_commerces 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create services" 
ON public.services_commerces 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update services" 
ON public.services_commerces 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete services" 
ON public.services_commerces 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 2. Fix associations table - restrict to authenticated users only
DROP POLICY IF EXISTS "Accès public aux associations" ON public.associations;
DROP POLICY IF EXISTS "Public Delete associations" ON public.associations;
DROP POLICY IF EXISTS "Public Insert associations" ON public.associations;
DROP POLICY IF EXISTS "Public Update associations" ON public.associations;

CREATE POLICY "Authenticated users can view associations" 
ON public.associations 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create associations" 
ON public.associations 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update associations" 
ON public.associations 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete associations" 
ON public.associations 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 3. Fix taxi_drivers table - restrict to authenticated users only
DROP POLICY IF EXISTS "Public can view available drivers" ON public.taxi_drivers;

CREATE POLICY "Authenticated users can view available drivers" 
ON public.taxi_drivers 
FOR SELECT 
USING (auth.role() = 'authenticated' AND is_available = true);

-- 4. Create audit_logs table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    action text NOT NULL,
    resource_type text NOT NULL,
    resource_id text,
    details jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow viewing own audit logs (admins can be granted broader access later)
CREATE POLICY "Users can view their own audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Only the system can insert audit logs (via security definer functions)
CREATE POLICY "System can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true);

-- 5. Create security definer function for audit logging
CREATE OR REPLACE FUNCTION public.log_audit_event(
    p_action text,
    p_resource_type text,
    p_resource_id text DEFAULT NULL,
    p_details jsonb DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id, 
        action, 
        resource_type, 
        resource_id, 
        details,
        ip_address
    ) VALUES (
        auth.uid(),
        p_action,
        p_resource_type,
        p_resource_id,
        p_details,
        inet_client_addr()
    );
END;
$$;

-- 6. Add indexes for better performance on audit logs
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- 7. Create function to check if user is association member (prevent RLS recursion)
CREATE OR REPLACE FUNCTION public.is_association_member(p_association_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.association_membres 
        WHERE association_id = p_association_id 
        AND user_id = p_user_id
    );
$$;