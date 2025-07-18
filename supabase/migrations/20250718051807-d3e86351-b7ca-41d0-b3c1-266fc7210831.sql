-- Enhanced Membership Workflow Schema (Fixed)
-- Step 1: Add tier selection and enhanced payment tracking to engagement_activations

ALTER TABLE engagement_activations 
ADD COLUMN IF NOT EXISTS pricing_tier text,
ADD COLUMN IF NOT EXISTS tier_features jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS payment_simulation_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS workflow_step text DEFAULT 'membership_decision',
ADD COLUMN IF NOT EXISTS tier_selected_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS engagement_model_selected_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS workflow_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS engagement_model_details jsonb DEFAULT '{}';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_engagement_activations_workflow_step ON engagement_activations(workflow_step);
CREATE INDEX IF NOT EXISTS idx_engagement_activations_pricing_tier ON engagement_activations(pricing_tier);
CREATE INDEX IF NOT EXISTS idx_engagement_activations_payment_status ON engagement_activations(payment_simulation_status);

-- Add check constraints using DO block to handle IF NOT EXISTS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_workflow_step' AND conrelid = 'engagement_activations'::regclass) THEN
        ALTER TABLE engagement_activations 
        ADD CONSTRAINT chk_workflow_step 
        CHECK (workflow_step IN ('membership_decision', 'payment', 'tier_selection', 'engagement_model', 'details_review', 'activation_complete'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_payment_simulation_status' AND conrelid = 'engagement_activations'::regclass) THEN
        ALTER TABLE engagement_activations 
        ADD CONSTRAINT chk_payment_simulation_status 
        CHECK (payment_simulation_status IN ('pending', 'processing', 'success', 'failed'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_pricing_tier' AND conrelid = 'engagement_activations'::regclass) THEN
        ALTER TABLE engagement_activations 
        ADD CONSTRAINT chk_pricing_tier 
        CHECK (pricing_tier IN ('basic', 'standard', 'premium') OR pricing_tier IS NULL);
    END IF;
END $$;

-- Helper function to get current membership workflow status
CREATE OR REPLACE FUNCTION get_membership_workflow_status(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  activation_record RECORD;
BEGIN
  -- Get current activation record
  SELECT * INTO activation_record
  FROM engagement_activations
  WHERE user_id = user_id_param
  ORDER BY updated_at DESC
  LIMIT 1;
  
  IF activation_record IS NULL THEN
    RETURN jsonb_build_object(
      'has_workflow', false,
      'current_step', 'membership_decision',
      'is_complete', false
    );
  END IF;
  
  -- Build status object
  result := jsonb_build_object(
    'has_workflow', true,
    'current_step', COALESCE(activation_record.workflow_step, 'membership_decision'),
    'is_complete', COALESCE(activation_record.workflow_completed, false),
    'membership_status', activation_record.membership_status,
    'payment_status', activation_record.payment_simulation_status,
    'pricing_tier', activation_record.pricing_tier,
    'engagement_model', activation_record.engagement_model,
    'last_updated', activation_record.updated_at
  );
  
  RETURN result;
END;
$$;