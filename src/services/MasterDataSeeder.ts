import { supabase } from '@/integrations/supabase/client';

export class MasterDataSeeder {
  /**
   * Seeds all default master data
   */
  static async seedAllMasterData(): Promise<void> {
    console.log('Starting master data seeding...');
    
    try {
      await Promise.all([
        this.seedPricingTiers(),
        this.seedEngagementModelSubtypes(),
        this.seedFeeComponents(),
        this.seedPlatformFeeFormulas(),
        this.seedAdvancePaymentTypes(),
        this.seedSystemConfigurations(),
        this.seedPricingParameters(),
      ]);
      
      console.log('Master data seeding completed successfully');
    } catch (error) {
      console.error('Master data seeding failed:', error);
      throw error;
    }
  }

  /**
   * Seeds default pricing tiers
   */
  private static async seedPricingTiers(): Promise<void> {
    const defaultTiers = [
      {
        name: 'Basic',
        description: 'Basic tier with limited engagement models',
        level_order: 1,
        is_active: true,
      },
      {
        name: 'Standard',
        description: 'Standard tier with most engagement models',
        level_order: 2,
        is_active: true,
      },
      {
        name: 'Premium',
        description: 'Premium tier with all engagement models',
        level_order: 3,
        is_active: true,
      },
      {
        name: 'Enterprise',
        description: 'Enterprise tier with custom engagement models',
        level_order: 4,
        is_active: true,
      },
    ];

    const { error } = await supabase
      .from('master_pricing_tiers')
      .upsert(defaultTiers, { onConflict: 'name' });

    if (error) throw error;
    console.log('✓ Pricing tiers seeded');
  }

  /**
   * Seeds engagement model subtypes
   */
  private static async seedEngagementModelSubtypes(): Promise<void> {
    // First get engagement models
    const { data: engagementModels } = await supabase
      .from('master_engagement_models')
      .select('id, name');

    if (!engagementModels?.length) {
      console.log('⚠ No engagement models found, skipping subtypes seeding');
      return;
    }

    const defaultSubtypes = engagementModels.flatMap((model: any) => [
      {
        name: `${model.name} - Basic`,
        description: `Basic ${model.name} with standard requirements`,
        engagement_model_id: model.id,
        required_fields: ['scope_of_work', 'timeline'],
        optional_fields: ['budget_range', 'preferred_location'],
        is_active: true,
      },
      {
        name: `${model.name} - Advanced`,
        description: `Advanced ${model.name} with additional requirements`,
        engagement_model_id: model.id,
        required_fields: ['scope_of_work', 'timeline', 'budget_range', 'deliverables'],
        optional_fields: ['preferred_location', 'team_size', 'technology_stack'],
        is_active: true,
      },
    ]);

    const { error } = await supabase
      .from('master_engagement_model_subtypes')
      .upsert(defaultSubtypes, { onConflict: 'name,engagement_model_id' });

    if (error) throw error;
    console.log('✓ Engagement model subtypes seeded');
  }

  /**
   * Seeds fee components (should already exist from migration)
   */
  private static async seedFeeComponents(): Promise<void> {
    const { data: existing } = await supabase
      .from('master_fee_components')
      .select('name');

    if (existing?.length) {
      console.log('✓ Fee components already seeded');
      return;
    }

    const defaultComponents = [
      {
        name: 'Management Fee',
        component_type: 'management_fee',
        description: 'Fee for managing the engagement',
        is_active: true,
      },
      {
        name: 'Consulting Fee',
        component_type: 'consulting_fee',
        description: 'Fee for consulting services',
        is_active: true,
      },
      {
        name: 'Platform Fee',
        component_type: 'platform_fee',
        description: 'Platform usage fee',
        is_active: true,
      },
      {
        name: 'Advance Payment',
        component_type: 'advance_payment',
        description: 'Advance payment requirement',
        is_active: true,
      },
    ];

    const { error } = await supabase
      .from('master_fee_components')
      .insert(defaultComponents);

    if (error) throw error;
    console.log('✓ Fee components seeded');
  }

  /**
   * Seeds platform fee formulas
   */
  private static async seedPlatformFeeFormulas(): Promise<void> {
    const { data: engagementModels } = await supabase
      .from('master_engagement_models')
      .select('id, name');

    if (!engagementModels?.length) {
      console.log('⚠ No engagement models found, skipping formulas seeding');
      return;
    }

    const defaultFormulas = engagementModels.map((model: any) => ({
      formula_name: `${model.name} Platform Fee`,
      engagement_model_id: model.id,
      formula_expression: 'base_value * country_multiplier * (1 - tier_discount / 100) + fixed_fee',
      description: `Dynamic platform fee calculation for ${model.name}`,
      variables: {
        country_multiplier: {
          type: 'number',
          default_value: 1,
          description: 'Country-specific multiplier'
        },
        tier_discount: {
          type: 'number',
          default_value: 0,
          description: 'Tier-based discount percentage'
        },
        fixed_fee: {
          type: 'number',
          default_value: 50,
          description: 'Fixed platform fee component'
        }
      },
      is_active: true,
    }));

    const { error } = await supabase
      .from('master_platform_fee_formulas')
      .upsert(defaultFormulas, { onConflict: 'formula_name' });

    if (error) throw error;
    console.log('✓ Platform fee formulas seeded');
  }

  /**
   * Seeds advance payment types
   */
  private static async seedAdvancePaymentTypes(): Promise<void> {
    const defaultTypes = [
      {
        name: 'No Advance',
        percentage_of_platform_fee: 0,
        description: 'No advance payment required',
        is_active: true,
      },
      {
        name: 'Standard Advance',
        percentage_of_platform_fee: 25,
        description: '25% of platform fee as advance payment',
        is_active: true,
      },
      {
        name: 'High Advance',
        percentage_of_platform_fee: 50,
        description: '50% of platform fee as advance payment',
        is_active: true,
      },
      {
        name: 'Full Advance',
        percentage_of_platform_fee: 100,
        description: '100% of platform fee as advance payment',
        is_active: true,
      },
    ];

    const { error } = await supabase
      .from('master_advance_payment_types')
      .upsert(defaultTypes, { onConflict: 'name' });

    if (error) throw error;
    console.log('✓ Advance payment types seeded');
  }

  /**
   * Seeds system configurations (should already exist from migration)
   */
  private static async seedSystemConfigurations(): Promise<void> {
    const { data: existing } = await supabase
      .from('master_system_configurations')
      .select('config_key');

    if (existing?.length) {
      console.log('✓ System configurations already seeded');
      return;
    }

    const defaultConfigs = [
      {
        config_key: 'default_currency',
        config_value: 'USD',
        data_type: 'string',
        description: 'Default currency for pricing calculations',
        category: 'pricing',
        is_system_config: true,
      },
      {
        config_key: 'platform_fee_calculation_enabled',
        config_value: 'true',
        data_type: 'boolean',
        description: 'Enable platform fee formula calculations',
        category: 'pricing',
        is_system_config: true,
      },
      {
        config_key: 'advance_payment_enabled',
        config_value: 'true',
        data_type: 'boolean',
        description: 'Enable advance payment calculations',
        category: 'pricing',
        is_system_config: true,
      },
      {
        config_key: 'default_platform_fee_percentage',
        config_value: '10',
        data_type: 'number',
        description: 'Default platform fee percentage when no formula is available',
        category: 'pricing',
        is_system_config: true,
      },
    ];

    const { error } = await supabase
      .from('master_system_configurations')
      .insert(defaultConfigs);

    if (error) throw error;
    console.log('✓ System configurations seeded');
  }

  /**
   * Seeds sample pricing parameters
   */
  private static async seedPricingParameters(): Promise<void> {
    const { data: countries } = await supabase
      .from('master_countries')
      .select('id, name')
      .limit(5);

    const { data: currencies } = await supabase
      .from('master_currencies')
      .select('id, code')
      .limit(5);

    const { data: orgTypes } = await supabase
      .from('master_organization_types')
      .select('id, name')
      .limit(3);

    const { data: entityTypes } = await supabase
      .from('master_entity_types')
      .select('id, name')
      .limit(3);

    const { data: feeComponents } = await supabase
      .from('master_fee_components')
      .select('id, component_type');

    const { data: unitsOfMeasure } = await supabase
      .from('master_units_of_measure')
      .select('id, name')
      .limit(2);

    if (!countries?.length || !currencies?.length || !orgTypes?.length || 
        !entityTypes?.length || !feeComponents?.length || !unitsOfMeasure?.length) {
      console.log('⚠ Missing required master data for pricing parameters seeding');
      return;
    }

    // Create sample parameters for each combination
    const defaultParameters = [];
    
    for (const country of countries.slice(0, 2)) {
      for (const orgType of orgTypes.slice(0, 2)) {
        for (const entityType of entityTypes.slice(0, 2)) {
          for (const feeComponent of feeComponents) {
            let amount = 100; // Default amount
            
            // Set different amounts based on fee component type
            switch (feeComponent.component_type) {
              case 'management_fee':
                amount = 150;
                break;
              case 'consulting_fee':
                amount = 75;
                break;
              case 'platform_fee':
                amount = 50;
                break;
              case 'advance_payment':
                amount = 25;
                break;
            }

            defaultParameters.push({
              country_id: country.id,
              currency_id: currencies[0].id, // Use first currency
              organization_type_id: orgType.id,
              entity_type_id: entityType.id,
              fee_component_id: feeComponent.id,
              amount: amount,
              unit_of_measure_id: unitsOfMeasure[0].id, // Use first unit
              is_active: true,
            });
          }
        }
      }
    }

    const { error } = await supabase
      .from('master_pricing_parameters')
      .insert(defaultParameters);

    if (error) throw error;
    console.log('✓ Pricing parameters seeded');
  }

  /**
   * Seeds tier engagement model restrictions
   */
  static async seedTierEngagementRestrictions(): Promise<void> {
    const { data: tiers } = await supabase
      .from('master_pricing_tiers')
      .select('id, name, level_order');

    const { data: models } = await supabase
      .from('master_engagement_models')
      .select('id, name');

    if (!tiers?.length || !models?.length) {
      console.log('⚠ Missing tiers or engagement models for restrictions seeding');
      return;
    }

    const restrictions = [];

    // Basic tier - restrict advanced models
    const basicTier = tiers.find(t => t.name === 'Basic');
    if (basicTier) {
      for (const model of models) {
        restrictions.push({
          pricing_tier_id: basicTier.id,
          engagement_model_id: model.id,
          is_allowed: model.name.toLowerCase().includes('basic') || 
                      model.name.toLowerCase().includes('consultation'),
        });
      }
    }

    // Standard tier - allow most models
    const standardTier = tiers.find(t => t.name === 'Standard');
    if (standardTier) {
      for (const model of models) {
        restrictions.push({
          pricing_tier_id: standardTier.id,
          engagement_model_id: model.id,
          is_allowed: !model.name.toLowerCase().includes('enterprise'),
        });
      }
    }

    // Premium and Enterprise - allow all
    const premiumTier = tiers.find(t => t.name === 'Premium');
    const enterpriseTier = tiers.find(t => t.name === 'Enterprise');

    for (const tier of [premiumTier, enterpriseTier].filter(Boolean)) {
      for (const model of models) {
        restrictions.push({
          pricing_tier_id: tier.id,
          engagement_model_id: model.id,
          is_allowed: true,
        });
      }
    }

    const { error } = await supabase
      .from('tier_engagement_model_restrictions')
      .insert(restrictions);

    if (error) throw error;
    console.log('✓ Tier engagement model restrictions seeded');
  }
}