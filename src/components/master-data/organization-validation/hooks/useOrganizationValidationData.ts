
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Organization {
  id: string;
  organization_name?: string;
  organization_id?: string;
  organization_type?: string;
  entity_type?: string;
  industry_segment?: string;
  country?: string;
  contact_person_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  website?: string;
  approval_status?: string;
  membership_status?: string;
  pricing_tier?: string;
  engagement_model?: string;
  created_at?: string;
  updated_at?: string;
  workflow_completed?: boolean;
  tier_features?: any;
  engagement_model_details?: any;
  mem_payment_amount?: number;
  mem_payment_currency?: string;
  mem_payment_date?: string;
  mem_payment_status?: string;
  mem_payment_method?: string;
  mem_receipt_number?: string;
  workflow_step?: string;
  tier_selected_at?: string;
  engagement_model_selected_at?: string;
}

export const useOrganizationValidationData = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrganizations = async () => {
    try {
      console.log('🔍 Fetching organization validation data...');
      setLoading(true);
      setError(null);

      // Query the solution_seekers_comprehensive_view
      const { data, error: queryError } = await supabase
        .from('solution_seekers_comprehensive_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error('❌ Error fetching organizations:', queryError);
        console.error('❌ Error details:', JSON.stringify(queryError, null, 2));
        throw queryError;
      }

      console.log('✅ Successfully fetched organizations:', data?.length || 0);
      console.log('🔍 Sample organization data:', data?.[0]);
      setOrganizations(data || []);
      
    } catch (err: any) {
      console.error('❌ Failed to fetch organization data:', err);
      setError(err.message || 'Failed to fetch organization data');
      toast({
        title: "Error Loading Data",
        description: "Failed to load organization validation data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    console.log('🔄 Refreshing organization validation data...');
    fetchOrganizations();
  };

  const exportData = () => {
    try {
      const exportData = organizations.map(org => ({
        'Organization Name': org.organization_name || '',
        'Organization ID': org.organization_id || '',
        'Organization Type': org.organization_type || '',
        'Entity Type': org.entity_type || '',
        'Industry Segment': org.industry_segment || '',
        'Country': org.country || '',
        'Contact Person': org.contact_person_name || '',
        'Email': org.email || '',
        'Phone': org.phone_number || '',
        'Website': org.website || '',
        'Approval Status': org.approval_status || '',
        'Membership Status': org.membership_status || '',
        'Pricing Tier': org.pricing_tier || '',
        'Engagement Model': org.engagement_model || '',
        'Workflow Completed': org.workflow_completed ? 'Yes' : 'No',
        'Registration Date': org.created_at || '',
        'Last Updated': org.updated_at || ''
      }));

      const csvContent = [
        Object.keys(exportData[0] || {}).join(','),
        ...exportData.map(row => Object.values(row).map(val => 
          typeof val === 'string' && val.includes(',') ? `"${val}"` : val
        ).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `organization-validation-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${organizations.length} organization records to CSV.`,
      });
    } catch (err) {
      console.error('❌ Export failed:', err);
      toast({
        title: "Export Failed",
        description: "Failed to export organization data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Set up auto-refresh every 90 seconds
  useEffect(() => {
    fetchOrganizations();

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing organization data...');
      fetchOrganizations();
    }, 90000); // 90 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    organizations,
    loading,
    error,
    refreshData,
    exportData
  };
};
