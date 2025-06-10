
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from './types';
import { departmentsDataManager, organizationTypesDataManager, countriesDataManager } from '@/utils/sharedDataManagers';

interface InstitutionDetailsSectionProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
}

// Department master data structure
interface DepartmentData {
  categories: string[];
  subcategories: {
    [category: string]: string[];
  };
}

const InstitutionDetailsSection: React.FC<InstitutionDetailsSectionProps> = ({
  formData,
  updateFormData
}) => {
  const [departmentData, setDepartmentData] = useState<DepartmentData>({
    categories: [],
    subcategories: {}
  });
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  // Load master data on component mount
  useEffect(() => {
    // Load departments - this is currently a flat array, we need to convert it to categories/subcategories
    const departments = departmentsDataManager.loadData();
    console.log('Loaded departments from master data:', departments);
    
    // For now, create a simple mapping - all departments as categories with empty subcategories
    // This can be enhanced when the department structure is properly implemented
    const departmentCategories = [
      'Core Business Functions',
      'Corporate Support Functions', 
      'Technology & Digital Functions',
      'Industry-Specific or Specialized Departments'
    ];
    
    const departmentSubcategories = {
      'Core Business Functions': departments.filter(d => 
        ['Strategy', 'Sales', 'Marketing', 'Product', 'Operations', 'Customer', 'Research', 'Supply', 'Project'].some(keyword => 
          d.toLowerCase().includes(keyword.toLowerCase())
        )
      ),
      'Corporate Support Functions': departments.filter(d => 
        ['Finance', 'Human', 'Legal', 'Administration', 'Audit', 'Risk'].some(keyword => 
          d.toLowerCase().includes(keyword.toLowerCase())
        )
      ),
      'Technology & Digital Functions': departments.filter(d => 
        ['Technology', 'IT', 'Data', 'Analytics', 'Cyber', 'Digital', 'DevOps'].some(keyword => 
          d.toLowerCase().includes(keyword.toLowerCase())
        )
      ),
      'Industry-Specific or Specialized Departments': departments.filter(d => 
        ['Quality', 'Clinical', 'Regulatory', 'CSR', 'ESG'].some(keyword => 
          d.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    };

    setDepartmentData({
      categories: departmentCategories,
      subcategories: departmentSubcategories
    });

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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-type">Organization Type *</Label>
          <Select value={formData.orgType} onValueChange={(value) => updateFormData('orgType', value)}>
            <SelectTrigger>
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-country">Country *</Label>
          <Select value={formData.orgCountry} onValueChange={(value) => updateFormData('orgCountry', value)}>
            <SelectTrigger>
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
          />
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetailsSection;
