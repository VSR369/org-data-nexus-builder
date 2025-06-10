
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Factory, Plus, Search, FolderTree, Layers, Tag } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager } from '@/utils/dataManager';

// Types
interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industrySegmentId: string;
  isActive: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  domainGroupId: string;
  isActive: boolean;
  createdAt: string;
}

interface SubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
}

interface DomainGroupsData {
  domainGroups: DomainGroup[];
  categories: Category[];
  subCategories: SubCategory[];
}

// Data manager
const domainGroupsDataManager = new DataManager({
  key: 'master_data_domain_groups_hierarchy',
  defaultData: { domainGroups: [], categories: [], subCategories: [] } as DomainGroupsData,
  version: 1
});

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>({ domainGroups: [], categories: [], subCategories: [] });
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState('all');
  const [selectedDomainGroup, setSelectedDomainGroup] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Dialog states
  const [isDomainGroupDialogOpen, setIsDomainGroupDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubCategoryDialogOpen, setIsSubCategoryDialogOpen] = useState(false);
  
  // Form states
  const [newDomainGroup, setNewDomainGroup] = useState({
    name: '',
    description: '',
    industrySegmentId: ''
  });
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    domainGroupId: ''
  });
  
  const [newSubCategory, setNewSubCategory] = useState({
    name: '',
    description: '',
    categoryId: ''
  });
  
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadedData = domainGroupsDataManager.loadData();
    setData(loadedData);

    // Load industry segments
    const savedIndustrySegments = localStorage.getItem('master_data_industry_segments');
    if (savedIndustrySegments) {
      try {
        const industrySegmentsData: IndustrySegment[] = JSON.parse(savedIndustrySegments);
        setIndustrySegments(industrySegmentsData.filter(segment => segment.isActive));
      } catch (error) {
        console.error('Error parsing industry segments data:', error);
        setIndustrySegments([]);
      }
    }
  }, []);

  // Helper functions
  const getIndustrySegmentName = (segmentId: string) => {
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.name : 'Unknown Segment';
  };

  const getDomainGroupName = (domainGroupId: string) => {
    const domainGroup = data.domainGroups.find(dg => dg.id === domainGroupId);
    return domainGroup ? domainGroup.name : 'Unknown Domain Group';
  };

  const getCategoryName = (categoryId: string) => {
    const category = data.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // CRUD operations
  const handleAddDomainGroup = () => {
    if (!newDomainGroup.name || !newDomainGroup.industrySegmentId) {
      toast({
        title: "Validation Error",
        description: "Name and industry segment are required fields",
        variant: "destructive"
      });
      return;
    }

    const domainGroupToAdd: DomainGroup = {
      id: (data.domainGroups.length + 1).toString(),
      name: newDomainGroup.name,
      description: newDomainGroup.description || undefined,
      industrySegmentId: newDomainGroup.industrySegmentId,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      domainGroups: [...data.domainGroups, domainGroupToAdd]
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    setNewDomainGroup({ name: '', description: '', industrySegmentId: '' });
    setIsDomainGroupDialogOpen(false);

    toast({
      title: "Domain Group Added",
      description: `Successfully added ${domainGroupToAdd.name}`,
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.domainGroupId) {
      toast({
        title: "Validation Error",
        description: "Name and domain group are required fields",
        variant: "destructive"
      });
      return;
    }

    const categoryToAdd: Category = {
      id: (data.categories.length + 1).toString(),
      name: newCategory.name,
      description: newCategory.description || undefined,
      domainGroupId: newCategory.domainGroupId,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      categories: [...data.categories, categoryToAdd]
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    setNewCategory({ name: '', description: '', domainGroupId: '' });
    setIsCategoryDialogOpen(false);

    toast({
      title: "Category Added",
      description: `Successfully added ${categoryToAdd.name}`,
    });
  };

  const handleAddSubCategory = () => {
    if (!newSubCategory.name || !newSubCategory.categoryId) {
      toast({
        title: "Validation Error",
        description: "Name and category are required fields",
        variant: "destructive"
      });
      return;
    }

    const subCategoryToAdd: SubCategory = {
      id: (data.subCategories.length + 1).toString(),
      name: newSubCategory.name,
      description: newSubCategory.description || undefined,
      categoryId: newSubCategory.categoryId,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      subCategories: [...data.subCategories, subCategoryToAdd]
    };
    
    setData(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    setNewSubCategory({ name: '', description: '', categoryId: '' });
    setIsSubCategoryDialogOpen(false);

    toast({
      title: "Sub Category Added",
      description: `Successfully added ${subCategoryToAdd.name}`,
    });
  };

  // Filter functions
  const getFilteredDomainGroups = () => {
    return data.domainGroups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustrySegment = selectedIndustrySegment === 'all' || group.industrySegmentId === selectedIndustrySegment;
      return matchesSearch && matchesIndustrySegment;
    });
  };

  const getFilteredCategories = () => {
    return data.categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomainGroup = selectedDomainGroup === 'all' || category.domainGroupId === selectedDomainGroup;
      return matchesSearch && matchesDomainGroup;
    });
  };

  const getFilteredSubCategories = () => {
    return data.subCategories.filter(subCategory => {
      const matchesSearch = subCategory.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || subCategory.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Domain Groups Hierarchy</h1>
          <p className="text-muted-foreground">Manage domain groups, categories, and sub-categories</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="w-5 h-5" />
            Domain Groups Management
          </CardTitle>
          <CardDescription>
            Create and manage hierarchical domain groups with categories and sub-categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="domain-groups" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="domain-groups" className="flex items-center gap-2">
                <Factory className="w-4 h-4" />
                Domain Groups
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="sub-categories" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Sub Categories
              </TabsTrigger>
            </TabsList>

            {/* Search and Filters */}
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
            </div>

            {/* Domain Groups Tab */}
            <TabsContent value="domain-groups" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Select value={selectedIndustrySegment} onValueChange={setSelectedIndustrySegment}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Filter by industry segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industry Segments</SelectItem>
                      {industrySegments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{segment.code}</Badge>
                            {segment.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={isDomainGroupDialogOpen} onOpenChange={setIsDomainGroupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Domain Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Domain Group</DialogTitle>
                      <DialogDescription>Create a new domain group and assign it to an industry segment.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="dg-name">Domain Group Name *</Label>
                        <Input 
                          id="dg-name"
                          value={newDomainGroup.name}
                          onChange={(e) => setNewDomainGroup({...newDomainGroup, name: e.target.value})}
                          placeholder="e.g., Core Banking"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dg-industry">Industry Segment *</Label>
                        <Select 
                          value={newDomainGroup.industrySegmentId} 
                          onValueChange={(value) => setNewDomainGroup({...newDomainGroup, industrySegmentId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an industry segment" />
                          </SelectTrigger>
                          <SelectContent>
                            {industrySegments.map((segment) => (
                              <SelectItem key={segment.id} value={segment.id}>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">{segment.code}</Badge>
                                  {segment.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dg-desc">Description</Label>
                        <Input 
                          id="dg-desc"
                          value={newDomainGroup.description}
                          onChange={(e) => setNewDomainGroup({...newDomainGroup, description: e.target.value})}
                          placeholder="Brief description"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDomainGroupDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddDomainGroup}>Add Domain Group</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain Group</TableHead>
                    <TableHead>Industry Segment</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredDomainGroups().map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell>{getIndustrySegmentName(group.industrySegmentId)}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-[300px] truncate">
                        {group.description || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={group.isActive ? "default" : "secondary"}>
                          {group.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Select value={selectedDomainGroup} onValueChange={setSelectedDomainGroup}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Filter by domain group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Domain Groups</SelectItem>
                      {data.domainGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                      <DialogDescription>Create a new category under a domain group.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="cat-name">Category Name *</Label>
                        <Input 
                          id="cat-name"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          placeholder="e.g., Payment Processing"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cat-domain-group">Domain Group *</Label>
                        <Select 
                          value={newCategory.domainGroupId} 
                          onValueChange={(value) => setNewCategory({...newCategory, domainGroupId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a domain group" />
                          </SelectTrigger>
                          <SelectContent>
                            {data.domainGroups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cat-desc">Description</Label>
                        <Input 
                          id="cat-desc"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                          placeholder="Brief description"
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

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Domain Group</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredCategories().map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{getDomainGroupName(category.domainGroupId)}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-[300px] truncate">
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
            </TabsContent>

            {/* Sub Categories Tab */}
            <TabsContent value="sub-categories" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {data.categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                      <DialogDescription>Create a new sub category under a category.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="subcat-name">Sub Category Name *</Label>
                        <Input 
                          id="subcat-name"
                          value={newSubCategory.name}
                          onChange={(e) => setNewSubCategory({...newSubCategory, name: e.target.value})}
                          placeholder="e.g., Credit Card Processing"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subcat-category">Category *</Label>
                        <Select 
                          value={newSubCategory.categoryId} 
                          onValueChange={(value) => setNewSubCategory({...newSubCategory, categoryId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {data.categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subcat-desc">Description</Label>
                        <Input 
                          id="subcat-desc"
                          value={newSubCategory.description}
                          onChange={(e) => setNewSubCategory({...newSubCategory, description: e.target.value})}
                          placeholder="Brief description"
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

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub Category</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredSubCategories().map((subCategory) => (
                    <TableRow key={subCategory.id}>
                      <TableCell className="font-medium">{subCategory.name}</TableCell>
                      <TableCell>{getCategoryName(subCategory.categoryId)}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-[300px] truncate">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupsConfig;
