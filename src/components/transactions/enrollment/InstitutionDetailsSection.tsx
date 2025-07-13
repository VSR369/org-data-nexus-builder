
import React from 'react';
import { FormData } from './types';
import { useOrganizationTypes } from '@/hooks/useMasterDataCRUD';
import { useSupabaseMasterData } from '@/hooks/useSupabaseMasterData';
import { useDepartmentData } from './hooks/useDepartmentData';
import OrganizationForm from './components/OrganizationForm';
import DepartmentSelector from './components/DepartmentSelector';
import { useState, useEffect } from 'react';

interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

interface InstitutionDetailsSectionProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
  providerType: string;
  invalidFields?: Set<string>;
}

const InstitutionDetailsSection: React.FC<InstitutionDetailsSectionProps> = ({
  formData,
  updateFormData,
  providerType,
  invalidFields = new Set()
}) => {
  const departmentData = useDepartmentData();

  // Use Supabase hooks for master data
  const { items: organizationTypesItems } = useOrganizationTypes();
  const { countries: countriesData } = useSupabaseMasterData();
  
  // Convert to compatible formats
  const organizationTypes = organizationTypesItems.map(item => item.name);
  const countries = countriesData.map(country => country.name);

  // Only show institution details for organization provider type
  if (providerType !== 'organization') {
    return null;
  }

  const availableSubCategories = formData.departmentCategory 
    ? departmentData.subcategories[formData.departmentCategory] || []
    : [];

  const handleDepartmentCategoryChange = (value: string) => {
    updateFormData('departmentCategory', value);
    // Clear subcategory when category changes
    updateFormData('departmentSubCategory', '');
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <h4 className="font-medium">Institution Details</h4>
      
      <OrganizationForm
        formData={formData}
        updateFormData={updateFormData}
        organizationTypes={organizationTypes}
        countries={countries}
        invalidFields={invalidFields}
      />

      <DepartmentSelector
        formData={formData}
        updateFormData={updateFormData}
        departmentCategories={departmentData.categories}
        availableSubCategories={availableSubCategories}
        onDepartmentCategoryChange={handleDepartmentCategoryChange}
      />
    </div>
  );
};

export default InstitutionDetailsSection;
