
-- Fix the workflow step constraint to include missing steps used by the frontend
ALTER TABLE engagement_activations 
DROP CONSTRAINT IF EXISTS chk_workflow_step;

-- Add the updated constraint with all workflow steps used in the frontend
ALTER TABLE engagement_activations 
ADD CONSTRAINT chk_workflow_step 
CHECK (workflow_step IN (
  'membership_decision', 
  'payment', 
  'membership_summary', 
  'tier_selection', 
  'engagement_model', 
  'preview_confirmation', 
  'activation_complete'
));

-- Fix the engagement model constraint to include 'Marketplace' (frontend uses this)
ALTER TABLE engagement_activations 
DROP CONSTRAINT IF EXISTS chk_engagement_model_optional;

-- Add updated engagement model constraint
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
