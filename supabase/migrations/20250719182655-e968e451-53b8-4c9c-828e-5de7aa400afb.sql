-- Drop existing policy and recreate with proper permissions
DROP POLICY IF EXISTS "Allow all operations on membership statuses" ON master_membership_statuses;

-- Create a comprehensive policy that allows all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users" 
ON master_membership_statuses 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);