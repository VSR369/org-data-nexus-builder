
import { supabase } from '@/integrations/supabase/client';

export class DataSynchronizationService {
  /**
   * Normalize tier and model names for consistent storage and comparison
   */
  static normalizeName(name: string): string {
    if (!name) return '';
    return name.trim().toLowerCase();
  }

  /**
   * Get normalized profile context for consistent pricing lookups
   */
  static async getNormalizedProfileContext(profile: any) {
    if (!profile) return null;

    // Map organization types to match pricing configuration keys
    const organizationTypeMapping: Record<string, string> = {
      'corporate organization': 'MSME',
      'private limited company': 'Commercial',
      'public limited company': 'Commercial',
      'partnership': 'Commercial',
      'proprietorship': 'MSME',
      'startup': 'MSME',
      'government': 'Government',
      'ngo': 'NGO'
    };

    // Map entity types for consistency
    const entityTypeMapping: Record<string, string> = {
      'private limited company': 'Private Limited Company',
      'public limited company': 'Public Limited Company',
      'partnership firm': 'Partnership',
      'sole proprietorship': 'Proprietorship',
      'startup': 'Startup',
      'government entity': 'Government',
      'non-profit organization': 'NGO'
    };

    const normalizedOrgType = organizationTypeMapping[profile.organization_type?.toLowerCase()] || profile.organization_type;
    const normalizedEntityType = entityTypeMapping[profile.entity_type?.toLowerCase()] || profile.entity_type;

    return {
      country: profile.country || 'India',
      organization_type: normalizedOrgType,
      entity_type: normalizedEntityType,
      original_profile: profile
    };
  }

  /**
   * Get current saved selections from engagement_activations (single source of truth)
   */
  static async getCurrentSelections(userId: string) {
    try {
      const { data: activationRecord, error } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching current selections:', error);
        return null;
      }

      return activationRecord;
    } catch (error) {
      console.error('❌ Error in getCurrentSelections:', error);
      return null;
    }
  }

  /**
   * Validate if saved selections are still valid against master data
   */
  static async validateSavedSelections(savedSelections: any, profileContext: any) {
    if (!savedSelections || !profileContext) return { isValid: false, issues: [] };

    const issues: string[] = [];
    let isValid = true;

    try {
      // Validate tier exists and is active
      if (savedSelections.pricing_tier) {
        const { data: tierData } = await supabase
          .from('master_pricing_tiers')
          .select('id, name, is_active')
          .ilike('name', savedSelections.pricing_tier)
          .single();

        if (!tierData || !tierData.is_active) {
          issues.push(`Pricing tier "${savedSelections.pricing_tier}" is no longer available`);
          isValid = false;
        }
      }

      // Validate engagement model exists and is active
      if (savedSelections.engagement_model) {
        const { data: modelData } = await supabase
          .from('master_engagement_models')
          .select('id, name')
          .ilike('name', savedSelections.engagement_model)
          .single();

        if (!modelData) {
          issues.push(`Engagement model "${savedSelections.engagement_model}" is no longer available`);
          isValid = false;
        }
      }

      // Validate tier-model combination is still allowed
      if (savedSelections.pricing_tier && savedSelections.engagement_model && isValid) {
        const { data: tierData } = await supabase
          .from('master_pricing_tiers')
          .select('id')
          .ilike('name', savedSelections.pricing_tier)
          .single();

        const { data: modelData } = await supabase
          .from('master_engagement_models')
          .select('id')
          .ilike('name', savedSelections.engagement_model)
          .single();

        if (tierData && modelData) {
          const { data: accessData } = await supabase
            .from('master_tier_engagement_model_access')
            .select('is_allowed, is_active')
            .eq('pricing_tier_id', tierData.id)
            .eq('engagement_model_id', modelData.id)
            .single();

          if (!accessData || !accessData.is_allowed || !accessData.is_active) {
            issues.push(`The combination of "${savedSelections.pricing_tier}" and "${savedSelections.engagement_model}" is no longer allowed`);
            isValid = false;
          }
        }
      }

    } catch (error) {
      console.error('❌ Error validating saved selections:', error);
      isValid = false;
      issues.push('Unable to validate saved selections');
    }

    return { isValid, issues };
  }

  /**
   * Synchronize and update saved selections with current profile context
   */
  static async synchronizeSelections(userId: string, profileContext: any) {
    try {
      const savedSelections = await this.getCurrentSelections(userId);
      if (!savedSelections) return null;

      const validation = await this.validateSavedSelections(savedSelections, profileContext);
      
      // If selections are still valid, update profile context in the record
      if (validation.isValid) {
        const { error } = await supabase
          .from('engagement_activations')
          .update({
            country: profileContext.country,
            organization_type: profileContext.organization_type,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) {
          console.error('❌ Error updating profile context:', error);
        }
      }

      return {
        savedSelections,
        validation,
        profileContext
      };
    } catch (error) {
      console.error('❌ Error synchronizing selections:', error);
      return null;
    }
  }
}
