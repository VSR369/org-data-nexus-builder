-- Add is_active column to master_engagement_models table
ALTER TABLE master_engagement_models 
ADD COLUMN is_active boolean NOT NULL DEFAULT true;