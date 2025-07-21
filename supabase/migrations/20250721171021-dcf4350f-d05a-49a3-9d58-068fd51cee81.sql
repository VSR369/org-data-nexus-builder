-- Create roles table for Challenge Creator, Challenge Curator, Innovation Director, Expert Reviewer
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  version INTEGER DEFAULT 1
);

-- Enable Row Level Security
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for authenticated users
CREATE POLICY "Allow all operations on roles" 
ON public.roles 
FOR ALL 
TO authenticated
USING (true) 
WITH CHECK (true);

-- Insert the default roles
INSERT INTO public.roles (name, description) VALUES
('Challenge Creator', 'Creates and manages innovation challenges for the platform'),
('Challenge Curator', 'Reviews and curates challenges to ensure quality and relevance'),
('Innovation Director', 'Oversees innovation strategy and challenge portfolio management'),
('Expert Reviewer', 'Provides expert evaluation and feedback on submitted solutions');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON public.roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();