
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Database, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager } from '@/utils/dataManager';
import { DomainGroup, Category, SubCategory, DomainGroupsData } from '@/types/domainGroups';

// Industry Segment interface to match IndustrySegmentConfig
interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// Default data
const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

// Data managers
const domainGroupsDataManager = new DataManager({
  key: 'master_data_domain_groups',
  defaultData: defaultDomainGroupsData,
  version: 1
});

// Use the SAME data manager as IndustrySegmentConfig
const industrySegmentDataManager = new DataManager({
  key: 'master_data_industry_segments',
  defaultData: [],
  version: 1
});

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>(defaultDomainGroupsData);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    industrySegmentId: '',
    domainGroupName: '',
    domainGroupDescription: '',
    categoryName: '',
    categoryDescription: '',
    subCategoryName: '',
    subCategoryDescription: '',
    isActive: true
  });
  
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    console.log('=== DomainGroupsConfig: Loading data ===');
    const loadedData = domainGroupsDataManager.loadData();
    const loadedSegments = industrySegmentDataManager.loadData();
    
    console.log('📊 Loaded domain groups data:', loadedData);
    console.log('📊 Loaded industry segments raw:', loadedSegments);
    
    setData(loadedData);
    
    // Filter only active industry segments and ensure they are proper objects
    const activeSegments: IndustrySegment[] = Array.isArray(loadedSegments) 
      ? loadedSegments.filter((segment: any) => 
          segment && 
          typeof segment === 'object' && 
          segment.id && 
          segment.name && 
          segment.isActive === true
        )
      : [];
    
    console.log('✅ Active industry segments after filtering:', activeSegments);
    setIndustrySegments(activeSegments);
  }, []);
  
  // Helper function to get industry segment name
  const getIndustrySegmentName = (segmentId: string): string => {
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.name : 'Unknown Segment';
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!formData.industrySegmentId || !formData.domainGroupName || !formData.categoryName || !formData.subCategoryName) {
      toast({
        title: "Validation Error",
        description: "Industry Segment, Domain Group Name, Category Name, and Sub Category Name are required",
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
      industrySegmentId: formData.industrySegmentId,
      industrySegmentName: getIndustrySegmentName(formData.industrySegmentId),
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
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    // Reset form
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
    
    toast({
      title: "Success",
      description: "Domain group hierarchy created successfully",
    });
  };

  // Handle delete
  const handleDelete = (domainGroupId: string) => {
    const updatedData = {
      domainGroups: data.domainGroups.filter(dg => dg.id !== domainGroupId),
      categories: data.categories.filter(cat => cat.domainGroupId !== domainGroupId),
      subCategories: data.subCategories.filter(sub => {
        const category = data.categories.find(cat => cat.id === sub.categoryId);
        return category?.domainGroupId !== domainGroupId;
      })
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    toast({
      title: "Deleted",
      description: "Domain group hierarchy deleted successfully",
    });
  };

  // Get hierarchical data for display
  const hierarchicalData = data.domainGroups.map(domainGroup => {
    const categories = data.categories.filter(cat => cat.domainGroupId === domainGroup.id);
    return {
      ...domainGroup,
      categories: categories.map(category => ({
        ...category,
        subCategories: data.subCategories.filter(sub => sub.categoryId === category.id)
      }))
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add Domain Group Details</h1>
          <p className="text-muted-foreground">Create complete domain group hierarchy in one simple form</p>
        </div>
      </div>

      {/* Simple Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Create Domain Group Hierarchy
          </CardTitle>
          <CardDescription>
            Fill all fields to create a complete hierarchy: Industry Segment → Domain Group → Category → Sub Category
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Field 1: Industry Segment */}
            <div className="space-y-2">
              <Label htmlFor="industry-segment">Industry Segment *</Label>
              <Select 
                value={formData.industrySegmentId} 
                onValueChange={(value) => setFormData({...formData, industrySegmentId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry Segment" />
                </SelectTrigger>
                <SelectContent>
                  {industrySegments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name} ({segment.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {industrySegments.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No active industry segments found. Please add industry segments first.
                </p>
              )}
            </div>

            {/* Field 2: Domain Group */}
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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="domain-group-desc">Domain Group Description</Label>
              <Textarea 
                id="domain-group-desc"
                value={formData.domainGroupDescription}
                onChange={(e) => setFormData({...formData, domainGroupDescription: e.target.value})}
                placeholder="Brief description of the domain group"
                rows={2}
              />
            </div>

            {/* Field 3: Category */}
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

            {/* Field 4: Sub Category */}
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

      {/* Display Created Hierarchies */}
      {hierarchicalData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Created Domain Group Hierarchies</CardTitle>
            <CardDescription>
              View all created domain group hierarchies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Industry Segment</TableHead>
                  <TableHead>Domain Group</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Sub Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hierarchicalData.map((domainGroup) => (
                  <TableRow key={domainGroup.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {getIndustrySegmentName(domainGroup.industrySegmentId)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div>{domainGroup.name}</div>
                        {domainGroup.description && (
                          <div className="text-xs text-muted-foreground">{domainGroup.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {domainGroup.categories.map((category) => (
                          <div key={category.id} className="text-sm">
                            <div className="font-medium">{category.name}</div>
                            {category.description && (
                              <div className="text-xs text-muted-foreground">{category.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {domainGroup.categories.map((category) => 
                          category.subCategories.map((subCategory) => (
                            <div key={subCategory.id} className="text-sm">
                              <div className="font-medium">{subCategory.name}</div>
                              {subCategory.description && (
                                <div className="text-xs text-muted-foreground">{subCategory.description}</div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={domainGroup.isActive ? "default" : "secondary"}>
                        {domainGroup.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(domainGroup.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DomainGroupsConfig;
