
-- Drop existing problematic RLS policies on organization_administrators
DROP POLICY IF EXISTS "Super admins can create organization admins" ON public.organization_administrators;
DROP POLICY IF EXISTS "Super admins can view all organization admins" ON public.organization_administrators;
DROP POLICY IF EXISTS "Super admins can update organization admins" ON public.organization_administrators;
DROP POLICY IF EXISTS "Super admins can delete organization admins" ON public.organization_administrators;

-- Create admin_roles table for role definitions
CREATE TABLE public.admin_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform_administrators table for super admins
CREATE TABLE public.platform_administrators (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_name TEXT NOT NULL,
    admin_email TEXT UNIQUE NOT NULL,
    contact_number TEXT,
    role_id UUID REFERENCES admin_roles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on new tables
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_administrators ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies for admin_roles (allow all authenticated users to read)
CREATE POLICY "Allow authenticated users to read admin roles" 
ON public.admin_roles 
FOR SELECT 
TO authenticated 
USING (true);

-- Create RLS policies for platform_administrators
CREATE POLICY "Platform admins can view all platform admins" 
ON public.platform_administrators 
FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM platform_administrators pa 
        JOIN admin_roles ar ON ar.id = pa.role_id 
        WHERE pa.user_id = auth.uid() 
        AND ar.role_name = 'super_admin' 
        AND pa.is_active = true
    )
);

CREATE POLICY "Platform admins can manage platform admins" 
ON public.platform_administrators 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM platform_administrators pa 
        JOIN admin_roles ar ON ar.id = pa.role_id 
        WHERE pa.user_id = auth.uid() 
        AND ar.role_name = 'super_admin' 
        AND pa.is_active = true
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM platform_administrators pa 
        JOIN admin_roles ar ON ar.id = pa.role_id 
        WHERE pa.user_id = auth.uid() 
        AND ar.role_name = 'super_admin' 
        AND pa.is_active = true
    )
);

-- Create new simple RLS policies for organization_administrators (no circular reference)
CREATE POLICY "Platform admins can manage organization admins" 
ON public.organization_administrators 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM platform_administrators pa 
        JOIN admin_roles ar ON ar.id = pa.role_id 
        WHERE pa.user_id = auth.uid() 
        AND ar.role_name = 'super_admin' 
        AND pa.is_active = true
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM platform_administrators pa 
        JOIN admin_roles ar ON ar.id = pa.role_id 
        WHERE pa.user_id = auth.uid() 
        AND ar.role_name = 'super_admin' 
        AND pa.is_active = true
    )
);

-- Create update triggers for new tables
CREATE TRIGGER update_admin_roles_updated_at
    BEFORE UPDATE ON public.admin_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_platform_administrators_updated_at
    BEFORE UPDATE ON public.platform_administrators
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin roles
INSERT INTO public.admin_roles (role_name, description, permissions) VALUES
('super_admin', 'Platform Super Administrator with full system access', '["manage_platform", "manage_organizations", "create_admins", "view_all_data"]'),
('organization_admin', 'Organization Administrator with limited scope', '["manage_organization", "view_organization_data"]'),
('support_admin', 'Support Administrator with read-only access', '["view_organization_data", "provide_support"]');

-- Create a bootstrap super admin (this will need to be updated with actual user credentials)
-- Note: This is a placeholder - you'll need to update this with actual user_id after authentication setup
INSERT INTO public.platform_administrators (admin_name, admin_email, role_id, is_active) 
SELECT 
    'System Administrator',
    'admin@system.com',
    ar.id,
    true
FROM admin_roles ar 
WHERE ar.role_name = 'super_admin';

-- Create a security definer function to check if current user is platform admin
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM platform_administrators pa 
        JOIN admin_roles ar ON ar.id = pa.role_id 
        WHERE pa.user_id = auth.uid() 
        AND ar.role_name = 'super_admin' 
        AND pa.is_active = true
    );
$$;

-- Update audit table to reference the new admin system
ALTER TABLE public.admin_creation_audit 
ADD COLUMN platform_admin_id UUID REFERENCES platform_administrators(id);
