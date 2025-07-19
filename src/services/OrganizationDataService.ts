import { supabase } from "@/integrations/supabase/client";

export interface OrganizationComprehensiveData {
  organization_pk_id: string;
  organization_id: string;
  user_id: string;
  organization_name: string;
  contact_person_name: string;
  email: string;
  phone_number: string;
  address: string;
  website: string;
  country_name: string;
  country_code: string;
  organization_type_name: string;
  entity_type_name: string;
  industry_segment_name: string;
  membership_status: string;
  pricing_tier: string;
  engagement_model: string;
  payment_amount: number;
  payment_currency: string;
  payment_status: string;
  selected_frequency: string;
  final_calculated_price: number;
  discount_percentage: number;
  registration_date: string;
  last_updated: string;
}

export class OrganizationDataService {
  private static cache = new Map<string, { data: OrganizationComprehensiveData; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Retrieves comprehensive organization data by organization ID or user ID
   * Uses optimized queries and caching for performance
   */
  static async getComprehensiveData(identifier: string): Promise<OrganizationComprehensiveData | null> {
    try {
      // Check cache first
      const cached = this.cache.get(identifier);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      // Query organizations and engagement data with joins
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select(`
          id,
          organization_id,
          user_id,
          organization_name,
          contact_person_name,
          email,
          phone_number,
          address,
          website,
          master_countries!organizations_country_id_fkey(name, code),
          master_organization_types!organizations_organization_type_id_fkey(name),
          master_entity_types!organizations_entity_type_id_fkey(name),
          master_industry_segments!organizations_industry_segment_id_fkey(name)
        `)
        .or(`organization_id.eq.${identifier},user_id.eq.${identifier}`)
        .single();

      if (orgError || !orgData) {
        console.error('Error fetching organization data:', orgError);
        return null;
      }

      // Get engagement activation data
      const { data: engagementData } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', orgData.user_id)
        .eq('membership_status', 'Active')
        .single();

      // Construct comprehensive data object
      const organizationData: OrganizationComprehensiveData = {
        organization_pk_id: orgData.id,
        organization_id: orgData.organization_id,
        user_id: orgData.user_id,
        organization_name: orgData.organization_name || '',
        contact_person_name: orgData.contact_person_name || '',
        email: orgData.email || '',
        phone_number: orgData.phone_number || '',
        address: orgData.address || '',
        website: orgData.website || '',
        country_name: (orgData.master_countries as any)?.name || '',
        country_code: (orgData.master_countries as any)?.code || '',
        organization_type_name: (orgData.master_organization_types as any)?.name || '',
        entity_type_name: (orgData.master_entity_types as any)?.name || '',
        industry_segment_name: (orgData.master_industry_segments as any)?.name || '',
        membership_status: engagementData?.membership_status || 'Inactive',
        pricing_tier: engagementData?.pricing_tier || '',
        engagement_model: engagementData?.engagement_model || '',
        payment_amount: engagementData?.mem_payment_amount || 0,
        payment_currency: engagementData?.mem_payment_currency || '',
        payment_status: engagementData?.mem_payment_status || '',
        selected_frequency: engagementData?.selected_frequency || '',
        final_calculated_price: engagementData?.final_calculated_price || 0,
        discount_percentage: engagementData?.discount_percentage || 0,
        registration_date: engagementData?.created_at || '',
        last_updated: engagementData?.updated_at || ''
      };
      
      // Cache the result
      this.cache.set(identifier, {
        data: organizationData,
        timestamp: Date.now()
      });

      return organizationData;
    } catch (error) {
      console.error('Error in getComprehensiveData:', error);
      return null;
    }
  }

  /**
   * Retrieves organization data by user ID (authenticated user context)
   */
  static async getByUserId(userId: string): Promise<OrganizationComprehensiveData | null> {
    return this.getComprehensiveData(userId);
  }

  /**
   * Retrieves organization data by organization ID
   */
  static async getByOrganizationId(orgId: string): Promise<OrganizationComprehensiveData | null> {
    return this.getComprehensiveData(orgId);
  }

  /**
   * Retrieves current user's organization data
   */
  static async getCurrentUserData(): Promise<OrganizationComprehensiveData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      return this.getByUserId(user.id);
    } catch (error) {
      console.error('Error getting current user data:', error);
      return null;
    }
  }

  /**
   * Updates organization basic information
   */
  static async updateOrganization(organizationId: string, updates: Partial<{
    organization_name: string;
    contact_person_name: string;
    email: string;
    phone_number: string;
    address: string;
    website: string;
  }>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('organization_id', organizationId);

      if (error) {
        console.error('Error updating organization:', error);
        return false;
      }

      // Clear cache after update
      this.clearCache(organizationId);
      return true;
    } catch (error) {
      console.error('Error in updateOrganization:', error);
      return false;
    }
  }

  /**
   * Updates membership and engagement details
   */
  static async updateEngagementActivation(userId: string, updates: Partial<{
    membership_status: string;
    pricing_tier: string;
    engagement_model: string;
    mem_payment_amount: number;
    mem_payment_currency: string;
    mem_payment_status: string;
    selected_frequency: string;
    final_calculated_price: number;
    discount_percentage: number;
  }>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('engagement_activations')
        .update(updates)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating engagement activation:', error);
        return false;
      }

      // Clear cache after update
      this.clearCacheByUserId(userId);
      return true;
    } catch (error) {
      console.error('Error in updateEngagementActivation:', error);
      return false;
    }
  }

  /**
   * Clears cache for specific identifier
   */
  static clearCache(identifier: string): void {
    this.cache.delete(identifier);
  }

  /**
   * Clears cache by user ID (also tries to clear by org ID if available)
   */
  static clearCacheByUserId(userId: string): void {
    // Clear by user ID
    this.cache.delete(userId);
    
    // Also try to find and clear by organization ID
    for (const [key, value] of this.cache.entries()) {
      if (value.data.user_id === userId) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears entire cache
   */
  static clearAllCache(): void {
    this.cache.clear();
  }

  /**
   * Validates organization ID format
   */
  static isValidOrganizationId(orgId: string): boolean {
    return /^ORG-[A-Z0-9]{8}$/.test(orgId);
  }

  /**
   * Validates membership status
   */
  static isValidMembershipStatus(status: string): boolean {
    return ['Active', 'Inactive', 'Pending', 'Suspended'].includes(status);
  }
}