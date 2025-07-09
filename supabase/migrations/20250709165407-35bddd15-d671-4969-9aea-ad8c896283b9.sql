-- Create pricing configurations table
CREATE TABLE public.pricing_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id TEXT NOT NULL,
  country TEXT NOT NULL,
  currency TEXT,
  organization_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  engagement_model TEXT NOT NULL,
  quarterly_fee DECIMAL,
  half_yearly_fee DECIMAL,
  annual_fee DECIMAL,
  platform_fee_percentage DECIMAL,
  membership_status TEXT NOT NULL,
  discount_percentage DECIMAL,
  internal_paas_pricing JSONB DEFAULT '[]'::jsonb,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(config_id)
);

-- Enable RLS
ALTER TABLE public.pricing_configs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is master data)
CREATE POLICY "Anyone can view pricing configs" 
ON public.pricing_configs 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert pricing configs" 
ON public.pricing_configs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update pricing configs" 
ON public.pricing_configs 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete pricing configs" 
ON public.pricing_configs 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pricing_configs_updated_at
BEFORE UPDATE ON public.pricing_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();