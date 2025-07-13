import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Edit, Trash2, Save, X, RotateCcw, Upload, Download, 
  Wand2, FileText, Database, Eye, FolderTree, Target, Search,
  ChevronDown, ChevronRight, AlertTriangle, Move
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SupabaseWizard from './wizard/SupabaseWizard';
import ExcelUploadSupabase from './upload/ExcelUploadSupabase';
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

interface EditingItem {
  type: 'domain-group' | 'category' | 'sub-category';
  id: string;
  data: any;
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
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [showDirectEntry, setShowDirectEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Edit/Delete states
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, item: any, type: string} | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

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

  // CRUD Operations
  const handleEdit = (type: EditingItem['type'], item: any) => {
    setEditingItem({ type, id: item.id, data: { ...item } });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const { type, id, data } = editingItem;
      let error;
      
      switch (type) {
        case 'domain-group':
          ({ error } = await supabase.from('master_domain_groups').update(data).eq('id', id));
          break;
        case 'category':
          ({ error } = await supabase.from('master_categories').update(data).eq('id', id));
          break;
        case 'sub-category':
          ({ error } = await supabase.from('master_sub_categories').update(data).eq('id', id));
          break;
      }

      if (error) throw error;

      setEditingItem(null);
      setShowEditDialog(false);
      fetchData();
      toast({
        title: "Success",
        description: `${type.replace('-', ' ')} updated successfully`,
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (type: string, item: any) => {
    try {
      let table = '';
      let cascadeMessage = '';
      
      switch (type) {
        case 'domain-group':
          table = 'master_domain_groups';
          const domainCategories = categories.filter(c => c.domain_group_id === item.id);
          const domainSubCategories = subCategories.filter(sc => 
            domainCategories.some(c => c.id === sc.category_id)
          );
          cascadeMessage = `This will also delete ${domainCategories.length} categories and ${domainSubCategories.length} sub-categories.`;
          break;
        case 'category':
          table = 'master_categories';
          const categorySubCategories = subCategories.filter(sc => sc.category_id === item.id);
          cascadeMessage = `This will also delete ${categorySubCategories.length} sub-categories.`;
          break;
        case 'sub-category':
          table = 'master_sub_categories';
          cascadeMessage = 'This action cannot be undone.';
          break;
      }

      // First delete children if necessary
      if (type === 'domain-group') {
        const domainCategories = categories.filter(c => c.domain_group_id === item.id);
        for (const category of domainCategories) {
          await supabase.from('master_sub_categories').delete().eq('category_id', category.id);
        }
        await supabase.from('master_categories').delete().eq('domain_group_id', item.id);
      } else if (type === 'category') {
        await supabase.from('master_sub_categories').delete().eq('category_id', item.id);
      }

      let error;
      switch (type) {
        case 'domain-group':
          ({ error } = await supabase.from('master_domain_groups').delete().eq('id', item.id));
          break;
        case 'category':
          ({ error } = await supabase.from('master_categories').delete().eq('id', item.id));
          break;
        case 'sub-category':
          ({ error } = await supabase.from('master_sub_categories').delete().eq('id', item.id));
          break;
      }
      if (error) throw error;

      setDeleteDialog(null);
      fetchData();
      toast({
        title: "Deleted",
        description: `${type.replace('-', ' ')} deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (type: string, item: any) => {
    try {
      let error;
      switch (type) {
        case 'domain-group':
          ({ error } = await supabase.from('master_domain_groups').update({ is_active: !item.is_active }).eq('id', item.id));
          break;
        case 'category':
          ({ error } = await supabase.from('master_categories').update({ is_active: !item.is_active }).eq('id', item.id));
          break;
        case 'sub-category':
          ({ error } = await supabase.from('master_sub_categories').update({ is_active: !item.is_active }).eq('id', item.id));
          break;
      }

      if (error) throw error;

      fetchData();
      toast({
        title: "Status Updated",
        description: `${type.replace('-', ' ')} ${!item.is_active ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  // Add operations (keeping existing functionality)
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

  // Utility functions
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

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Filter data based on search term
  const filteredDomainGroups = domainGroups.filter(dg => 
    dg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dg.description && dg.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading hierarchy data...</div>;
  }

  if (showWizard) {
    return (
      <SupabaseWizard 
        onCancel={() => setShowWizard(false)} 
        onComplete={() => {
          setShowWizard(false);
          fetchData();
        }} 
      />
    );
  }

  if (showExcelUpload) {
    return (
      <ExcelUploadSupabase 
        onCancel={() => setShowExcelUpload(false)} 
        onComplete={() => {
          setShowExcelUpload(false);
          fetchData();
        }} 
      />
    );
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
              onClick={() => setShowExcelUpload(true)}
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

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search domain groups, categories, or sub-categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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

      {/* Hierarchy View */}
      <Card>
        <CardHeader>
          <CardTitle>Hierarchy Overview</CardTitle>
          <CardDescription>Complete hierarchy with edit and delete capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDomainGroups.map((domainGroup) => {
              const domainCategories = getCategoriesForDomainGroup(domainGroup.id);
              const isExpanded = expandedItems.has(domainGroup.id);
              
              return (
                <div key={domainGroup.id} className="border rounded-lg p-4">
                  {/* Domain Group Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(domainGroup.id)}
                        className="p-1 h-auto"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                      <Target className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{domainGroup.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getIndustrySegmentName(domainGroup.industry_segment_id)} • {domainCategories.length} categories
                        </p>
                      </div>
                      <Badge variant={domainGroup.is_active ? "default" : "secondary"}>
                        {domainGroup.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={domainGroup.is_active}
                        onCheckedChange={() => handleToggleStatus('domain-group', domainGroup)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit('domain-group', domainGroup)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteDialog({
                          open: true,
                          item: domainGroup,
                          type: 'domain-group'
                        })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Categories */}
                  {isExpanded && (
                    <div className="ml-8 mt-4 space-y-3">
                      {domainCategories.map((category) => {
                        const categorySubCategories = getSubCategoriesForCategory(category.id);
                        const isCategoryExpanded = expandedItems.has(category.id);
                        
                        return (
                          <div key={category.id} className="border-l-2 border-muted pl-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpanded(category.id)}
                                  className="p-1 h-auto"
                                >
                                  {isCategoryExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </Button>
                                <Database className="w-4 h-4 text-secondary-foreground" />
                                <div>
                                  <h4 className="font-medium">{category.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {categorySubCategories.length} sub-categories
                                  </p>
                                </div>
                                <Badge variant={category.is_active ? "default" : "secondary"}>
                                  {category.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={category.is_active}
                                  onCheckedChange={() => handleToggleStatus('category', category)}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit('category', category)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setDeleteDialog({
                                    open: true,
                                    item: category,
                                    type: 'category'
                                  })}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Sub-Categories */}
                            {isCategoryExpanded && (
                              <div className="ml-8 mt-3 space-y-2">
                                {categorySubCategories.map((subCategory) => (
                                  <div key={subCategory.id} className="border-l-2 border-muted-foreground/30 pl-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 flex-1">
                                        <FolderTree className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                          <h5 className="font-medium text-sm">{subCategory.name}</h5>
                                          {subCategory.description && (
                                            <p className="text-xs text-muted-foreground">{subCategory.description}</p>
                                          )}
                                        </div>
                                        <Badge variant={subCategory.is_active ? "default" : "secondary"} className="text-xs">
                                          {subCategory.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={subCategory.is_active}
                                          onCheckedChange={() => handleToggleStatus('sub-category', subCategory)}
                                        />
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleEdit('sub-category', subCategory)}
                                        >
                                          <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => setDeleteDialog({
                                            open: true,
                                            item: subCategory,
                                            type: 'sub-category'
                                          })}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
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
        </CardContent>
      </Card>

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
                    <div className="flex flex-col gap-2 justify-end">
                      <Button 
                        onClick={handleAddDomainGroup}
                        disabled={!newDomainGroup.name.trim()}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsAdding({ ...isAdding, domainGroup: false });
                          setNewDomainGroup({ name: '', description: '', industry_segment_id: '', is_active: true });
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
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
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No domain groups available. Please add domain groups first.</p>
                  </div>
                )}

                {isAdding.category && (
                  <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
                    <div className="flex-1 space-y-2">
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
                            {domainGroups.filter(dg => dg.is_active).map((domainGroup) => (
                              <SelectItem key={domainGroup.id} value={domainGroup.id}>
                                {domainGroup.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-end">
                      <Button 
                        onClick={handleAddCategory}
                        disabled={!newCategory.name.trim() || !newCategory.domain_group_id}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsAdding({ ...isAdding, category: false });
                          setNewCategory({ name: '', description: '', domain_group_id: '', is_active: true });
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
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
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderTree className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No categories available. Please add categories first.</p>
                  </div>
                )}

                {isAdding.subCategory && (
                  <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
                    <div className="flex-1 space-y-2">
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
                            {categories.filter(c => c.is_active).map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name} ({getDomainGroupName(category.domain_group_id)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-end">
                      <Button 
                        onClick={handleAddSubCategory}
                        disabled={!newSubCategory.name.trim() || !newSubCategory.category_id}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsAdding({ ...isAdding, subCategory: false });
                          setNewSubCategory({ name: '', description: '', category_id: '', is_active: true });
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Edit {editingItem?.type.replace('-', ' ')}
            </DialogTitle>
            <DialogDescription>
              Make changes to the {editingItem?.type.replace('-', ' ')} details below.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingItem.data.name || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, name: e.target.value }
                  })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.data.description || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, description: e.target.value }
                  })}
                  placeholder="Enter description (optional)"
                  rows={3}
                />
              </div>
              {editingItem.type === 'domain-group' && (
                <div>
                  <Label htmlFor="edit-industry-segment">Industry Segment</Label>
                  <Select
                    value={editingItem.data.industry_segment_id || 'none'}
                    onValueChange={(value) => setEditingItem({
                      ...editingItem,
                      data: { 
                        ...editingItem.data, 
                        industry_segment_id: value === 'none' ? null : value 
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry segment" />
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
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editingItem.data.is_active}
                  onCheckedChange={(checked) => setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, is_active: checked }
                  })}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteDialog?.open || false} 
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog?.item?.name}"?
              {deleteDialog?.type === 'domain-group' && (
                <>
                  <br /><br />
                  <strong>Warning:</strong> This will also delete all associated categories and sub-categories.
                </>
              )}
              {deleteDialog?.type === 'category' && (
                <>
                  <br /><br />
                  <strong>Warning:</strong> This will also delete all associated sub-categories.
                </>
              )}
              <br /><br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog && handleDelete(deleteDialog.type, deleteDialog.item)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DomainGroupsConfigSupabase;
