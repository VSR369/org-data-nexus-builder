import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Database, Pencil, Plus, Search, Trash2, Folder, FolderTree, Eye, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager } from '@/utils/dataManager';
import { DomainGroup, Category, SubCategory, DomainGroupsData } from '@/types/domainGroups';

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
  const [industrySegments, setIndustrySegments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState<string>('');
  
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
    console.log('📊 Loaded industry segments:', loadedSegments);
    
    setData(loadedData);
    // Filter out any empty, null, or undefined values from industry segments
    const validSegments = Array.isArray(loadedSegments) 
      ? loadedSegments.filter(segment => segment && typeof segment === 'string' && segment.trim() !== '')
      : [];
    console.log('✅ Valid industry segments after filtering:', validSegments);
    setIndustrySegments(validSegments);
  }, []);
  
  // Helper functions
  const getIndustrySegmentName = (segmentId: string): string => {
    return segmentId; // Since segments are stored as strings, the ID is the name
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
  const filteredDomainGroups = data.domainGroups.filter(dg => {
    const matchesSearch = dg.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = !selectedIndustrySegment || dg.industrySegmentId === selectedIndustrySegment;
    return matchesSearch && matchesSegment;
  });
  
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
    
    const domainGroup: DomainGroup = {
      id: Date.now().toString(),
      name: newDomainGroup.name,
      description: newDomainGroup.description || undefined,
      industrySegmentId: newDomainGroup.industrySegmentId,
      industrySegmentName: getIndustrySegmentName(newDomainGroup.industrySegmentId),
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
    
    const updatedData = {
      ...data,
      domainGroups: data.domainGroups.map(dg => 
        dg.id === editingDomainGroup.id 
          ? { ...editingDomainGroup, industrySegmentName: getIndustrySegmentName(editingDomainGroup.industrySegmentId) }
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

  // Helper function to render hierarchy view
  const renderHierarchyView = () => {
    const hierarchyData = data.domainGroups
      .filter(dg => {
        const matchesSearch = dg.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSegment = !selectedIndustrySegment || selectedIndustrySegment === 'all-segments' || dg.industrySegmentId === selectedIndustrySegment;
        return matchesSearch && matchesSegment;
      })
      .map(domainGroup => ({
        ...domainGroup,
        categories: data.categories
          .filter(cat => cat.domainGroupId === domainGroup.id)
          .map(category => ({
            ...category,
            subCategories: data.subCategories.filter(sub => sub.categoryId === category.id)
          }))
      }));

    return (
      <div className="space-y-4">
        {hierarchyData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No domain groups found matching your criteria.</p>
          </div>
        ) : (
          hierarchyData.map((domainGroup) => (
            <Card key={domainGroup.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{domainGroup.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{getIndustrySegmentName(domainGroup.industrySegmentId)}</Badge>
                      <Badge variant={domainGroup.isActive ? "default" : "secondary"}>
                        {domainGroup.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {domainGroup.description && (
                      <p className="text-sm text-muted-foreground mt-2">{domainGroup.description}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {domainGroup.categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No categories defined</p>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {domainGroup.categories.map((category) => (
                      <AccordionItem key={category.id} value={category.id}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4" />
                            <span className="font-medium">{category.name}</span>
                            <Badge variant={category.isActive ? "default" : "secondary"} className="ml-2">
                              {category.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({category.subCategories.length} sub-categories)
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                          {category.description && (
                            <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                          )}
                          {category.subCategories.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic ml-4">No sub-categories defined</p>
                          ) : (
                            <div className="space-y-2 ml-4">
                              {category.subCategories.map((subCategory) => (
                                <div key={subCategory.id} className="flex items-center justify-between p-2 bg-muted/30 rounded border-l-2 border-l-green-400">
                                  <div>
                                    <div className="font-medium text-sm">{subCategory.name}</div>
                                    {subCategory.description && (
                                      <div className="text-xs text-muted-foreground">{subCategory.description}</div>
                                    )}
                                  </div>
                                  <Badge variant={subCategory.isActive ? "default" : "secondary"}>
                                    {subCategory.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Domain Groups Management</h1>
          <p className="text-muted-foreground">Manage hierarchical domain groups, categories, and sub-categories</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Domain Groups Configuration
          </CardTitle>
          <CardDescription>
            Create and manage domain groups or view the complete hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Create & Manage
              </TabsTrigger>
              <TabsTrigger value="view" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Hierarchy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6 mt-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedIndustrySegment} onValueChange={setSelectedIndustrySegment}>
                  <SelectTrigger className="w-full sm:w-[250px]">
                    <SelectValue placeholder="Filter by Industry Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-segments">All Industry Segments</SelectItem>
                    {industrySegments.map((segment, index) => (
                      <SelectItem key={index} value={segment}>
                        {segment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Domain Groups Section */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Domain Groups</CardTitle>
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
                                {industrySegments.map((segment, index) => (
                                  <SelectItem key={index} value={segment}>
                                    {segment}
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
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Category</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Domain Group *</Label>
                            <Select value={newCategory.domainGroupId} onValueChange={(value) => setNewCategory({...newCategory, domainGroupId: value})}>
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
                              value={newCategory.name}
                              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                              placeholder="e.g., Mobile Banking"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea 
                              value={newCategory.description}
                              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleAddCategory}>Add Category</Button>
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
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Sub Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Sub Category</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Category *</Label>
                            <Select value={newSubCategory.categoryId} onValueChange={(value) => setNewSubCategory({...newSubCategory, categoryId: value})}>
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
                              value={newSubCategory.name}
                              onChange={(e) => setNewSubCategory({...newSubCategory, name: e.target.value})}
                              placeholder="e.g., Account Management"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea 
                              value={newSubCategory.description}
                              onChange={(e) => setNewSubCategory({...newSubCategory, description: e.target.value})}
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsSubCategoryDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleAddSubCategory}>Add Sub Category</Button>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="view" className="space-y-4 mt-6">
              {/* Search and Filter for View */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search hierarchy..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedIndustrySegment} onValueChange={setSelectedIndustrySegment}>
                  <SelectTrigger className="w-full sm:w-[250px]">
                    <SelectValue placeholder="Filter by Industry Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-segments">All Industry Segments</SelectItem>
                    {industrySegments.map((segment, index) => (
                      <SelectItem key={index} value={segment}>
                        {segment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {renderHierarchyView()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupsConfig;

</edits_to_apply>
