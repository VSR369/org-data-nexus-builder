-- Phase 1: Add new columns to master_tier_engagement_model_access for refined Basic Tier rules

-- Add new columns to support refined tier engagement model access
ALTER TABLE master_tier_engagement_model_access 
ADD COLUMN selection_scope TEXT NOT NULL DEFAULT 'per_challenge' CHECK (selection_scope IN ('global', 'per_challenge')),
ADD COLUMN max_concurrent_models INTEGER NOT NULL DEFAULT 1,
ADD COLUMN switch_requirements TEXT NOT NULL DEFAULT 'none' CHECK (switch_requirements IN ('no_active_challenges', 'pause_all', 'complete_all', 'none')),
ADD COLUMN allows_multiple_challenges BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN business_rules JSONB DEFAULT '{}'::jsonb;

-- Create function to check active challenges for user
CREATE OR REPLACE FUNCTION public.check_active_challenges_for_user(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  active_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO active_count
  FROM engagement_activations
  WHERE user_id = user_id_param
    AND activation_status = 'Activated'
    AND (engagement_locked IS NULL OR engagement_locked = false);
  
  RETURN COALESCE(active_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate engagement model switch based on tier rules
CREATE OR REPLACE FUNCTION public.validate_engagement_model_switch(
  user_id_param UUID,
  tier_id_param UUID,
  new_model_id UUID
)
RETURNS JSONB AS $$
DECLARE
  tier_rules RECORD;
  active_challenges INTEGER;
  result JSONB;
BEGIN
  -- Get tier rules
  SELECT selection_scope, max_concurrent_models, switch_requirements, allows_multiple_challenges
  INTO tier_rules
  FROM master_tier_engagement_model_access tema
  WHERE tema.pricing_tier_id = tier_id_param
    AND tema.engagement_model_id = new_model_id
    AND tema.is_active = true
    AND tema.is_allowed = true;
  
  -- If no rules found, deny access
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'Engagement model not allowed for this tier',
      'error_code', 'MODEL_NOT_ALLOWED'
    );
  END IF;
  
  -- Check active challenges count
  active_challenges := public.check_active_challenges_for_user(user_id_param);
  
  -- For global selection scope with no_active_challenges requirement
  IF tier_rules.selection_scope = 'global' AND tier_rules.switch_requirements = 'no_active_challenges' THEN
    IF active_challenges > 0 THEN
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', 'Cannot switch engagement model while challenges are active. Please complete or pause all active challenges first.',
        'error_code', 'ACTIVE_CHALLENGES_EXIST',
        'active_challenges_count', active_challenges
      );
    END IF;
  END IF;
  
  -- All validations passed
  RETURN jsonb_build_object(
    'allowed', true,
    'tier_rules', row_to_json(tier_rules),
    'active_challenges_count', active_challenges
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's current global engagement model
CREATE OR REPLACE FUNCTION public.get_user_current_global_model(user_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  current_model TEXT;
  model_info JSONB;
BEGIN
  -- Get the most recent engagement model from active challenges
  SELECT engagement_model INTO current_model
  FROM engagement_activations
  WHERE user_id = user_id_param
    AND activation_status = 'Activated'
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF current_model IS NULL THEN
    RETURN jsonb_build_object(
      'has_global_model', false,
      'current_model', null
    );
  END IF;
  
  -- Get model details
  SELECT jsonb_build_object(
    'id', id,
    'name', name,
    'description', description
  ) INTO model_info
  FROM master_engagement_models
  WHERE name = current_model;
  
  RETURN jsonb_build_object(
    'has_global_model', true,
    'current_model', current_model,
    'model_info', model_info
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default configurations for existing tiers
-- First, get tier IDs
DO $$
DECLARE
  basic_tier_id UUID;
  standard_tier_id UUID;
  premium_tier_id UUID;
  marketplace_model_id UUID;
  aggregator_model_id UUID;
BEGIN
  -- Get tier IDs
  SELECT id INTO basic_tier_id FROM master_pricing_tiers WHERE LOWER(name) LIKE '%basic%' LIMIT 1;
  SELECT id INTO standard_tier_id FROM master_pricing_tiers WHERE LOWER(name) LIKE '%standard%' LIMIT 1;
  SELECT id INTO premium_tier_id FROM master_pricing_tiers WHERE LOWER(name) LIKE '%premium%' LIMIT 1;
  
  -- Get engagement model IDs
  SELECT id INTO marketplace_model_id FROM master_engagement_models WHERE LOWER(name) LIKE '%marketplace%' LIMIT 1;
  SELECT id INTO aggregator_model_id FROM master_engagement_models WHERE LOWER(name) LIKE '%aggregator%' LIMIT 1;
  
  -- Update Basic Tier configurations (if tiers exist)
  IF basic_tier_id IS NOT NULL THEN
    UPDATE master_tier_engagement_model_access 
    SET 
      selection_scope = 'global',
      max_concurrent_models = 1,
      switch_requirements = 'no_active_challenges',
      allows_multiple_challenges = true,
      business_rules = jsonb_build_object(
        'description', 'Basic tier allows multiple challenges but only one global engagement model',
        'restrictions', jsonb_build_array(
          'Only one engagement model active at a time',
          'Must complete/pause all challenges before switching models',
          'Model selection applies globally to all challenges'
        )
      )
    WHERE pricing_tier_id = basic_tier_id;
  END IF;
  
  -- Update Standard Tier configurations (if tiers exist)
  IF standard_tier_id IS NOT NULL THEN
    UPDATE master_tier_engagement_model_access 
    SET 
      selection_scope = 'per_challenge',
      max_concurrent_models = 999,
      switch_requirements = 'none',
      allows_multiple_challenges = true,
      business_rules = jsonb_build_object(
        'description', 'Standard tier allows per-challenge model selection with no restrictions',
        'restrictions', jsonb_build_array()
      )
    WHERE pricing_tier_id = standard_tier_id;
  END IF;
  
  -- Update Premium Tier configurations (if tiers exist)
  IF premium_tier_id IS NOT NULL THEN
    UPDATE master_tier_engagement_model_access 
    SET 
      selection_scope = 'per_challenge',
      max_concurrent_models = 999,
      switch_requirements = 'none',
      allows_multiple_challenges = true,
      business_rules = jsonb_build_object(
        'description', 'Premium tier allows per-challenge model selection with no restrictions',
        'restrictions', jsonb_build_array()
      )
    WHERE pricing_tier_id = premium_tier_id;
  END IF;
END $$;