import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Edit, Trash2, Save, X, RotateCcw, Upload, Download, 
  Wand2, FileText, Database, Eye, FolderTree, Target 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industry_segment_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  domain_group_id: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface SubCategory {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface IndustrySegment {
  id: string;
  name: string;
}

const DomainGroupsConfigSupabase = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [showDirectEntry, setShowDirectEntry] = useState(false);

  // Form states for direct entry
  const [newDomainGroup, setNewDomainGroup] = useState({ 
    name: '', 
    description: '', 
    industry_segment_id: '', 
    is_active: true 
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    domain_group_id: '',
    is_active: true
  });
  const [newSubCategory, setNewSubCategory] = useState({
    name: '',
    description: '',
    category_id: '',
    is_active: true
  });

  const [isAdding, setIsAdding] = useState({
    domainGroup: false,
    category: false,
    subCategory: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [domainGroupsResult, categoriesResult, subCategoriesResult, industrySegmentsResult] = await Promise.all([
        supabase.from('master_domain_groups').select('*').order('name'),
        supabase.from('master_categories').select('*').order('name'),
        supabase.from('master_sub_categories').select('*').order('name'),
        supabase.from('master_industry_segments').select('id, name').order('name')
      ]);

      if (domainGroupsResult.error) throw domainGroupsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      if (subCategoriesResult.error) throw subCategoriesResult.error;
      if (industrySegmentsResult.error) throw industrySegmentsResult.error;

      setDomainGroups(domainGroupsResult.data || []);
      setCategories(categoriesResult.data || []);
      setSubCategories(subCategoriesResult.data || []);
      setIndustrySegments(industrySegmentsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load hierarchy data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomainGroup = async () => {
    if (newDomainGroup.name.trim()) {
      try {
        const { error } = await supabase
          .from('master_domain_groups')
          .insert([{
            name: newDomainGroup.name.trim(),
            description: newDomainGroup.description.trim() || null,
            industry_segment_id: newDomainGroup.industry_segment_id || null,
            is_active: newDomainGroup.is_active
          }]);

        if (error) throw error;

        setNewDomainGroup({ name: '', description: '', industry_segment_id: '', is_active: true });
        setIsAdding({ ...isAdding, domainGroup: false });
        fetchData();
        toast({
          title: "Success",
          description: "Domain group added successfully",
        });
      } catch (error) {
        console.error('Error adding domain group:', error);
        toast({
          title: "Error",
          description: "Failed to add domain group.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.name.trim() && newCategory.domain_group_id) {
      try {
        const { error } = await supabase
          .from('master_categories')
          .insert([{
            name: newCategory.name.trim(),
            description: newCategory.description.trim() || null,
            domain_group_id: newCategory.domain_group_id,
            is_active: newCategory.is_active
          }]);

        if (error) throw error;

        setNewCategory({ name: '', description: '', domain_group_id: '', is_active: true });
        setIsAdding({ ...isAdding, category: false });
        fetchData();
        toast({
          title: "Success",
          description: "Category added successfully",
        });
      } catch (error) {
        console.error('Error adding category:', error);
        toast({
          title: "Error",
          description: "Failed to add category.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddSubCategory = async () => {
    if (newSubCategory.name.trim() && newSubCategory.category_id) {
      try {
        const { error } = await supabase
          .from('master_sub_categories')
          .insert([{
            name: newSubCategory.name.trim(),
            description: newSubCategory.description.trim() || null,
            category_id: newSubCategory.category_id,
            is_active: newSubCategory.is_active
          }]);

        if (error) throw error;

        setNewSubCategory({ name: '', description: '', category_id: '', is_active: true });
        setIsAdding({ ...isAdding, subCategory: false });
        fetchData();
        toast({
          title: "Success",
          description: "Sub-category added successfully",
        });
      } catch (error) {
        console.error('Error adding sub-category:', error);
        toast({
          title: "Error",
          description: "Failed to add sub-category.",
          variant: "destructive",
        });
      }
    }
  };

  const exportData = async () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        domainGroups: domainGroups,
        categories: categories,
        subCategories: subCategories
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `domain-groups-hierarchy-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Hierarchy data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export hierarchy data",
        variant: "destructive",
      });
    }
  };

  const getIndustrySegmentName = (segmentId: string) => {
    if (!segmentId) return 'None';
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.name : 'None';
  };

  const getDomainGroupName = (domainGroupId: string) => {
    const domainGroup = domainGroups.find(dg => dg.id === domainGroupId);
    return domainGroup ? domainGroup.name : 'Unknown';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getCategoriesForDomainGroup = (domainGroupId: string) => {
    return categories.filter(c => c.domain_group_id === domainGroupId);
  };

  const getSubCategoriesForCategory = (categoryId: string) => {
    return subCategories.filter(sc => sc.category_id === categoryId);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading hierarchy data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="w-6 h-6" />
                Domain Groups Hierarchy Management
              </CardTitle>
              <CardDescription>
                Master: Domain Groups → Child: Categories → Sub-Child: Sub-Categories
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={exportData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setShowDirectEntry(!showDirectEntry)}
              className="flex items-center gap-2 h-auto p-4 flex-col"
              variant={showDirectEntry ? "default" : "outline"}
            >
              <FileText className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Direct Entry</div>
                <div className="text-sm opacity-70">Add items one by one</div>
              </div>
            </Button>
            <Button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-2 h-auto p-4 flex-col"
              variant="outline"
            >
              <Wand2 className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Guided Wizard</div>
                <div className="text-sm opacity-70">Step-by-step setup</div>
              </div>
            </Button>
            <Button
              className="flex items-center gap-2 h-auto p-4 flex-col"
              variant="outline"
            >
              <Upload className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Excel Upload</div>
                <div className="text-sm opacity-70">Bulk import from file</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Domain Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domainGroups.length}</div>
            <div className="text-sm text-muted-foreground">Master level</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Child level</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderTree className="w-5 h-5" />
              Sub-Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subCategories.length}</div>
            <div className="text-sm text-muted-foreground">Sub-child level</div>
          </CardContent>
        </Card>
      </div>

      {/* Direct Entry Forms */}
      {showDirectEntry && (
        <Card>
          <CardHeader>
            <CardTitle>Direct Entry Forms</CardTitle>
            <CardDescription>Add items directly to each level of the hierarchy</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="domain-groups" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="domain-groups">Domain Groups</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="sub-categories">Sub-Categories</TabsTrigger>
              </TabsList>

              <TabsContent value="domain-groups" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Domain Groups ({domainGroups.length})</h3>
                  <Button 
                    onClick={() => setIsAdding({ ...isAdding, domainGroup: true })} 
                    disabled={isAdding.domainGroup}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Domain Group
                  </Button>
                </div>

                {isAdding.domainGroup && (
                  <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
                    <div className="flex-1 space-y-2">
                      <div>
                        <Label htmlFor="new-domain-group-name">Domain Group Name</Label>
                        <Input
                          id="new-domain-group-name"
                          value={newDomainGroup.name}
                          onChange={(e) => setNewDomainGroup({...newDomainGroup, name: e.target.value})}
                          placeholder="Enter domain group name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-domain-group-description">Description</Label>
                        <Textarea
                          id="new-domain-group-description"
                          value={newDomainGroup.description}
                          onChange={(e) => setNewDomainGroup({...newDomainGroup, description: e.target.value})}
                          placeholder="Enter description (optional)"
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-domain-group-segment">Industry Segment (Optional)</Label>
                        <Select
                          value={newDomainGroup.industry_segment_id}
                          onValueChange={(value) => setNewDomainGroup({...newDomainGroup, industry_segment_id: value === 'none' ? '' : value})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select industry segment (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Industry Segment</SelectItem>
                            {industrySegments.map((segment) => (
                              <SelectItem key={segment.id} value={segment.id}>
                                {segment.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 items-end">
                      <Button onClick={handleAddDomainGroup} size="sm" className="flex items-center gap-1">
                        <Save className="w-3 h-3" />
                        Save
                      </Button>
                      <Button onClick={() => setIsAdding({ ...isAdding, domainGroup: false })} variant="outline" size="sm" className="flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid gap-2">
                  {domainGroups.map((domainGroup, index) => (
                    <div key={domainGroup.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{domainGroup.name}</div>
                          {domainGroup.description && (
                            <div className="text-sm text-muted-foreground">{domainGroup.description}</div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            Industry: {getIndustrySegmentName(domainGroup.industry_segment_id || '')}
                          </div>
                        </div>
                        <Badge variant={domainGroup.is_active ? "default" : "secondary"}>
                          {domainGroup.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Categories ({categories.length})</h3>
                  <Button 
                    onClick={() => setIsAdding({ ...isAdding, category: true })} 
                    disabled={isAdding.category || domainGroups.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </Button>
                </div>

                {domainGroups.length === 0 && (
                  <div className="text-center p-4 text-muted-foreground">
                    Please create at least one Domain Group first
                  </div>
                )}

                {isAdding.category && (
                  <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
                    <div className="flex-1 space-y-2">
                      <div>
                        <Label htmlFor="new-category-domain-group">Domain Group</Label>
                        <Select
                          value={newCategory.domain_group_id}
                          onValueChange={(value) => setNewCategory({...newCategory, domain_group_id: value})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select domain group" />
                          </SelectTrigger>
                          <SelectContent>
                            {domainGroups.map((dg) => (
                              <SelectItem key={dg.id} value={dg.id}>
                                {dg.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="new-category-name">Category Name</Label>
                        <Input
                          id="new-category-name"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          placeholder="Enter category name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-category-description">Description</Label>
                        <Textarea
                          id="new-category-description"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                          placeholder="Enter description (optional)"
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-end">
                      <Button onClick={handleAddCategory} size="sm" className="flex items-center gap-1">
                        <Save className="w-3 h-3" />
                        Save
                      </Button>
                      <Button onClick={() => setIsAdding({ ...isAdding, category: false })} variant="outline" size="sm" className="flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid gap-2">
                  {categories.map((category, index) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-muted-foreground">{category.description}</div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            Domain Group: {getDomainGroupName(category.domain_group_id)}
                          </div>
                        </div>
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sub-categories" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Sub-Categories ({subCategories.length})</h3>
                  <Button 
                    onClick={() => setIsAdding({ ...isAdding, subCategory: true })} 
                    disabled={isAdding.subCategory || categories.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Sub-Category
                  </Button>
                </div>

                {categories.length === 0 && (
                  <div className="text-center p-4 text-muted-foreground">
                    Please create at least one Category first
                  </div>
                )}

                {isAdding.subCategory && (
                  <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
                    <div className="flex-1 space-y-2">
                      <div>
                        <Label htmlFor="new-sub-category-category">Category</Label>
                        <Select
                          value={newSubCategory.category_id}
                          onValueChange={(value) => setNewSubCategory({...newSubCategory, category_id: value})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name} ({getDomainGroupName(category.domain_group_id)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="new-sub-category-name">Sub-Category Name</Label>
                        <Input
                          id="new-sub-category-name"
                          value={newSubCategory.name}
                          onChange={(e) => setNewSubCategory({...newSubCategory, name: e.target.value})}
                          placeholder="Enter sub-category name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-sub-category-description">Description</Label>
                        <Textarea
                          id="new-sub-category-description"
                          value={newSubCategory.description}
                          onChange={(e) => setNewSubCategory({...newSubCategory, description: e.target.value})}
                          placeholder="Enter description (optional)"
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-end">
                      <Button onClick={handleAddSubCategory} size="sm" className="flex items-center gap-1">
                        <Save className="w-3 h-3" />
                        Save
                      </Button>
                      <Button onClick={() => setIsAdding({ ...isAdding, subCategory: false })} variant="outline" size="sm" className="flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid gap-2">
                  {subCategories.map((subCategory, index) => (
                    <div key={subCategory.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{subCategory.name}</div>
                          {subCategory.description && (
                            <div className="text-sm text-muted-foreground">{subCategory.description}</div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            Category: {getCategoryName(subCategory.category_id)}
                          </div>
                        </div>
                        <Badge variant={subCategory.is_active ? "default" : "secondary"}>
                          {subCategory.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Hierarchy View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Hierarchy View
          </CardTitle>
          <CardDescription>
            Complete hierarchy showing Master → Child → Sub-Child relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          {domainGroups.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No domain groups found. Create your first domain group to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {domainGroups.map((domainGroup) => {
                const domainCategories = getCategoriesForDomainGroup(domainGroup.id);
                return (
                  <div key={domainGroup.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-600">Domain Group:</span>
                      <span className="font-medium">{domainGroup.name}</span>
                      {domainGroup.description && (
                        <span className="text-sm text-muted-foreground">({domainGroup.description})</span>
                      )}
                      <Badge variant={domainGroup.is_active ? "default" : "secondary"}>
                        {domainGroup.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    {domainCategories.length === 0 ? (
                      <div className="ml-6 text-sm text-muted-foreground">No categories</div>
                    ) : (
                      <div className="ml-6 space-y-3">
                        {domainCategories.map((category) => {
                          const categorySubCategories = getSubCategoriesForCategory(category.id);
                          return (
                            <div key={category.id} className="border-l-2 border-green-200 pl-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Database className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-600">Category:</span>
                                <span>{category.name}</span>
                                {category.description && (
                                  <span className="text-sm text-muted-foreground">({category.description})</span>
                                )}
                                <Badge variant={category.is_active ? "default" : "secondary"} className="text-xs">
                                  {category.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              
                              {categorySubCategories.length === 0 ? (
                                <div className="ml-6 text-sm text-muted-foreground">No sub-categories</div>
                              ) : (
                                <div className="ml-6 space-y-2">
                                  {categorySubCategories.map((subCategory) => (
                                    <div key={subCategory.id} className="border-l-2 border-orange-200 pl-4">
                                      <div className="flex items-center gap-2">
                                        <FolderTree className="w-4 h-4 text-orange-600" />
                                        <span className="font-medium text-orange-600">Sub-Category:</span>
                                        <span>{subCategory.name}</span>
                                        {subCategory.description && (
                                          <span className="text-sm text-muted-foreground">({subCategory.description})</span>
                                        )}
                                        <Badge variant={subCategory.is_active ? "default" : "secondary"} className="text-xs">
                                          {subCategory.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupsConfigSupabase;