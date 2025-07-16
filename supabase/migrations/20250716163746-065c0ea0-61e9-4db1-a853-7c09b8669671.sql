-- Create Master Support Types table
CREATE TABLE public.master_support_types (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    service_level TEXT NOT NULL,
    response_time TEXT,
    availability TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version INTEGER DEFAULT 1,
    is_user_created BOOLEAN DEFAULT false,
    created_by TEXT
);

-- Create Master Analytics Access Types table
CREATE TABLE public.master_analytics_access_types (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    features_included JSONB DEFAULT '[]'::jsonb,
    dashboard_access BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version INTEGER DEFAULT 1,
    is_user_created BOOLEAN DEFAULT false,
    created_by TEXT
);

-- Create Master Workflow Templates table
CREATE TABLE public.master_workflow_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL,
    customization_level TEXT NOT NULL,
    fields_config JSONB DEFAULT '{}'::jsonb,
    template_count INTEGER DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version INTEGER DEFAULT 1,
    is_user_created BOOLEAN DEFAULT false,
    created_by TEXT
);

-- Create Master Onboarding Types table
CREATE TABLE public.master_onboarding_types (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    service_type TEXT NOT NULL,
    resources_included JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version INTEGER DEFAULT 1,
    is_user_created BOOLEAN DEFAULT false,
    created_by TEXT
);

-- Create Tier Configuration Settings table
CREATE TABLE public.master_tier_configurations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pricing_tier_id UUID NOT NULL REFERENCES master_pricing_tiers(id),
    country_id UUID NOT NULL REFERENCES master_countries(id),
    currency_id UUID REFERENCES master_currencies(id),
    monthly_challenge_limit INTEGER,
    solutions_per_challenge INTEGER NOT NULL DEFAULT 1,
    fixed_charge_per_challenge NUMERIC(10,2) NOT NULL DEFAULT 0,
    allows_overage BOOLEAN NOT NULL DEFAULT false,
    support_type_id UUID REFERENCES master_support_types(id),
    analytics_access_id UUID REFERENCES master_analytics_access_types(id),
    workflow_template_id UUID REFERENCES master_workflow_templates(id),
    onboarding_type_id UUID REFERENCES master_onboarding_types(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version INTEGER DEFAULT 1,
    is_user_created BOOLEAN DEFAULT false,
    created_by TEXT,
    UNIQUE(pricing_tier_id, country_id)
);

-- Create Tier Engagement Model Access table
CREATE TABLE public.master_tier_engagement_model_access (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pricing_tier_id UUID NOT NULL REFERENCES master_pricing_tiers(id),
    engagement_model_id UUID NOT NULL REFERENCES master_engagement_models(id),
    is_allowed BOOLEAN NOT NULL DEFAULT true,
    is_default BOOLEAN NOT NULL DEFAULT false,
    selection_type TEXT NOT NULL DEFAULT 'per_challenge' CHECK (selection_type IN ('global', 'per_challenge')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version INTEGER DEFAULT 1,
    is_user_created BOOLEAN DEFAULT false,
    created_by TEXT,
    UNIQUE(pricing_tier_id, engagement_model_id)
);

-- Create Challenge Overage Fees table
CREATE TABLE public.master_challenge_overage_fees (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pricing_tier_id UUID NOT NULL REFERENCES master_pricing_tiers(id),
    country_id UUID NOT NULL REFERENCES master_countries(id),
    currency_id UUID NOT NULL REFERENCES master_currencies(id),
    fee_per_additional_challenge NUMERIC(10,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version INTEGER DEFAULT 1,
    is_user_created BOOLEAN DEFAULT false,
    created_by TEXT,
    UNIQUE(pricing_tier_id, country_id)
);

-- Create System Feature Access table
CREATE TABLE public.master_system_feature_access (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pricing_tier_id UUID NOT NULL REFERENCES master_pricing_tiers(id),
    feature_name TEXT NOT NULL,
    access_level TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    feature_config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version INTEGER DEFAULT 1,
    is_user_created BOOLEAN DEFAULT false,
    created_by TEXT,
    UNIQUE(pricing_tier_id, feature_name)
);

-- Enable RLS on all new tables
ALTER TABLE public.master_support_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_analytics_access_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_onboarding_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_tier_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_tier_engagement_model_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_challenge_overage_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_system_feature_access ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables (allowing all operations for now)
CREATE POLICY "Allow all operations on master_support_types" ON public.master_support_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_analytics_access_types" ON public.master_analytics_access_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_workflow_templates" ON public.master_workflow_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_onboarding_types" ON public.master_onboarding_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_tier_configurations" ON public.master_tier_configurations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_tier_engagement_model_access" ON public.master_tier_engagement_model_access FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_challenge_overage_fees" ON public.master_challenge_overage_fees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on master_system_feature_access" ON public.master_system_feature_access FOR ALL USING (true) WITH CHECK (true);

-- Create update triggers for all new tables
CREATE TRIGGER update_master_support_types_updated_at
    BEFORE UPDATE ON public.master_support_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_analytics_access_types_updated_at
    BEFORE UPDATE ON public.master_analytics_access_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_workflow_templates_updated_at
    BEFORE UPDATE ON public.master_workflow_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_onboarding_types_updated_at
    BEFORE UPDATE ON public.master_onboarding_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_tier_configurations_updated_at
    BEFORE UPDATE ON public.master_tier_configurations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_tier_engagement_model_access_updated_at
    BEFORE UPDATE ON public.master_tier_engagement_model_access
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_challenge_overage_fees_updated_at
    BEFORE UPDATE ON public.master_challenge_overage_fees
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_system_feature_access_updated_at
    BEFORE UPDATE ON public.master_system_feature_access
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for Support Types
INSERT INTO public.master_support_types (name, description, service_level, response_time, availability) VALUES
('Basic Support', 'Basic uptime monitoring and system maintenance', 'basic', 'Best effort', 'Business hours only'),
('Priority Support', 'Priority response with faster issue resolution', 'priority', '24-48 hours', 'Extended business hours'),
('Dedicated Support', '24/7 dedicated support team with immediate response', 'dedicated', '1-4 hours', '24/7 availability');

-- Insert initial data for Analytics Access Types
INSERT INTO public.master_analytics_access_types (name, description, features_included, dashboard_access) VALUES
('No Analytics', 'No analytics or reporting access', '[]', false),
('Basic Reports', 'Basic reporting and analytics', '["basic_reports", "challenge_summary", "participation_metrics"]', true),
('Advanced Dashboards', 'Advanced analytics with custom dashboards', '["advanced_reports", "custom_dashboards", "real_time_analytics", "export_capabilities"]', true);

-- Insert initial data for Workflow Templates
INSERT INTO public.master_workflow_templates (name, description, template_type, customization_level, template_count) VALUES
('Fixed Template', 'Single fixed workflow template', 'fixed', 'none', 1),
('Template Options', 'Choose from multiple predefined templates', 'predefined', 'limited', 3),
('Full Customization', 'Full control over workflow steps and fields', 'custom', 'complete', 0);

-- Insert initial data for Onboarding Types
INSERT INTO public.master_onboarding_types (name, description, service_type, resources_included) VALUES
('Self Service', 'No dedicated onboarding support', 'self_service', '[]'),
('Standard Onboarding', 'Webinars, tutorials, and FAQ support', 'standard', '["webinars", "tutorials", "faqs", "email_support"]'),
('Personalized Onboarding', 'Dedicated onboarding specialist with personalized guidance', 'personalized', '["dedicated_specialist", "custom_training", "live_sessions", "priority_support"]');