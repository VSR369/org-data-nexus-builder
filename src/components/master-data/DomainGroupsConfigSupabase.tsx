
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Plus, Edit, Trash2, Save, X, RotateCcw, Upload, Download, 
  Wand2, FileText, Target, Search, AlertTriangle, Globe, Building2,
  ChevronDown, ChevronRight, FolderTree, Layers, ArrowLeft
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SupabaseWizard from '../masterData/wizard/SupabaseWizard';
import ExcelUploadSupabase from '../masterData/upload/ExcelUploadSupabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industry_segment_id?: string;
  industry_segment_name?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  hierarchy?: {
    categories: Array<{
      id: string;
      name: string;
      description?: string;
      subCategories: Array<{
        id: string;
        name: string;
        description?: string;
      }>;
    }>;
  };
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
  description?: string;
}

interface HierarchyFormData {
  industry_segment_id: string;
  name: string;
  description: string;
  categories: Array<{
    id: string;
    name: string;
    description: string;
    subCategories: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  }>;
}

type ViewMode = 'overview' | 'direct' | 'wizard' | 'excel';

const DomainGroupsConfigSupabase = () => {
  const { toast } = useToast();
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  // Edit/Delete states
  const [editingItem, setEditingItem] = useState<DomainGroup | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, item: DomainGroup} | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Direct entry form state
  const [hierarchyForm, setHierarchyForm] = useState<HierarchyFormData>({
    industry_segment_id: '',
    name: '',
    description: '',
    categories: [{
      id: crypto.randomUUID(),
      name: '',
      description: '',
      subCategories: [{
        id: crypto.randomUUID(),
        name: '',
        description: ''
      }]
    }]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [domainGroupsResult, categoriesResult, subCategoriesResult, industrySegmentsResult] = await Promise.all([
        supabase.from('master_domain_groups').select('*').order('name'),
        supabase.from('master_categories').select('*').order('name'),
        supabase.from('master_sub_categories').select('*').order('name'),
        supabase.from('master_industry_segments').select('*').order('name')
      ]);

      if (domainGroupsResult.error) throw domainGroupsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      if (subCategoriesResult.error) throw subCategoriesResult.error;
      if (industrySegmentsResult.error) throw industrySegmentsResult.error;

      // Transform domain groups data and add industry segment names
      const transformedDomainGroups: DomainGroup[] = (domainGroupsResult.data || []).map(dg => {
        const industrySegment = industrySegmentsResult.data?.find(is => is.id === dg.industry_segment_id);
        return {
          id: dg.id,
          name: dg.name,
          description: dg.description,
          industry_segment_id: dg.industry_segment_id,
          industry_segment_name: industrySegment?.name,
          is_active: dg.is_active,
          created_at: dg.created_at,
          updated_at: dg.updated_at,
          hierarchy: dg.hierarchy ? (typeof dg.hierarchy === 'string' ? JSON.parse(dg.hierarchy) : dg.hierarchy) : { categories: [] }
        };
      });

      console.log('✅ Domain Groups loaded:', transformedDomainGroups);
      setDomainGroups(transformedDomainGroups);
      setCategories(categoriesResult.data || []);
      setSubCategories(subCategoriesResult.data || []);
      setIndustrySegments(industrySegmentsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load domain groups data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Group domain groups by industry segment for hierarchical display
  const getGroupedDomainGroups = () => {
    const grouped = domainGroups.reduce((acc, dg) => {
      const industryKey = dg.industry_segment_name || 'No Industry Segment';
      if (!acc[industryKey]) {
        acc[industryKey] = [];
      }
      acc[industryKey].push(dg);
      return acc;
    }, {} as Record<string, DomainGroup[]>);

    return grouped;
  };

  // Get categories for a domain group
  const getCategoriesForDomainGroup = (domainGroupId: string) => {
    return categories.filter(cat => cat.domain_group_id === domainGroupId);
  };

  // Get sub-categories for a category
  const getSubCategoriesForCategory = (categoryId: string) => {
    return subCategories.filter(sub => sub.category_id === categoryId);
  };

  // Get hierarchy counts
  const getHierarchyCounts = (domainGroup: DomainGroup) => {
    const domainCategories = getCategoriesForDomainGroup(domainGroup.id);
    const domainSubCategories = domainCategories.reduce((sum, cat) => 
      sum + getSubCategoriesForCategory(cat.id).length, 0);
    return { categories: domainCategories.length, subCategories: domainSubCategories };
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // Add category to hierarchy form
  const addCategory = () => {
    setHierarchyForm(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: crypto.randomUUID(),
          name: '',
          description: '',
          subCategories: [{
            id: crypto.randomUUID(),
            name: '',
            description: ''
          }]
        }
      ]
    }));
  };

  // Add sub-category to category
  const addSubCategory = (categoryId: string) => {
    setHierarchyForm(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? {
              ...cat,
              subCategories: [
                ...cat.subCategories,
                {
                  id: crypto.randomUUID(),
                  name: '',
                  description: ''
                }
              ]
            }
          : cat
      )
    }));
  };

  // Remove category
  const removeCategory = (categoryId: string) => {
    if (hierarchyForm.categories.length <= 1) return;
    setHierarchyForm(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId)
    }));
  };

  // Remove sub-category
  const removeSubCategory = (categoryId: string, subCategoryId: string) => {
    setHierarchyForm(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? {
              ...cat,
              subCategories: cat.subCategories.length <= 1 
                ? cat.subCategories 
                : cat.subCategories.filter(sub => sub.id !== subCategoryId)
            }
          : cat
      )
    }));
  };

  // Save hierarchy form
  const saveHierarchyForm = async () => {
    try {
      if (!hierarchyForm.industry_segment_id || !hierarchyForm.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Industry segment and domain group name are required",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);

      // Create Domain Group
      const { data: domainGroupData, error: domainGroupError } = await supabase
        .from('master_domain_groups')
        .insert([{
          name: hierarchyForm.name.trim(),
          description: hierarchyForm.description?.trim() || null,
          industry_segment_id: hierarchyForm.industry_segment_id,
          is_active: true
        }])
        .select()
        .single();

      if (domainGroupError) throw domainGroupError;

      // Create Categories and Sub-Categories
      for (const category of hierarchyForm.categories) {
        if (!category.name.trim()) continue;

        const { data: categoryData, error: categoryError } = await supabase
          .from('master_categories')
          .insert([{
            name: category.name.trim(),
            description: category.description?.trim() || null,
            domain_group_id: domainGroupData.id,
            is_active: true
          }])
          .select()
          .single();

        if (categoryError) throw categoryError;

        // Create Sub-Categories
        for (const subCategory of category.subCategories) {
          if (!subCategory.name.trim()) continue;

          const { error: subCategoryError } = await supabase
            .from('master_sub_categories')
            .insert([{
              name: subCategory.name.trim(),
              description: subCategory.description?.trim() || null,
              category_id: categoryData.id,
              is_active: true
            }]);

          if (subCategoryError) throw subCategoryError;
        }
      }

      const totalCategories = hierarchyForm.categories.filter(cat => cat.name.trim()).length;
      const totalSubCategories = hierarchyForm.categories.reduce((sum, cat) => 
        sum + cat.subCategories.filter(sub => sub.name.trim()).length, 0);

      toast({
        title: "Success!",
        description: `Created domain group "${hierarchyForm.name}" with ${totalCategories} categories and ${totalSubCategories} sub-categories`,
      });

      // Reset form
      setHierarchyForm({
        industry_segment_id: '',
        name: '',
        description: '',
        categories: [{
          id: crypto.randomUUID(),
          name: '',
          description: '',
          subCategories: [{
            id: crypto.randomUUID(),
            name: '',
            description: ''
          }]
        }]
      });

      setViewMode('overview');
      fetchData();
    } catch (error) {
      console.error('Error saving hierarchy:', error);
      toast({
        title: "Error",
        description: "Failed to save domain group hierarchy",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Excel export
  const exportToExcel = () => {
    try {
      const exportData = domainGroups.map(dg => {
        const domainCategories = getCategoriesForDomainGroup(dg.id);
        return domainCategories.flatMap(cat => {
          const catSubCategories = getSubCategoriesForCategory(cat.id);
          return catSubCategories.map(sub => ({
            'Industry Segment': dg.industry_segment_name || '',
            'Domain Group': dg.name,
            'Domain Group Description': dg.description || '',
            'Category': cat.name,
            'Category Description': cat.description || '',
            'Sub-Category': sub.name,
            'Sub-Category Description': sub.description || '',
            'Active': dg.is_active ? 'Yes' : 'No',
            'Created At': dg.created_at ? new Date(dg.created_at).toLocaleDateString() : ''
          }));
        });
      }).flat();

      const csvContent = [
        Object.keys(exportData[0] || {}).join(','),
        ...exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `domain-groups-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Domain groups data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export domain groups data",
        variant: "destructive",
      });
    }
  };

  // Filter data based on search term
  const filteredDomainGroups = domainGroups.filter(dg => 
    dg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dg.description && dg.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (dg.industry_segment_name && dg.industry_segment_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && viewMode === 'overview') {
    return <div className="flex items-center justify-center h-64">Loading domain groups...</div>;
  }

  // Render Wizard mode
  if (viewMode === 'wizard') {
    return (
      <SupabaseWizard 
        onCancel={() => setViewMode('overview')} 
        onComplete={() => {
          setViewMode('overview');
          fetchData();
        }} 
      />
    );
  }

  // Render Excel Upload mode
  if (viewMode === 'excel') {
    return (
      <ExcelUploadSupabase 
        onCancel={() => setViewMode('overview')} 
        onComplete={() => {
          setViewMode('overview');
          fetchData();
        }} 
      />
    );
  }

  // Render Direct Entry mode
  if (viewMode === 'direct') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setViewMode('overview')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Overview
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Direct Domain Group Entry
                  </CardTitle>
                  <CardDescription>
                    Create domain groups with categories and sub-categories directly
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Direct Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Domain Group Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Industry Segment *</Label>
                <Select 
                  value={hierarchyForm.industry_segment_id} 
                  onValueChange={(value) => setHierarchyForm(prev => ({ ...prev, industry_segment_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {industrySegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Domain Group Name *</Label>
                <Input
                  value={hierarchyForm.name}
                  onChange={(e) => setHierarchyForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter domain group name"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={hierarchyForm.description}
                onChange={(e) => setHierarchyForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter domain group description"
                rows={3}
              />
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Categories</Label>
                <Button onClick={addCategory} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {hierarchyForm.categories.map((category, categoryIndex) => (
                <Card key={category.id} className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-600" />
                        <h4 className="font-medium">Category {categoryIndex + 1}</h4>
                      </div>
                      {hierarchyForm.categories.length > 1 && (
                        <Button
                          onClick={() => removeCategory(category.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Category Name *</Label>
                        <Input
                          value={category.name}
                          onChange={(e) => {
                            const newCategories = [...hierarchyForm.categories];
                            newCategories[categoryIndex].name = e.target.value;
                            setHierarchyForm(prev => ({ ...prev, categories: newCategories }));
                          }}
                          placeholder="Enter category name"
                        />
                      </div>
                      <div>
                        <Label>Category Description</Label>
                        <Input
                          value={category.description}
                          onChange={(e) => {
                            const newCategories = [...hierarchyForm.categories];
                            newCategories[categoryIndex].description = e.target.value;
                            setHierarchyForm(prev => ({ ...prev, categories: newCategories }));
                          }}
                          placeholder="Enter category description"
                        />
                      </div>
                    </div>

                    {/* Sub-Categories */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Sub-Categories</Label>
                        <Button
                          onClick={() => addSubCategory(category.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="w-3 h-3 mr-2" />
                          Add Sub-Category
                        </Button>
                      </div>

                      {category.subCategories.map((subCategory, subIndex) => (
                        <div key={subCategory.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border-l-2 border-purple-300">
                          <span className="text-purple-700 font-medium text-sm min-w-[60px]">
                            {categoryIndex + 1}.{subIndex + 1}
                          </span>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              value={subCategory.name}
                              onChange={(e) => {
                                const newCategories = [...hierarchyForm.categories];
                                newCategories[categoryIndex].subCategories[subIndex].name = e.target.value;
                                setHierarchyForm(prev => ({ ...prev, categories: newCategories }));
                              }}
                              placeholder="Sub-category name"
                              className="h-8"
                            />
                            <Input
                              value={subCategory.description}
                              onChange={(e) => {
                                const newCategories = [...hierarchyForm.categories];
                                newCategories[categoryIndex].subCategories[subIndex].description = e.target.value;
                                setHierarchyForm(prev => ({ ...prev, categories: newCategories }));
                              }}
                              placeholder="Sub-category description"
                              className="h-8"
                            />
                          </div>
                          {category.subCategories.length > 1 && (
                            <Button
                              onClick={() => removeSubCategory(category.id, subCategory.id)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setViewMode('overview')}>
                Cancel
              </Button>
              <Button onClick={saveHierarchyForm} disabled={loading}>
                {loading ? 'Saving...' : 'Save Domain Group'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main overview mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="w-6 h-6" />
                Domain Groups Management
              </CardTitle>
              <CardDescription>
                Manage domain groups with hierarchical categories and sub-categories
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
                onClick={exportToExcel}
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

      {/* Three-Menu Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setViewMode('direct')}
              className="flex items-center gap-2 h-auto p-6 flex-col"
              variant="default"
            >
              <FileText className="w-8 h-8" />
              <div className="text-center">
                <div className="font-semibold text-base">Direct Entry</div>
                <div className="text-sm opacity-90 mt-1">Create complete hierarchies manually</div>
              </div>
            </Button>
            <Button
              onClick={() => setViewMode('wizard')}
              className="flex items-center gap-2 h-auto p-6 flex-col"
              variant="outline"
            >
              <Wand2 className="w-8 h-8" />
              <div className="text-center">
                <div className="font-semibold text-base">Create Using Wizard</div>
                <div className="text-sm opacity-70 mt-1">Step-by-step guided setup</div>
              </div>
            </Button>
            <Button
              onClick={() => setViewMode('excel')}
              className="flex items-center gap-2 h-auto p-6 flex-col"
              variant="outline"
            >
              <Upload className="w-8 h-8" />
              <div className="text-center">
                <div className="font-semibold text-base">Upload Excel</div>
                <div className="text-sm opacity-70 mt-1">Bulk import from spreadsheet</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search domain groups, categories, or industry segments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Industry Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(getGroupedDomainGroups()).length}</div>
            <div className="text-sm text-muted-foreground">Active segments</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Domain Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domainGroups.length}</div>
            <div className="text-sm text-muted-foreground">Total groups configured</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Total categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Sub-Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subCategories.length}</div>
            <div className="text-sm text-muted-foreground">Total sub-categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Hierarchical Display */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Groups Hierarchy</CardTitle>
          <CardDescription>Organized by industry segment with expandable categories</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(getGroupedDomainGroups()).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FolderTree className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No domain groups found</p>
              <p className="mb-6">Get started by creating your first domain group hierarchy.</p>
              <Button onClick={() => setViewMode('direct')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Domain Group
              </Button>
            </div>
          ) : (
            <Accordion type="multiple" value={Array.from(expandedGroups)} className="space-y-4">
              {Object.entries(getGroupedDomainGroups()).map(([industrySegment, groups]) => (
                <div key={industrySegment} className="border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  {/* Industry Segment Header */}
                  <div className="p-6 border-b bg-gradient-to-r from-blue-100 to-indigo-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-blue-900">{industrySegment}</h2>
                        <p className="text-sm text-blue-700">
                          {groups.length} Domain Group{groups.length !== 1 ? 's' : ''} • {' '}
                          {groups.reduce((sum, dg) => sum + getCategoriesForDomainGroup(dg.id).length, 0)} Categories • {' '}
                          {groups.reduce((sum, dg) => 
                            sum + getCategoriesForDomainGroup(dg.id).reduce((catSum, cat) => 
                              catSum + getSubCategoriesForCategory(cat.id).length, 0), 0
                          )} Sub-Categories
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                        Industry Segment
                      </Badge>
                    </div>
                  </div>

                  {/* Domain Groups */}
                  <div className="p-4 space-y-4">
                    {groups.map((domainGroup) => {
                      const { categories: catCount, subCategories: subCatCount } = getHierarchyCounts(domainGroup);
                      const isExpanded = expandedGroups.has(domainGroup.id);
                      const domainCategories = getCategoriesForDomainGroup(domainGroup.id);
                      
                      return (
                        <AccordionItem key={domainGroup.id} value={domainGroup.id} className="border rounded-lg">
                          <AccordionTrigger 
                            className="hover:no-underline px-6 py-4"
                            onClick={() => toggleGroupExpansion(domainGroup.id)}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-left flex-1">
                                <div className="font-semibold text-lg">{domainGroup.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {catCount} Categories • {subCatCount} Sub-Categories
                                  {domainGroup.description && ` • ${domainGroup.description}`}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={domainGroup.is_active ? "default" : "secondary"}>
                                  {domainGroup.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge variant="outline">Domain Group</Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="px-6 pb-4 space-y-3">
                              {domainCategories.map((category, categoryIndex) => {
                                const categorySubCategories = getSubCategoriesForCategory(category.id);
                                return (
                                  <div key={category.id} className="border-l-4 border-l-orange-500 bg-orange-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {categoryIndex + 1}
                                      </span>
                                      <div>
                                        <h4 className="font-semibold text-orange-900">{category.name}</h4>
                                        {category.description && (
                                          <p className="text-sm text-orange-700">{category.description}</p>
                                        )}
                                      </div>
                                      <Badge variant="outline" className="bg-orange-100 text-orange-800 ml-auto">
                                        Category
                                      </Badge>
                                    </div>
                                    
                                    {/* Sub-Categories */}
                                    <div className="space-y-2 ml-6">
                                      {categorySubCategories.map((subCategory, subIndex) => (
                                        <div key={subCategory.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border-l-2 border-purple-300">
                                          <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                                            {categoryIndex + 1}.{subIndex + 1}
                                          </span>
                                          <div className="flex-1">
                                            <h5 className="font-medium text-purple-900">{subCategory.name}</h5>
                                            {subCategory.description && (
                                              <p className="text-sm text-purple-700">{subCategory.description}</p>
                                            )}
                                          </div>
                                          <Badge variant="outline" className="bg-purple-100 text-purple-800">
                                            Sub-Category
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </div>
                </div>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupsConfigSupabase;
