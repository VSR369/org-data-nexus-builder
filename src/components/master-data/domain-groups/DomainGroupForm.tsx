
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Database, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DomainGroup, Category, SubCategory, DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domainGroupsDataManager';

interface DomainGroupFormProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

interface FormData {
  domainGroupName: string;
  domainGroupDescription: string;
  categoryName: string;
  categoryDescription: string;
  subCategoryName: string;
  subCategoryDescription: string;
  isActive: boolean;
}

const DomainGroupForm: React.FC<DomainGroupFormProps> = ({ data, onDataUpdate }) => {
  const [formData, setFormData] = useState<FormData>({
    domainGroupName: '',
    domainGroupDescription: '',
    categoryName: '',
    categoryDescription: '',
    subCategoryName: '',
    subCategoryDescription: '',
    isActive: true
  });
  
  const { toast } = useToast();

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.domainGroupName || !formData.categoryName || !formData.subCategoryName) {
      toast({
        title: "Validation Error",
        description: "Domain Group Name, Category Name, and Sub Category Name are required",
        variant: "destructive"
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const baseId = Date.now().toString();
    
    // Create Domain Group
    const domainGroup: DomainGroup = {
      id: baseId + '_dg',
      name: formData.domainGroupName,
      description: formData.domainGroupDescription || undefined,
      industrySegmentId: 'none',
      industrySegmentName: 'Not Applicable',
      isActive: formData.isActive,
      createdAt: timestamp
    };
    
    // Create Category
    const category: Category = {
      id: baseId + '_cat',
      name: formData.categoryName,
      description: formData.categoryDescription || undefined,
      domainGroupId: domainGroup.id,
      isActive: formData.isActive,
      createdAt: timestamp
    };
    
    // Create Sub Category
    const subCategory: SubCategory = {
      id: baseId + '_sub',
      name: formData.subCategoryName,
      description: formData.subCategoryDescription || undefined,
      categoryId: category.id,
      isActive: formData.isActive,
      createdAt: timestamp
    };
    
    // Update data
    const updatedData = {
      domainGroups: [...data.domainGroups, domainGroup],
      categories: [...data.categories, category],
      subCategories: [...data.subCategories, subCategory]
    };
    
    onDataUpdate(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    // Reset form
    setFormData({
      domainGroupName: '',
      domainGroupDescription: '',
      categoryName: '',
      categoryDescription: '',
      subCategoryName: '',
      subCategoryDescription: '',
      isActive: true
    });
    
    toast({
      title: "Success",
      description: "Domain group hierarchy created successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Create Domain Group Hierarchy
        </CardTitle>
        <CardDescription>
          Fill all fields to create a complete hierarchy: Domain Group → Category → Sub Category
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Domain Group Name */}
          <div className="space-y-2">
            <Label htmlFor="domain-group">Domain Group Name *</Label>
            <Input 
              id="domain-group"
              value={formData.domainGroupName}
              onChange={(e) => setFormData({...formData, domainGroupName: e.target.value})}
              placeholder="e.g., Digital Banking"
            />
          </div>

          {/* Domain Group Description */}
          <div className="space-y-2">
            <Label htmlFor="domain-group-desc">Domain Group Description</Label>
            <Textarea 
              id="domain-group-desc"
              value={formData.domainGroupDescription}
              onChange={(e) => setFormData({...formData, domainGroupDescription: e.target.value})}
              placeholder="Brief description of the domain group"
              rows={2}
            />
          </div>

          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="category">Category Name *</Label>
            <Input 
              id="category"
              value={formData.categoryName}
              onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
              placeholder="e.g., Mobile Banking"
            />
          </div>

          {/* Category Description */}
          <div className="space-y-2">
            <Label htmlFor="category-desc">Category Description</Label>
            <Textarea 
              id="category-desc"
              value={formData.categoryDescription}
              onChange={(e) => setFormData({...formData, categoryDescription: e.target.value})}
              placeholder="Brief description of the category"
              rows={2}
            />
          </div>

          {/* Sub Category Name */}
          <div className="space-y-2">
            <Label htmlFor="sub-category">Sub Category Name *</Label>
            <Input 
              id="sub-category"
              value={formData.subCategoryName}
              onChange={(e) => setFormData({...formData, subCategoryName: e.target.value})}
              placeholder="e.g., Account Management"
            />
          </div>

          {/* Sub Category Description */}
          <div className="space-y-2">
            <Label htmlFor="sub-category-desc">Sub Category Description</Label>
            <Textarea 
              id="sub-category-desc"
              value={formData.subCategoryDescription}
              onChange={(e) => setFormData({...formData, subCategoryDescription: e.target.value})}
              placeholder="Brief description of the sub category"
              rows={2}
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center space-x-2">
          <Switch 
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
          />
          <Label>Active</Label>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create Complete Hierarchy
        </Button>
      </CardContent>
    </Card>
  );
};

export default DomainGroupForm;
