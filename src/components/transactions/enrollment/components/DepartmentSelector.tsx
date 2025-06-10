
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from '../types';

interface DepartmentSelectorProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
  departmentCategories: string[];
  availableSubCategories: string[];
  onDepartmentCategoryChange: (value: string) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  formData,
  updateFormData,
  departmentCategories,
  availableSubCategories,
  onDepartmentCategoryChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="department-category">Department Category</Label>
        <Select value={formData.departmentCategory} onValueChange={onDepartmentCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select department category" />
          </SelectTrigger>
          <SelectContent>
            {departmentCategories.map((category) => (
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
    </div>
  );
};

export default DepartmentSelector;
