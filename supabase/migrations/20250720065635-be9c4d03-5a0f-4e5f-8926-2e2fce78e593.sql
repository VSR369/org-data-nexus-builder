
-- Phase 1: Database Schema Enhancements for Organization Validation Workflow

-- Create organization validation tracking table
CREATE TABLE IF NOT EXISTS public.organization_validation_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id TEXT NOT NULL, -- Links to organizations table via organization_id
  payment_validation_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_validation_status IN ('pending', 'approved', 'declined')),
  payment_validation_reason TEXT,
  payment_validated_by UUID REFERENCES auth.users(id),
  payment_validated_at TIMESTAMP WITH TIME ZONE,
  
  document_validation_status TEXT NOT NULL DEFAULT 'not_required' CHECK (document_validation_status IN ('not_required', 'pending', 'valid', 'invalid')),
  document_validation_reason TEXT,
  document_validated_by UUID REFERENCES auth.users(id),
  document_validated_at TIMESTAMP WITH TIME ZONE,
  
  admin_authorization_status TEXT NOT NULL DEFAULT 'not_ready' CHECK (admin_authorization_status IN ('not_ready', 'ready', 'authorized')),
  admin_authorized_by UUID REFERENCES auth.users(id),
  admin_authorized_at TIMESTAMP WITH TIME ZONE,
  
  workflow_completed BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create validation audit log table
CREATE TABLE IF NOT EXISTS public.validation_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id TEXT NOT NULL,
  validation_type TEXT NOT NULL CHECK (validation_type IN ('payment', 'document', 'admin_authorization')),
  action_type TEXT NOT NULL CHECK (action_type IN ('approved', 'declined', 'marked_valid', 'marked_invalid', 'authorized')),
  previous_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  comments TEXT,
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create member status change alerts table
CREATE TABLE IF NOT EXISTS public.member_status_change_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id TEXT NOT NULL,
  previous_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  change_detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  alert_processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add RLS policies
ALTER TABLE public.organization_validation_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_status_change_alerts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read validation data
CREATE POLICY "Allow authenticated users to read validation tracking" 
  ON public.organization_validation_tracking 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to update validation tracking" 
  ON public.organization_validation_tracking 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow authenticated users to insert validation tracking" 
  ON public.organization_validation_tracking 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read audit log" 
  ON public.validation_audit_log 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to insert audit log" 
  ON public.validation_audit_log 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read status change alerts" 
  ON public.member_status_change_alerts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to update status change alerts" 
  ON public.member_status_change_alerts 
  FOR UPDATE 
  USING (true);

-- Create function to initialize validation tracking for organization
CREATE OR REPLACE FUNCTION public.initialize_organization_validation(org_id TEXT, entity_type TEXT)
RETURNS UUID AS $$
DECLARE
  tracking_id UUID;
  doc_status TEXT;
BEGIN
  -- Determine document validation requirement based on entity type
  doc_status := CASE 
    WHEN LOWER(entity_type) LIKE '%non%commercial%' OR LOWER(entity_type) = 'non-profit' THEN 'pending'
    ELSE 'not_required'
  END;
  
  -- Insert or update validation tracking
  INSERT INTO public.organization_validation_tracking (
    organization_id,
    document_validation_status
  ) VALUES (
    org_id,
    doc_status
  )
  ON CONFLICT (organization_id) DO UPDATE SET
    document_validation_status = EXCLUDED.document_validation_status,
    updated_at = now()
  RETURNING id INTO tracking_id;
  
  RETURN tracking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update validation status with audit
CREATE OR REPLACE FUNCTION public.update_validation_status(
  org_id TEXT,
  validation_type TEXT,
  new_status TEXT,
  reason TEXT DEFAULT NULL,
  user_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  old_status TEXT;
  tracking_record RECORD;
  result JSONB;
BEGIN
  -- Get current status
  SELECT * INTO tracking_record
  FROM public.organization_validation_tracking
  WHERE organization_id = org_id;
  
  -- If no tracking record exists, create one
  IF NOT FOUND THEN
    -- Get entity type for document validation determination
    SELECT entity_type INTO old_status
    FROM solution_seekers_comprehensive_view
    WHERE organization_id = org_id;
    
    PERFORM public.initialize_organization_validation(org_id, COALESCE(old_status, 'Commercial'));
    
    -- Retry getting the record
    SELECT * INTO tracking_record
    FROM public.organization_validation_tracking
    WHERE organization_id = org_id;
  END IF;
  
  -- Get old status based on validation type
  old_status := CASE validation_type
    WHEN 'payment' THEN tracking_record.payment_validation_status
    WHEN 'document' THEN tracking_record.document_validation_status
    WHEN 'admin_authorization' THEN tracking_record.admin_authorization_status
  END;
  
  -- Update the appropriate status
  IF validation_type = 'payment' THEN
    UPDATE public.organization_validation_tracking
    SET payment_validation_status = new_status,
        payment_validation_reason = reason,
        payment_validated_by = user_id,
        payment_validated_at = now(),
        updated_at = now()
    WHERE organization_id = org_id;
  ELSIF validation_type = 'document' THEN
    UPDATE public.organization_validation_tracking
    SET document_validation_status = new_status,
        document_validation_reason = reason,
        document_validated_by = user_id,
        document_validated_at = now(),
        updated_at = now()
    WHERE organization_id = org_id;
  ELSIF validation_type = 'admin_authorization' THEN
    UPDATE public.organization_validation_tracking
    SET admin_authorization_status = new_status,
        admin_authorized_by = user_id,
        admin_authorized_at = now(),
        updated_at = now()
    WHERE organization_id = org_id;
  END IF;
  
  -- Log the action
  INSERT INTO public.validation_audit_log (
    organization_id,
    validation_type,
    action_type,
    previous_status,
    new_status,
    reason,
    performed_by
  ) VALUES (
    org_id,
    validation_type,
    new_status,
    old_status,
    new_status,
    reason,
    user_id
  );
  
  -- Check if workflow is complete and update admin authorization readiness
  SELECT * INTO tracking_record
  FROM public.organization_validation_tracking
  WHERE organization_id = org_id;
  
  -- Update admin authorization readiness
  IF tracking_record.payment_validation_status = 'approved' AND 
     (tracking_record.document_validation_status IN ('not_required', 'valid')) THEN
    
    UPDATE public.organization_validation_tracking
    SET admin_authorization_status = CASE 
      WHEN admin_authorization_status = 'not_ready' THEN 'ready'
      ELSE admin_authorization_status
    END,
    workflow_completed = CASE 
      WHEN admin_authorization_status = 'authorized' THEN true
      ELSE false
    END,
    updated_at = now()
    WHERE organization_id = org_id;
  END IF;
  
  result := jsonb_build_object(
    'success', true,
    'old_status', old_status,
    'new_status', new_status,
    'validation_type', validation_type
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check validation prerequisites
CREATE OR REPLACE FUNCTION public.check_validation_prerequisites(org_id TEXT)
RETURNS JSONB AS $$
DECLARE
  tracking_record RECORD;
  result JSONB;
BEGIN
  -- Get validation tracking record
  SELECT * INTO tracking_record
  FROM public.organization_validation_tracking
  WHERE organization_id = org_id;
  
  -- If no record exists, initialize it
  IF NOT FOUND THEN
    DECLARE
      entity_type TEXT;
    BEGIN
      SELECT entity_type INTO entity_type
      FROM solution_seekers_comprehensive_view
      WHERE organization_id = org_id;
      
      PERFORM public.initialize_organization_validation(org_id, COALESCE(entity_type, 'Commercial'));
      
      SELECT * INTO tracking_record
      FROM public.organization_validation_tracking
      WHERE organization_id = org_id;
    END;
  END IF;
  
  result := jsonb_build_object(
    'payment_approved', tracking_record.payment_validation_status = 'approved',
    'document_validated', tracking_record.document_validation_status IN ('not_required', 'valid'),
    'admin_ready', tracking_record.admin_authorization_status = 'ready',
    'workflow_complete', tracking_record.workflow_completed,
    'can_authorize_admin', 
      tracking_record.payment_validation_status = 'approved' AND 
      tracking_record.document_validation_status IN ('not_required', 'valid') AND
      tracking_record.admin_authorization_status = 'ready',
    'validation_status', row_to_json(tracking_record)
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add unique constraint to prevent duplicate tracking records
ALTER TABLE public.organization_validation_tracking 
ADD CONSTRAINT unique_org_validation UNIQUE (organization_id);

-- Create trigger to auto-initialize validation tracking
CREATE OR REPLACE FUNCTION public.auto_initialize_validation_tracking()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize validation tracking for new organizations
  PERFORM public.initialize_organization_validation(NEW.organization_id, NEW.entity_type);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: We'll add the trigger after confirming the organizations table structure
-- This ensures we don't break existing functionality
