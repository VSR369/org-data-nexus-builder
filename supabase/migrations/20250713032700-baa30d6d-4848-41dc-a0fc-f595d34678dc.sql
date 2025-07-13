-- Add link field to master_communication_types table
ALTER TABLE master_communication_types 
ADD COLUMN link TEXT;

-- Add a comment to explain the link field
COMMENT ON COLUMN master_communication_types.link IS 'URL link for the communication type (e.g., YouTube channel, Blog URL, Podcast platform link)';