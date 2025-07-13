-- Create master_capability_levels table
CREATE TABLE public.master_capability_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  min_score INTEGER NOT NULL CHECK (min_score >= 0 AND min_score <= 10),
  max_score INTEGER NOT NULL CHECK (max_score >= 0 AND max_score <= 10),
  color TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  is_user_created BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1
);

-- Enable Row Level Security
ALTER TABLE public.master_capability_levels ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Allow all operations on master_capability_levels" 
ON public.master_capability_levels 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_master_capability_levels_updated_at
BEFORE UPDATE ON public.master_capability_levels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default capability levels
INSERT INTO public.master_capability_levels (name, min_score, max_score, color, order_index, is_active) VALUES
('Beginner', 0, 2, '#ef4444', 1, true),
('Basic', 3, 4, '#f97316', 2, true),
('Intermediate', 5, 6, '#eab308', 3, true),
('Advanced', 7, 8, '#22c55e', 4, true),
('Expert', 9, 10, '#3b82f6', 5, true);