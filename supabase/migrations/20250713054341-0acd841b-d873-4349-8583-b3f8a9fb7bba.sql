-- Make link field mandatory in master_communication_types table
-- First update any existing NULL values to empty string (if any)
UPDATE master_communication_types 
SET link = '' 
WHERE link IS NULL;

-- Now make the column NOT NULL
ALTER TABLE master_communication_types 
ALTER COLUMN link SET NOT NULL;

-- Add a check constraint to ensure the link is not empty
ALTER TABLE master_communication_types 
ADD CONSTRAINT check_link_not_empty CHECK (link != '' AND length(trim(link)) > 0);