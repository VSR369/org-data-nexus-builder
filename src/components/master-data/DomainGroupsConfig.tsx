
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Database, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager } from '@/utils/dataManager';
import { DomainGroup, Category, SubCategory, DomainGroupsData } from '@/types/domainGroups';

// Industry Segment interface to match the master data structure
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

const industrySegmentDataManager = new DataManager({
  key: 'master_data_industry_segments',
  defaultData: [],
  version: 1
});

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>(defaultDomainGroupsData);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [isDomainGroupDialogOpen, setIsDomainGroupDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubCategoryDialogOpen, setIsSubCategoryDialogOpen] = useState(false);
  
  // Edit states
  const [editingDomainGroup, setEditingDomainGroup] = useState<DomainGroup | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  
  // Form states
  const [newDomainGroup, setNewDomainGroup] = useState({
    name: '',
    description: '',
    industrySegmentId: '',
    isActive: true
  });
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    domainGroupId: '',
    isActive: true
  });
  
  const [newSubCategory, setNewSubCategory] = useState({
    name: '',
    description: '',
    categoryId: '',
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
    
    // Handle industry segments properly - they should be objects with id, name, code
    const validSegments: IndustrySegment[] = Array.isArray(loadedSegments) 
      ? loadedSegments.filter(segment => 
          segment && 
          typeof segment === 'object' && 
          segment.id && 
          segment.name && 
          segment.isActive
        )
      : [];
    
    console.log('✅ Valid industry segments after filtering:', validSegments);
    setIndustrySegments(validSegments);
  }, []);
  
  // Helper functions
  const getIndustrySegmentName = (segmentId: string): string => {
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.name : 'Unknown Segment';
  };
  
  const getDomainGroupName = (domainGroupId: string): string => {
    const domainGroup = data.domainGroups.find(dg => dg.id === domainGroupId);
    return domainGroup ? domainGroup.name : 'Unknown';
  };
  
  const getCategoryName = (categoryId: string): string => {
    const category = data.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  // Filter functions
  const filteredDomainGroups = data.domainGroups.filter(dg => 
    dg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCategories = data.categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSubCategories = data.subCategories.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // CRUD Operations for Domain Groups
  const handleAddDomainGroup = () => {
    if (!newDomainGroup.name || !newDomainGroup.industrySegmentId) {
      toast({
        title: "Validation Error",
        description: "Name and Industry Segment are required",
        variant: "destructive"
      });
      return;
    }
    
    const segment = industrySegments.find(s => s.id === newDomainGroup.industrySegmentId);
    
    const domainGroup: DomainGroup = {
      id: Date.now().toString(),
      name: newDomainGroup.name,
      description: newDomainGroup.description || undefined,
      industrySegmentId: newDomainGroup.industrySegmentId,
      industrySegmentName: segment ? segment.name : 'Unknown',
      isActive: newDomainGroup.isActive,
      createdAt: new Date().toISOString()
    };
    
    const updatedData = {
      ...data,
      domainGroups: [...data.domainGroups, domainGroup]
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    setNewDomainGroup({ name: '', description: '', industrySegmentId: '', isActive: true });
    setIsDomainGroupDialogOpen(false);
    
    toast({
      title: "Domain Group Added",
      description: `Successfully added ${domainGroup.name}`,
    });
  };
  
  const handleEditDomainGroup = () => {
    if (!editingDomainGroup?.name || !editingDomainGroup?.industrySegmentId) {
      toast({
        title: "Validation Error",
        description: "Name and Industry Segment are required",
        variant: "destructive"
      });
      return;
    }
    
    const segment = industrySegments.find(s => s.id === editingDomainGroup.industrySegmentId);
    
    const updatedData = {
      ...data,
      domainGroups: data.domainGroups.map(dg => 
        dg.id === editingDomainGroup.id 
          ? { ...editingDomainGroup, industrySegmentName: segment ? segment.name : 'Unknown' }
          : dg
      )
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    setEditingDomainGroup(null);
    setIsDomainGroupDialogOpen(false);
    
    toast({
      title: "Domain Group Updated",
      description: `Successfully updated ${editingDomainGroup.name}`,
    });
  };
  
  const handleDeleteDomainGroup = (id: string) => {
    const updatedData = {
      ...data,
      domainGroups: data.domainGroups.filter(dg => dg.id !== id),
      categories: data.categories.filter(cat => cat.domainGroupId !== id),
      subCategories: data.subCategories.filter(sub => {
        const category = data.categories.find(cat => cat.id === sub.categoryId);
        return category?.domainGroupId !== id;
      })
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    toast({
      title: "Domain Group Deleted",
      description: "Domain group and all related categories have been deleted",
    });
  };
  
  // CRUD Operations for Categories
  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.domainGroupId) {
      toast({
        title: "Validation Error",
        description: "Name and Domain Group are required",
        variant: "destructive"
      });
      return;
    }
    
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description || undefined,
      domainGroupId: newCategory.domainGroupId,
      isActive: newCategory.isActive,
      createdAt: new Date().toISOString()
    };
    
    const updatedData = {
      ...data,
      categories: [...data.categories, category]
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    setNewCategory({ name: '', description: '', domainGroupId: '', isActive: true });
    setIsCategoryDialogOpen(false);
    
    toast({
      title: "Category Added",
      description: `Successfully added ${category.name}`,
    });
  };

  const handleEditCategory = () => {
    if (!editingCategory?.name || !editingCategory?.domainGroupId) {
      toast({
        title: "Validation Error",
        description: "Name and Domain Group are required",
        variant: "destructive"
      });
      return;
    }
    
    const updatedData = {
      ...data,
      categories: data.categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      )
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    setEditingCategory(null);
    setIsCategoryDialogOpen(false);
    
    toast({
      title: "Category Updated",
      description: `Successfully updated ${editingCategory.name}`,
    });
  };

  const handleDeleteCategory = (id: string) => {
    const updatedData = {
      ...data,
      categories: data.categories.filter(cat => cat.id !== id),
      subCategories: data.subCategories.filter(sub => sub.categoryId !== id)
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    toast({
      title: "Category Deleted",
      description: "Category and all related sub-categories have been deleted",
    });
  };
  
  // CRUD Operations for Sub Categories
  const handleAddSubCategory = () => {
    if (!newSubCategory.name || !newSubCategory.categoryId) {
      toast({
        title: "Validation Error",
        description: "Name and Category are required",
        variant: "destructive"
      });
      return;
    }
    
    const subCategory: SubCategory = {
      id: Date.now().toString(),
      name: newSubCategory.name,
      description: newSubCategory.description || undefined,
      categoryId: newSubCategory.categoryId,
      isActive: newSubCategory.isActive,
      createdAt: new Date().toISOString()
    };
    
    const updatedData = {
      ...data,
      subCategories: [...data.subCategories, subCategory]
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    setNewSubCategory({ name: '', description: '', categoryId: '', isActive: true });
    setIsSubCategoryDialogOpen(false);
    
    toast({
      title: "Sub Category Added",
      description: `Successfully added ${subCategory.name}`,
    });
  };

  const handleEditSubCategory = () => {
    if (!editingSubCategory?.name || !editingSubCategory?.categoryId) {
      toast({
        title: "Validation Error",
        description: "Name and Category are required",
        variant: "destructive"
      });
      return;
    }
    
    const updatedData = {
      ...data,
      subCategories: data.subCategories.map(sub => 
        sub.id === editingSubCategory.id ? editingSubCategory : sub
      )
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    setEditingSubCategory(null);
    setIsSubCategoryDialogOpen(false);
    
    toast({
      title: "Sub Category Updated",
      description: `Successfully updated ${editingSubCategory.name}`,
    });
  };

  const handleDeleteSubCategory = (id: string) => {
    const updatedData = {
      ...data,
      subCategories: data.subCategories.filter(sub => sub.id !== id)
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    toast({
      title: "Sub Category Deleted",
      description: "Sub category has been deleted",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Domain Groups Management</h1>
          <p className="text-muted-foreground">Manage hierarchical domain groups, categories, and sub-categories</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search across all sections..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Domain Groups Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Domain Groups
            </CardTitle>
            <Dialog open={isDomainGroupDialogOpen} onOpenChange={setIsDomainGroupDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingDomainGroup(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Domain Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingDomainGroup ? 'Edit Domain Group' : 'Add Domain Group'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Industry Segment *</Label>
                    <Select 
                      value={editingDomainGroup ? editingDomainGroup.industrySegmentId : newDomainGroup.industrySegmentId}
                      onValueChange={(value) => {
                        if (editingDomainGroup) {
                          setEditingDomainGroup({...editingDomainGroup, industrySegmentId: value});
                        } else {
                          setNewDomainGroup({...newDomainGroup, industrySegmentId: value});
                        }
                      }}
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
                  </div>
                  <div className="space-y-2">
                    <Label>Domain Group Name *</Label>
                    <Input 
                      value={editingDomainGroup ? editingDomainGroup.name : newDomainGroup.name}
                      onChange={(e) => {
                        if (editingDomainGroup) {
                          setEditingDomainGroup({...editingDomainGroup, name: e.target.value});
                        } else {
                          setNewDomainGroup({...newDomainGroup, name: e.target.value});
                        }
                      }}
                      placeholder="e.g., Digital Banking"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={editingDomainGroup ? editingDomainGroup.description || '' : newDomainGroup.description}
                      onChange={(e) => {
                        if (editingDomainGroup) {
                          setEditingDomainGroup({...editingDomainGroup, description: e.target.value});
                        } else {
                          setNewDomainGroup({...newDomainGroup, description: e.target.value});
                        }
                      }}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={editingDomainGroup ? editingDomainGroup.isActive : newDomainGroup.isActive}
                      onCheckedChange={(checked) => {
                        if (editingDomainGroup) {
                          setEditingDomainGroup({...editingDomainGroup, isActive: checked});
                        } else {
                          setNewDomainGroup({...newDomainGroup, isActive: checked});
                        }
                      }}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDomainGroupDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingDomainGroup ? handleEditDomainGroup : handleAddDomainGroup}>
                    {editingDomainGroup ? 'Update' : 'Add'} Domain Group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry Segment</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDomainGroups.map((domainGroup) => (
                <TableRow key={domainGroup.id}>
                  <TableCell className="font-medium">{domainGroup.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getIndustrySegmentName(domainGroup.industrySegmentId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {domainGroup.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={domainGroup.isActive ? "default" : "secondary"}>
                      {domainGroup.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingDomainGroup(domainGroup);
                          setIsDomainGroupDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteDomainGroup(domainGroup.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Categories</CardTitle>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCategory(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Add Category'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Domain Group *</Label>
                    <Select 
                      value={editingCategory ? editingCategory.domainGroupId : newCategory.domainGroupId} 
                      onValueChange={(value) => {
                        if (editingCategory) {
                          setEditingCategory({...editingCategory, domainGroupId: value});
                        } else {
                          setNewCategory({...newCategory, domainGroupId: value});
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Domain Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.domainGroups.filter(dg => dg.isActive).map((domainGroup) => (
                          <SelectItem key={domainGroup.id} value={domainGroup.id}>
                            {domainGroup.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category Name *</Label>
                    <Input 
                      value={editingCategory ? editingCategory.name : newCategory.name}
                      onChange={(e) => {
                        if (editingCategory) {
                          setEditingCategory({...editingCategory, name: e.target.value});
                        } else {
                          setNewCategory({...newCategory, name: e.target.value});
                        }
                      }}
                      placeholder="e.g., Mobile Banking"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={editingCategory ? editingCategory.description || '' : newCategory.description}
                      onChange={(e) => {
                        if (editingCategory) {
                          setEditingCategory({...editingCategory, description: e.target.value});
                        } else {
                          setNewCategory({...newCategory, description: e.target.value});
                        }
                      }}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={editingCategory ? editingCategory.isActive : newCategory.isActive}
                      onCheckedChange={(checked) => {
                        if (editingCategory) {
                          setEditingCategory({...editingCategory, isActive: checked});
                        } else {
                          setNewCategory({...newCategory, isActive: checked});
                        }
                      }}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                  <Button onClick={editingCategory ? handleEditCategory : handleAddCategory}>
                    {editingCategory ? 'Update' : 'Add'} Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain Group</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getDomainGroupName(category.domainGroupId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingCategory(category);
                          setIsCategoryDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sub Categories Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sub Categories</CardTitle>
            <Dialog open={isSubCategoryDialogOpen} onOpenChange={setIsSubCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingSubCategory(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sub Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select 
                      value={editingSubCategory ? editingSubCategory.categoryId : newSubCategory.categoryId} 
                      onValueChange={(value) => {
                        if (editingSubCategory) {
                          setEditingSubCategory({...editingSubCategory, categoryId: value});
                        } else {
                          setNewSubCategory({...newSubCategory, categoryId: value});
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.categories.filter(cat => cat.isActive).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sub Category Name *</Label>
                    <Input 
                      value={editingSubCategory ? editingSubCategory.name : newSubCategory.name}
                      onChange={(e) => {
                        if (editingSubCategory) {
                          setEditingSubCategory({...editingSubCategory, name: e.target.value});
                        } else {
                          setNewSubCategory({...newSubCategory, name: e.target.value});
                        }
                      }}
                      placeholder="e.g., Account Management"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={editingSubCategory ? editingSubCategory.description || '' : newSubCategory.description}
                      onChange={(e) => {
                        if (editingSubCategory) {
                          setEditingSubCategory({...editingSubCategory, description: e.target.value});
                        } else {
                          setNewSubCategory({...newSubCategory, description: e.target.value});
                        }
                      }}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={editingSubCategory ? editingSubCategory.isActive : newSubCategory.isActive}
                      onCheckedChange={(checked) => {
                        if (editingSubCategory) {
                          setEditingSubCategory({...editingSubCategory, isActive: checked});
                        } else {
                          setNewSubCategory({...newSubCategory, isActive: checked});
                        }
                      }}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSubCategoryDialogOpen(false)}>Cancel</Button>
                  <Button onClick={editingSubCategory ? handleEditSubCategory : handleAddSubCategory}>
                    {editingSubCategory ? 'Update' : 'Add'} Sub Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubCategories.map((subCategory) => (
                <TableRow key={subCategory.id}>
                  <TableCell className="font-medium">{subCategory.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryName(subCategory.categoryId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {subCategory.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={subCategory.isActive ? "default" : "secondary"}>
                      {subCategory.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingSubCategory(subCategory);
                          setIsSubCategoryDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteSubCategory(subCategory.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupsConfig;
