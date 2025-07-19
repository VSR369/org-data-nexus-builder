
-- Enhance the solution_seekers_comprehensive_view to include comprehensive data
DROP VIEW IF EXISTS solution_seekers_comprehensive_view;

CREATE VIEW solution_seekers_comprehensive_view AS
SELECT 
    o.id,
    o.organization_id,
    o.organization_name,
    o.contact_person_name,
    o.email,
    o.phone_number,
    o.country_code,
    o.address,
    o.website,
    o.user_id,
    o.created_at,
    o.updated_at,
    
    -- Organization classification
    ot.name as organization_type,
    et.name as entity_type,
    c.name as country,
    ind.name as industry_segment,
    
    -- Membership and engagement data from engagement_activations
    COALESCE(ea.membership_status, 'Not Active') as membership_status,
    COALESCE(ea.activation_status, 'Not Activated') as activation_status,
    ea.pricing_tier,
    ea.engagement_model,
    ea.payment_simulation_status,
    ea.workflow_step,
    ea.workflow_completed,
    
    -- Payment details
    ea.mem_payment_amount,
    ea.mem_payment_currency,
    ea.mem_payment_date,
    ea.mem_receipt_number,
    ea.mem_payment_method,
    ea.mem_payment_status,
    ea.selected_frequency,
    ea.current_frequency,
    ea.frequency_payments,
    ea.frequency_change_history,
    ea.total_payments_made,
    ea.last_payment_date,
    
    -- Tier and engagement details
    ea.tier_features,
    ea.engagement_model_details,
    ea.pricing_locked,
    ea.engagement_locked,
    ea.platform_fee_percentage,
    ea.updated_platform_fee_percentage,
    ea.discount_percentage,
    ea.final_calculated_price,
    
    -- Terms acceptance
    ea.mem_terms,
    ea.enm_terms,
    ea.terms_accepted,
    
    -- Workflow and timing
    ea.tier_selected_at,
    ea.engagement_model_selected_at,
    ea.lock_date,
    
    -- Administrative flags
    CASE WHEN o.user_id IS NOT NULL THEN true ELSE false END as has_user_account,
    CASE WHEN ea.id IS NOT NULL THEN true ELSE false END as has_engagement_record,
    
    -- Overall status determination
    CASE 
        WHEN ea.membership_status = 'Active Member' AND ea.activation_status = 'Activated' THEN 'Active Member'
        WHEN ea.membership_status = 'Member' AND ea.activation_status IN ('Pending Activation', 'Partially Activated') THEN 'Pending Activation'
        WHEN o.user_id IS NOT NULL AND ea.id IS NULL THEN 'Registered - No Engagement'
        WHEN o.user_id IS NOT NULL THEN 'Registration Only'
        ELSE 'Registration Only'
    END as overall_status,
    
    -- Last activity (most recent of created, updated, or engagement activity)
    GREATEST(
        o.created_at,
        o.updated_at,
        COALESCE(ea.updated_at, o.created_at)
    ) as last_activity

FROM organizations o
LEFT JOIN master_organization_types ot ON ot.id = o.organization_type_id
LEFT JOIN master_entity_types et ON et.id = o.entity_type_id  
LEFT JOIN master_countries c ON c.id = o.country_id
LEFT JOIN master_industry_segments ind ON ind.id = o.industry_segment_id
LEFT JOIN LATERAL (
    SELECT * FROM engagement_activations 
    WHERE user_id = o.user_id 
    ORDER BY updated_at DESC 
    LIMIT 1
) ea ON true;

-- Create function to get comprehensive organization data with detailed breakdowns
CREATE OR REPLACE FUNCTION get_comprehensive_organization_data(org_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    org_data jsonb;
    membership_fees jsonb;
    tier_config jsonb;
    engagement_details jsonb;
    pricing_config jsonb;
BEGIN
    -- Get basic organization data
    SELECT to_jsonb(scv.*) INTO org_data
    FROM solution_seekers_comprehensive_view scv
    WHERE scv.organization_id = org_id;
    
    IF org_data IS NULL THEN
        RETURN jsonb_build_object('error', 'Organization not found');
    END IF;
    
    -- Get membership fees for this organization's country, org type, and entity type
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', smf.id,
            'country', smf.country,
            'organization_type', smf.organization_type,
            'entity_type', smf.entity_type,
            'monthly_amount', smf.monthly_amount,
            'monthly_currency', smf.monthly_currency,
            'quarterly_amount', smf.quarterly_amount,
            'quarterly_currency', smf.quarterly_currency,
            'half_yearly_amount', smf.half_yearly_amount,
            'half_yearly_currency', smf.half_yearly_currency,
            'annual_amount', smf.annual_amount,
            'annual_currency', smf.annual_currency,
            'description', smf.description
        )
    ) INTO membership_fees
    FROM master_seeker_membership_fees smf
    WHERE smf.country = (org_data->>'country')
        AND smf.organization_type = (org_data->>'organization_type')
        AND smf.entity_type = (org_data->>'entity_type');
    
    -- Get tier configuration details if pricing tier is set
    IF org_data->>'pricing_tier' IS NOT NULL THEN
        SELECT jsonb_build_object(
            'tier_info', jsonb_build_object(
                'name', pt.name,
                'description', pt.description,
                'level_order', pt.level_order
            ),
            'configurations', jsonb_agg(
                jsonb_build_object(
                    'country', c.name,
                    'currency', curr.code,
                    'monthly_challenge_limit', tc.monthly_challenge_limit,
                    'solutions_per_challenge', tc.solutions_per_challenge,
                    'allows_overage', tc.allows_overage,
                    'fixed_charge_per_challenge', tc.fixed_charge_per_challenge,
                    'support_type', st.name,
                    'support_level', st.service_level,
                    'support_availability', st.availability,
                    'support_response_time', st.response_time,
                    'analytics_access', at.name,
                    'analytics_features', at.features_included,
                    'analytics_dashboard_access', at.dashboard_access,
                    'onboarding_type', ot.name,
                    'onboarding_service_type', ot.service_type,
                    'onboarding_resources', ot.resources_included,
                    'workflow_template', wt.name,
                    'workflow_customization_level', wt.customization_level,
                    'workflow_template_count', wt.template_count
                )
            )
        ) INTO tier_config
        FROM master_pricing_tiers pt
        LEFT JOIN master_tier_configurations tc ON tc.pricing_tier_id = pt.id
        LEFT JOIN master_countries c ON c.id = tc.country_id
        LEFT JOIN master_currencies curr ON curr.id = tc.currency_id
        LEFT JOIN master_support_types st ON st.id = tc.support_type_id
        LEFT JOIN master_analytics_access_types at ON at.id = tc.analytics_access_id
        LEFT JOIN master_onboarding_types ot ON ot.id = tc.onboarding_type_id
        LEFT JOIN master_workflow_templates wt ON wt.id = tc.workflow_template_id
        WHERE pt.name = (org_data->>'pricing_tier')
        GROUP BY pt.id, pt.name, pt.description, pt.level_order;
    END IF;
    
    -- Get engagement model details with complexity and fee information
    IF org_data->>'engagement_model' IS NOT NULL THEN
        SELECT jsonb_build_object(
            'model_info', jsonb_build_object(
                'name', em.name,
                'description', em.description
            ),
            'complexity_levels', jsonb_agg(
                DISTINCT jsonb_build_object(
                    'name', cc.name,
                    'description', cc.description,
                    'level_order', cc.level_order,
                    'consulting_fee_multiplier', cc.consulting_fee_multiplier,
                    'management_fee_multiplier', cc.management_fee_multiplier
                )
            ),
            'platform_fee_formulas', jsonb_agg(
                DISTINCT jsonb_build_object(
                    'formula_name', pff.formula_name,
                    'description', pff.description,
                    'formula_expression', pff.formula_expression,
                    'base_consulting_fee', pff.base_consulting_fee,
                    'base_management_fee', pff.base_management_fee,
                    'platform_usage_fee_percentage', pff.platform_usage_fee_percentage,
                    'advance_payment_percentage', pff.advance_payment_percentage,
                    'membership_discount_percentage', pff.membership_discount_percentage,
                    'country', c.name,
                    'currency', curr.code
                )
            ),
            'subtypes', jsonb_agg(
                DISTINCT jsonb_build_object(
                    'name', ems.name,
                    'description', ems.description,
                    'required_fields', ems.required_fields,
                    'optional_fields', ems.optional_fields
                )
            )
        ) INTO engagement_details
        FROM master_engagement_models em
        LEFT JOIN master_challenge_complexity cc ON true
        LEFT JOIN master_platform_fee_formulas pff ON pff.engagement_model_id = em.id
        LEFT JOIN master_countries c ON c.id = pff.country_id
        LEFT JOIN master_currencies curr ON curr.id = pff.currency_id
        LEFT JOIN master_engagement_model_subtypes ems ON ems.engagement_model_id = em.id
        WHERE em.name = (org_data->>'engagement_model')
        GROUP BY em.id, em.name, em.description;
    END IF;
    
    -- Get pricing configurations
    SELECT jsonb_agg(
        jsonb_build_object(
            'config_name', pc.config_name,
            'base_value', pc.base_value,
            'calculated_value', pc.calculated_value,
            'unit_symbol', pc.unit_symbol,
            'currency_code', pc.currency_code,
            'membership_discount', pc.membership_discount_percentage,
            'billing_frequency', pc.billing_frequency,
            'effective_from', pc.effective_from,
            'effective_to', pc.effective_to
        )
    ) INTO pricing_config
    FROM pricing_configurations_detailed pc
    WHERE pc.country_name = (org_data->>'country')
        AND pc.organization_type = (org_data->>'organization_type')
        AND pc.entity_type = (org_data->>'entity_type')
        AND (org_data->>'engagement_model' IS NULL OR pc.engagement_model = (org_data->>'engagement_model'))
        AND pc.is_active = true;
    
    -- Build comprehensive result
    result := jsonb_build_object(
        'organization', org_data,
        'membership_fees', COALESCE(membership_fees, '[]'::jsonb),
        'tier_configuration', COALESCE(tier_config, '{}'::jsonb),
        'engagement_model_details', COALESCE(engagement_details, '{}'::jsonb),
        'pricing_configurations', COALESCE(pricing_config, '[]'::jsonb)
    );
    
    RETURN result;
END;
$$;
