-- Enable Row Level Security on master_membership_statuses table
ALTER TABLE master_membership_statuses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations on membership statuses" 
ON master_membership_statuses 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);