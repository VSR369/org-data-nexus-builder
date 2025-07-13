import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OrganizationFormData, OrganizationFormErrors, MasterDataItem, FileUploadProgress } from '@/types/organizationRegistration';

export const useOrganizationRegistration = () => {
  const [formData, setFormData] = useState<OrganizationFormData>({
    organizationName: '',
    organizationId: '',
    organizationTypeId: '',
    entityTypeId: '',
    industrySegmentId: '',
    companyProfileDocument: null,
    companyLogo: null,
    website: '',
    countryId: '',
    address: '',
    contactPersonName: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<OrganizationFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress>({});
  
  // Master data states
  const [countries, setCountries] = useState<MasterDataItem[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<MasterDataItem[]>([]);
  const [entityTypes, setEntityTypes] = useState<MasterDataItem[]>([]);
  const [industrySegments, setIndustrySegments] = useState<MasterDataItem[]>([]);
  const [masterDataLoading, setMasterDataLoading] = useState(true);

  // Load master data from Supabase
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [countriesResult, orgTypesResult, entityTypesResult, industrySegmentsResult] = await Promise.all([
          supabase.from('master_countries').select('id, name, code'),
          supabase.from('master_organization_types').select('id, name'),
          supabase.from('master_entity_types').select('id, name'),
          supabase.from('master_industry_segments').select('id, name')
        ]);

        if (countriesResult.data) setCountries(countriesResult.data);
        if (orgTypesResult.data) setOrganizationTypes(orgTypesResult.data);
        if (entityTypesResult.data) setEntityTypes(entityTypesResult.data);
        if (industrySegmentsResult.data) setIndustrySegments(industrySegmentsResult.data);
      } catch (error) {
        console.error('Error loading master data:', error);
      } finally {
        setMasterDataLoading(false);
      }
    };

    loadMasterData();
  }, []);

  // Auto-populate country code when country changes
  useEffect(() => {
    if (formData.countryId) {
      const selectedCountry = countries.find(c => c.id === formData.countryId);
      if (selectedCountry?.code) {
        setFormData(prev => ({ ...prev, countryCode: selectedCountry.code || '' }));
      }
    }
  }, [formData.countryId, countries]);

  const handleInputChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: 'companyProfileDocument' | 'companyLogo', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: OrganizationFormErrors = {};

    if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization name is required';
    if (!formData.organizationTypeId) newErrors.organizationTypeId = 'Organization type is required';
    if (!formData.entityTypeId) newErrors.entityTypeId = 'Entity type is required';
    if (!formData.industrySegmentId) newErrors.industrySegmentId = 'Industry segment is required';
    if (!formData.countryId) newErrors.countryId = 'Country is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Contact person name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email format is invalid';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 3) newErrors.password = 'Password must be at least 3 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const uploadFile = async (file: File, bucket: string, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    return data.path;
  };

  const submitRegistration = async (): Promise<{ success: boolean; organizationId?: string; error?: string }> => {
    if (!validateForm()) {
      return { success: false, error: 'Please fix form errors' };
    }

    setIsLoading(true);
    try {
      // Create Supabase Auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            organization_name: formData.organizationName,
            contact_person_name: formData.contactPersonName
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setErrors({ email: 'Email already registered' });
          return { success: false, error: 'Email already registered' };
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Upload files if provided
      let companyProfilePath = '';
      let companyLogoPath = '';

      if (formData.companyProfileDocument) {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${formData.companyProfileDocument.name}`;
        companyProfilePath = await uploadFile(
          formData.companyProfileDocument,
          'organization-documents',
          fileName
        );
      }

      if (formData.companyLogo) {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${formData.companyLogo.name}`;
        companyLogoPath = await uploadFile(
          formData.companyLogo,
          'organization-logos',
          fileName
        );
      }

      // Insert organization record using direct insert with type assertion
      const organizationData = {
        user_id: authData.user.id,
        organization_name: formData.organizationName,
        organization_type_id: formData.organizationTypeId,
        entity_type_id: formData.entityTypeId,
        industry_segment_id: formData.industrySegmentId,
        website: formData.website || null,
        country_id: formData.countryId,
        address: formData.address,
        contact_person_name: formData.contactPersonName,
        email: formData.email,
        country_code: formData.countryCode,
        phone_number: formData.phoneNumber,
        registration_status: 'pending'
      };

      const { data: orgData, error: insertError } = await supabase
        .from('organizations')
        .insert(organizationData as any)
        .select('id, organization_id')
        .single();

      if (insertError) throw insertError;

      // Insert document records
      const documentInserts = [];
      if (companyProfilePath && orgData) {
        documentInserts.push({
          organization_id: orgData.id,
          document_type: 'company_profile',
          file_name: formData.companyProfileDocument!.name,
          file_path: companyProfilePath,
          file_size: formData.companyProfileDocument!.size,
          file_type: formData.companyProfileDocument!.type
        });
      }

      if (companyLogoPath && orgData) {
        documentInserts.push({
          organization_id: orgData.id,
          document_type: 'company_logo',
          file_name: formData.companyLogo!.name,
          file_path: companyLogoPath,
          file_size: formData.companyLogo!.size,
          file_type: formData.companyLogo!.type
        });
      }

      if (documentInserts.length > 0) {
        const { error: docError } = await supabase
          .from('organization_documents')
          .insert(documentInserts as any);
        
        if (docError) throw docError;
      }

      return { success: true, organizationId: orgData?.organization_id };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    uploadProgress,
    countries,
    organizationTypes,
    entityTypes,
    industrySegments,
    masterDataLoading,
    handleInputChange,
    handleFileChange,
    validateForm,
    submitRegistration
  };
};