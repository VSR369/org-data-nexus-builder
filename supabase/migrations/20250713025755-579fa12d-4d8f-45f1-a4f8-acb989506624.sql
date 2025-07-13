-- Remove categories and sub-categories tables since Domain Groups now handles this hierarchy
-- These tables are no longer needed as the functionality is now handled within Domain Groups

-- Drop tables in correct order (sub-categories first due to foreign key dependency)
DROP TABLE IF EXISTS master_sub_categories CASCADE;
DROP TABLE IF EXISTS master_categories CASCADE;

-- Also drop the validation function that was specifically for reward types since it's no longer needed
-- Note: The reward types validation is simple enough to handle with basic constraints