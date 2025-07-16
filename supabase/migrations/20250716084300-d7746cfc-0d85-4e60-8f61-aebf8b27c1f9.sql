-- Create master_challenge_complexity table for configurable complexity levels and multipliers
CREATE TABLE public.master_challenge_complexity (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    management_fee_multiplier NUMERIC NOT NULL DEFAULT 1.0,
    consulting_fee_multiplier NUMERIC NOT NULL DEFAULT 1.0,
    description TEXT,
    level_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by TEXT,
    version INTEGER DEFAULT 1,
    is_user_created BOOLEAN DEFAULT false
);

-- Enable RLS on the table
ALTER TABLE public.master_challenge_complexity ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations on master_challenge_complexity" 
ON public.master_challenge_complexity 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON master_challenge_complexity TO authenticated;

-- Create update trigger for updated_at
CREATE TRIGGER update_master_challenge_complexity_updated_at
    BEFORE UPDATE ON public.master_challenge_complexity
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default complexity levels
INSERT INTO public.master_challenge_complexity (name, management_fee_multiplier, consulting_fee_multiplier, description, level_order, is_active) VALUES
('Low', 1.0, 1.0, 'Basic complexity level with standard rates', 1, true),
('Medium', 1.5, 1.5, 'Moderate complexity requiring additional expertise', 2, true),
('High', 2.0, 2.0, 'High complexity requiring significant expertise', 3, true),
('Expert', 2.5, 2.5, 'Expert level complexity for specialized challenges', 4, true);