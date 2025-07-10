
-- Create engagement_activations table to track engagement model activations
CREATE TABLE public.engagement_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  engagement_model TEXT NOT NULL,
  membership_status TEXT NOT NULL,
  platform_fee_percentage NUMERIC,
  discount_percentage NUMERIC,
  final_calculated_price NUMERIC,
  currency TEXT DEFAULT 'USD',
  activation_status TEXT DEFAULT 'Activated',
  terms_accepted BOOLEAN DEFAULT true,
  organization_type TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.engagement_activations ENABLE ROW LEVEL SECURITY;

-- Create policies for users to view their own activations
CREATE POLICY "Users can view their own activations" 
ON public.engagement_activations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policies for users to insert their own activations
CREATE POLICY "Users can create their own activations" 
ON public.engagement_activations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for users to update their own activations
CREATE POLICY "Users can update their own activations" 
ON public.engagement_activations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_engagement_activations_updated_at
BEFORE UPDATE ON public.engagement_activations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
