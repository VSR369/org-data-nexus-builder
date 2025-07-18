-- Fix ON CONFLICT error by adding unique constraint on user_id
-- This ensures one activation record per user and allows upsert operations to work properly

ALTER TABLE engagement_activations 
ADD CONSTRAINT unique_user_activation 
UNIQUE (user_id);