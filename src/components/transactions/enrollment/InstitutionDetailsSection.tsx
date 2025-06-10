
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from './types';
import { departmentsDataManager, organizationTypesDataManager, countriesDataManager } from '@/utils/sharedDataManagers';
import { cn } from "@/lib/utils";

interface InstitutionDetailsSectionProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
  providerType: string;
  invalidFields?: Set<string>;
}

// Department master data structure that matches DepartmentConfig
interface DepartmentData {
  categories: string[];
  subcategories: {
    [category: string]: string[];
  };
}

const InstitutionDetailsSection: React.FC<InstitutionDetailsSectionProps> = ({
  formData,
  updateFormData,
  providerType,
  invalidFields = new Set()
}) => {
  const [departmentData, setDepartmentData] = useState<DepartmentData>({
    categories: [],
    subcategories: {}
  });
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  // Only show institution details for organization provider type
  if (providerType !== 'organization') {
    return null;
  }

  // Load master data on component mount
  useEffect(() => {
    // Try to load the structured department data from localStorage
    // This should match the structure used in DepartmentConfig
    const departmentConfigKey = 'department_master_data';
    const storedDepartmentData = localStorage.getItem(departmentConfigKey);
    
    if (storedDepartmentData) {
      try {
        const parsedData = JSON.parse(storedDepartmentData);
        console.log('Loaded structured department data from master data:', parsedData);
        setDepartmentData(parsedData);
      } catch (error) {
        console.error('Error parsing department master data:', error);
        // Fallback to default structure
        setDepartmentData({
          categories: [
            'Core Business Functions',
            'Corporate Support Functions',
            'Technology & Digital Functions',
            'Industry-Specific or Specialized Departments'
          ],
          subcategories: {
            'Core Business Functions': [
              'Strategy & Planning',
              'Sales & Business Development',
              'Marketing & Communications',
              'Product Management',
              'Operations / Service Delivery',
              'Customer Support / Success',
              'Research & Development (R&D)',
              'Supply Chain & Procurement',
              'Project / Program Management Office (PMO)'
            ],
            'Corporate Support Functions': [
              'Finance & Accounting',
              'Human Resources (HR)',
              'Legal & Compliance',
              'Administration & Facilities Management',
              'Internal Audit & Risk Management'
            ],
            'Technology & Digital Functions': [
              'Information Technology (IT)',
              'Enterprise Architecture',
              'Data & Analytics / Business Intelligence',
              'Cybersecurity & Information Security',
              'Digital Transformation Office / Innovation Lab',
              'DevOps / Infrastructure & Cloud Services'
            ],
            'Industry-Specific or Specialized Departments': [
              'Quality Assurance / Regulatory Affairs (e.g., Pharma, Manufacturing)',
              'Clinical Affairs (e.g., Healthcare, MedTech)',
              'Merchandising & Category Management (Retail)',
              'Content / Editorial / Creative (Media & EdTech)',
              'Corporate Social Responsibility (CSR) / ESG'
            ]
          }
        });
      }
    } else {
      // If no structured data exists, create default structure
      console.log('No structured department data found, using defaults');
      setDepartmentData({
        categories: [
          'Core Business Functions',
          'Corporate Support Functions',
          'Technology & Digital Functions',
          'Industry-Specific or Specialized Departments'
        ],
        subcategories: {
          'Core Business Functions': [
            'Strategy & Planning',
            'Sales & Business Development',
            'Marketing & Communications',
            'Product Management',
            'Operations / Service Delivery',
            'Customer Support / Success',
            'Research & Development (R&D)',
            'Supply Chain & Procurement',
            'Project / Program Management Office (PMO)'
          ],
          'Corporate Support Functions': [
            'Finance & Accounting',
            'Human Resources (HR)',
            'Legal & Compliance',
            'Administration & Facilities Management',
            'Internal Audit & Risk Management'
          ],
          'Technology & Digital Functions': [
            'Information Technology (IT)',
            'Enterprise Architecture',
            'Data & Analytics / Business Intelligence',
            'Cybersecurity & Information Security',
            'Digital Transformation Office / Innovation Lab',
            'DevOps / Infrastructure & Cloud Services'
          ],
          'Industry-Specific or Specialized Departments': [
            'Quality Assurance / Regulatory Affairs (e.g., Pharma, Manufacturing)',
            'Clinical Affairs (e.g., Healthcare, MedTech)',
            'Merchandising & Category Management (Retail)',
            'Content / Editorial / Creative (Media & EdTech)',
            'Corporate Social Responsibility (CSR) / ESG'
          ]
        }
      });
    }

    // Load organization types
    const orgTypes = organizationTypesDataManager.loadData();
    setOrganizationTypes(orgTypes);

    // Load countries
    const countryList = countriesDataManager.loadData();
    setCountries(countryList);
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization Name *</Label>
          <Input 
            id="org-name" 
            placeholder="Enter organization name"
            value={formData.orgName}
            onChange={(e) => updateFormData('orgName', e.target.value)}
            className={cn(invalidFields.has('orgName') && "border-destructive")}
          />
          {invalidFields.has('orgName') && (
            <p className="text-sm text-destructive">Organization Name is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-type">Organization Type *</Label>
          <Select value={formData.orgType} onValueChange={(value) => updateFormData('orgType', value)}>
            <SelectTrigger className={cn(invalidFields.has('orgType') && "border-destructive")}>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              {organizationTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {invalidFields.has('orgType') && (
            <p className="text-sm text-destructive">Organization Type is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-country">Country *</Label>
          <Select value={formData.orgCountry} onValueChange={(value) => updateFormData('orgCountry', value)}>
            <SelectTrigger className={cn(invalidFields.has('orgCountry') && "border-destructive")}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country.toLowerCase().replace(/\s+/g, '-')}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {invalidFields.has('orgCountry') && (
            <p className="text-sm text-destructive">Country is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Official Website URL</Label>
          <Input 
            id="website" 
            type="url" 
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => updateFormData('website', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department-category">Department Category</Label>
          <Select value={formData.departmentCategory} onValueChange={handleDepartmentCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select department category" />
            </SelectTrigger>
            <SelectContent>
              {departmentData.categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department-subcategory">Department Sub Category</Label>
          <Select 
            value={formData.departmentSubCategory} 
            onValueChange={(value) => updateFormData('departmentSubCategory', value)}
            disabled={!formData.departmentCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department sub category" />
            </SelectTrigger>
            <SelectContent>
              {availableSubCategories.map((subCategory) => (
                <SelectItem key={subCategory} value={subCategory}>
                  {subCategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="reg-address">Registered Address *</Label>
          <Textarea 
            id="reg-address" 
            placeholder="Enter complete registered address"
            value={formData.regAddress}
            onChange={(e) => updateFormData('regAddress', e.target.value)}
            className={cn(invalidFields.has('regAddress') && "border-destructive")}
          />
          {invalidFields.has('regAddress') && (
            <p className="text-sm text-destructive">Registered Address is required</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetailsSection;
