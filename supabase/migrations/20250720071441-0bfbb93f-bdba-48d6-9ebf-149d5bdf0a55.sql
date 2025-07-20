
-- Fix the entity type detection logic in validation functions
-- Update initialize_organization_validation to correctly identify non-commercial entities

CREATE OR REPLACE FUNCTION public.initialize_organization_validation(org_id TEXT, entity_type TEXT)
RETURNS UUID AS $$
DECLARE
  tracking_id UUID;
  doc_status TEXT;
BEGIN
  -- Determine document validation requirement based on exact entity type matching
  doc_status := CASE 
    WHEN entity_type IN ('Non-Profit Organization', 'Society', 'Trust') THEN 'pending'
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

-- Update check_validation_prerequisites to use correct entity type logic
CREATE OR REPLACE FUNCTION public.check_validation_prerequisites(org_id TEXT)
RETURNS JSONB AS $$
DECLARE
  tracking_record RECORD;
  org_entity_type TEXT;
  result JSONB;
BEGIN
  -- Get validation tracking record
  SELECT * INTO tracking_record
  FROM public.organization_validation_tracking
  WHERE organization_id = org_id;
  
  -- If no record exists, initialize it
  IF NOT FOUND THEN
    -- Get entity type for document validation determination
    SELECT scv.entity_type INTO org_entity_type
    FROM solution_seekers_comprehensive_view scv
    WHERE scv.organization_id = org_id;
    
    PERFORM public.initialize_organization_validation(org_id, COALESCE(org_entity_type, 'Commercial'));
    
    -- Retry getting the record
    SELECT * INTO tracking_record
    FROM public.organization_validation_tracking
    WHERE organization_id = org_id;
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

-- Update update_validation_status to handle the corrected workflow
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
  org_entity_type TEXT;
  result JSONB;
BEGIN
  -- Get current status
  SELECT * INTO tracking_record
  FROM public.organization_validation_tracking
  WHERE organization_id = org_id;
  
  -- If no tracking record exists, create one
  IF NOT FOUND THEN
    -- Get entity type for document validation determination
    SELECT scv.entity_type INTO org_entity_type
    FROM solution_seekers_comprehensive_view scv
    WHERE scv.organization_id = org_id;
    
    PERFORM public.initialize_organization_validation(org_id, COALESCE(org_entity_type, 'Commercial'));
    
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
  
  -- Update admin authorization readiness based on corrected logic
  IF tracking_record.payment_validation_status = 'approved' AND 
     tracking_record.document_validation_status IN ('not_required', 'valid') THEN
    
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
