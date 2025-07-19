
-- Fix the workflow step constraint conflict in engagement_activations table
-- Remove the conflicting chk_workflow_step constraint and keep the more comprehensive one

-- Drop the conflicting constraint
ALTER TABLE engagement_activations 
DROP CONSTRAINT IF EXISTS chk_workflow_step;

-- Update the remaining constraint to include all workflow steps used by the frontend
ALTER TABLE engagement_activations 
DROP CONSTRAINT IF EXISTS chk_workflow_step_valid;

-- Add a single, comprehensive workflow step constraint
ALTER TABLE engagement_activations 
ADD CONSTRAINT chk_workflow_step_valid 
CHECK (workflow_step IN (
  'membership_decision', 
  'payment', 
  'membership_summary', 
  'tier_selection', 
  'engagement_model_selection',
  'preview_confirmation', 
  'activation_complete'
));

-- Also ensure engagement_model constraint allows null values for early workflow steps
ALTER TABLE engagement_activations 
DROP CONSTRAINT IF EXISTS chk_engagement_model_optional;

ALTER TABLE engagement_activations 
ADD CONSTRAINT chk_engagement_model_optional 
CHECK (engagement_model IS NULL OR engagement_model IN (
  'Market Place', 
  'Market Place General', 
  'Marketplace',
  'Aggregator', 
  'Platform as a Service', 
  'Market Place & Aggregator', 
  'Custom'
));
