import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, Plus, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DomainGroup, Category, SubCategory, DomainGroupsData } from '@/types/domainGroups';
import { IndustrySegmentData } from '@/types/industrySegments';
import { domainGroupsDataManager } from './domainGroupsDataManager';
import { industrySegmentDataManager } from '../industry-segments/industrySegmentDataManager';

interface DomainGroupFormProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

interface FormData {
  industrySegmentId: string;
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
    industrySegmentId: '',
    domainGroupName: '',
    domainGroupDescription: '',
    categoryName: '',
    categoryDescription: '',
    subCategoryName: '',
    subCategoryDescription: '',
    isActive: true
  });
  
  const [industrySegmentData, setIndustrySegmentData] = useState<IndustrySegmentData>({ industrySegments: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load industry segments data on component mount
  useEffect(() => {
    const loadedIndustryData = industrySegmentDataManager.loadData();
    console.log('🔄 Loading industry segments for form:', loadedIndustryData);
    setIndustrySegmentData(loadedIndustryData);
    
    if (loadedIndustryData.industrySegments.length === 0) {
      toast({
        title: "No Industry Segments",
        description: "Please configure industry segments first before creating domain groups.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Relaxed validation - only check for used industry segments if validation is specifically needed
  const getUsedIndustrySegmentIds = () => {
    return new Set(data.domainGroups.map(dg => dg.industry_segment_id));
  };

  const usedIndustrySegmentIds = getUsedIndustrySegmentIds();

  const handleSubmit = async () => {
    console.log('📝 Form submission started with data:', formData);
    setIsSubmitting(true);
    
    try {
      // Basic validation - only require essential fields
      if (!formData.domainGroupName.trim()) {
        toast({
          title: "Validation Error",
          description: "Domain Group Name is required",
          variant: "destructive"
        });
        return;
      }

      if (!formData.categoryName.trim()) {
        toast({
          title: "Validation Error",
          description: "Category Name is required", 
          variant: "destructive"
        });
        return;
      }

      if (!formData.subCategoryName.trim()) {
        toast({
          title: "Validation Error",
          description: "Sub Category Name is required",
          variant: "destructive"
        });
        return;
      }

      // Handle industry segment selection
      let selectedIndustrySegment;
      
      if (formData.industrySegmentId) {
        selectedIndustrySegment = industrySegmentData.industrySegments.find(
          segment => segment.id === formData.industrySegmentId
        );
        
        if (!selectedIndustrySegment) {
          toast({
            title: "Validation Error",
            description: "Please select a valid industry segment",
            variant: "destructive"
          });
          return;
        }
      } else {
        // If no industry segment selected, create a default one or allow without it
        selectedIndustrySegment = {
          id: 'default',
          industrySegment: 'General',
          description: 'General industry segment',
          isActive: true,
          createdAt: new Date().toISOString()
        };
        
        toast({
          title: "Info",
          description: "No industry segment selected, using 'General' category",
        });
      }

      const timestamp = new Date().toISOString();
      const baseId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
      
      console.log('📝 Creating hierarchy with base ID:', baseId);
      
      // Create Domain Group
      const domainGroup: DomainGroup = {
        id: baseId + '_dg',
        name: formData.domainGroupName.trim(),
        description: formData.domainGroupDescription.trim() || undefined,
        industry_segment_id: selectedIndustrySegment.id,
        industrySegmentName: selectedIndustrySegment.industrySegment,
        is_active: formData.isActive,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      // Create Category
      const category: Category = {
        id: baseId + '_cat',
        name: formData.categoryName.trim(),
        description: formData.categoryDescription.trim() || undefined,
        domain_group_id: domainGroup.id,
        is_active: formData.isActive,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      // Create Sub Category
      const subCategory: SubCategory = {
        id: baseId + '_sub',
        name: formData.subCategoryName.trim(),
        description: formData.subCategoryDescription.trim() || undefined,
        category_id: category.id,
        is_active: formData.isActive,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      // Update data
      const updatedData = {
        domainGroups: [...data.domainGroups, domainGroup],
        categories: [...data.categories, category],
        subCategories: [...data.subCategories, subCategory]
      };
      
      console.log('💾 Saving updated data:', updatedData);
      
      // Call the update handler which will save the data
      onDataUpdate(updatedData);
      
      // Reset form on successful submission
      setFormData({
        industrySegmentId: '',
        domainGroupName: '',
        domainGroupDescription: '',
        categoryName: '',
        categoryDescription: '',
        subCategoryName: '',
        subCategoryDescription: '',
        isActive: true
      });
      
      console.log('✅ Form submission completed successfully');
      
    } catch (error) {
      console.error('❌ Error during form submission:', error);
      toast({
        title: "Submission Error",
        description: "An error occurred while creating the hierarchy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Create Domain Group Hierarchy
        </CardTitle>
        <CardDescription>
          Fill the required fields to create a complete hierarchy: Domain Group → Category → Sub Category
        </CardDescription>
        {industrySegmentData.industrySegments.length === 0 && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              No industry segments configured. You can still create domain groups, but consider configuring industry segments first.
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Industry Segment - Optional */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="industry-segment">Industry Segment (Optional)</Label>
            <Select 
              value={formData.industrySegmentId} 
              onValueChange={(value) => setFormData({...formData, industrySegmentId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an industry segment (optional)" />
              </SelectTrigger>
              <SelectContent>
                {industrySegmentData.industrySegments.map((segment) => (
                  <SelectItem 
                    key={segment.id} 
                    value={segment.id}
                  >
                    {segment.industrySegment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              If not selected, will be categorized as "General"
            </p>
          </div>

          {/* Domain Group Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="domain-group">Domain Group Name *</Label>
            <Input 
              id="domain-group"
              value={formData.domainGroupName}
              onChange={(e) => setFormData({...formData, domainGroupName: e.target.value})}
              placeholder="e.g., Digital Banking"
              required
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

          {/* Category Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="category">Category Name *</Label>
            <Input 
              id="category"
              value={formData.categoryName}
              onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
              placeholder="e.g., Mobile Banking"
              required
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

          {/* Sub Category Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="sub-category">Sub Category Name *</Label>
            <Input 
              id="sub-category"
              value={formData.subCategoryName}
              onChange={(e) => setFormData({...formData, subCategoryName: e.target.value})}
              placeholder="e.g., Account Management"
              required
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
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={isSubmitting || !formData.domainGroupName.trim() || !formData.categoryName.trim() || !formData.subCategoryName.trim()}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Creating...' : 'Create Complete Hierarchy'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DomainGroupForm;
