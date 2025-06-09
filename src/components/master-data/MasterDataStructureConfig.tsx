import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Save, X, ChevronRight, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface SubCategory {
  id: string;
  name: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
}

interface Group {
  id: string;
  name: string;
  description: string;
  categories: Category[];
}

interface MasterDataStructure {
  groups: Group[];
}

const MasterDataStructureConfig = () => {
  const { toast } = useToast();
  const [masterData, setMasterData] = useState<MasterDataStructure>({
    groups: [
      {
        id: 'group-1',
        name: 'Strategy, Innovation & Growth',
        description: 'Strategic planning and growth initiatives',
        categories: [
          {
            id: 'cat-1-1',
            name: 'Strategic Vision & Business Planning',
            description: 'Vision, mission and strategic planning frameworks',
            subCategories: [
              {
                id: 'sub-1-1-1',
                name: 'Vision, Mission, and Goals Alignment',
                description: 'Ensuring organizational vision, mission, and strategic goals are aligned and clearly communicated.'
              },
              {
                id: 'sub-1-1-2',
                name: 'Strategic Planning Frameworks',
                description: 'Using structured tools like SWOT, PESTLE, or Balanced Scorecards for strategic planning.'
              },
              {
                id: 'sub-1-1-3',
                name: 'Competitive Positioning',
                description: 'Identifying and strengthening the organization\'s differentiation in the marketplace.'
              },
              {
                id: 'sub-1-1-4',
                name: 'Long-Term Scenario Thinking',
                description: 'Planning for various future scenarios to remain resilient and adaptive.'
              }
            ]
          },
          {
            id: 'cat-1-2',
            name: 'Business Model & Value Proposition Design',
            description: 'Revenue models and value proposition frameworks',
            subCategories: [
              {
                id: 'sub-1-2-1',
                name: 'Revenue Models & Monetization',
                description: 'Designing and optimizing revenue generation strategies.'
              },
              {
                id: 'sub-1-2-2',
                name: 'Customer Segments & Value Mapping',
                description: 'Identifying key customer groups and tailoring value propositions for each.'
              },
              {
                id: 'sub-1-2-3',
                name: 'Partner Ecosystem Design',
                description: 'Structuring collaborative networks with suppliers, partners, and platforms.'
              },
              {
                id: 'sub-1-2-4',
                name: 'Business Sustainability Models',
                description: 'Integrating sustainable practices into business models for long-term viability.'
              }
            ]
          }
        ]
      },
      {
        id: 'group-2',
        name: 'Operations, Delivery, Risk & Sustainability',
        description: 'Operational excellence and risk management',
        categories: [
          {
            id: 'cat-2-1',
            name: 'Product & Systems Development Excellence',
            description: 'Product development and system design capabilities',
            subCategories: [
              {
                id: 'sub-2-1-1',
                name: 'Requirement Analysis & Specification',
                description: 'Capturing and documenting functional and non-functional requirements.'
              },
              {
                id: 'sub-2-1-2',
                name: 'System Design Architecture',
                description: 'Designing scalable and robust systems architecture.'
              }
            ]
          }
        ]
      }
    ]
  });

  const [activeTab, setActiveTab] = useState('groups');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['group-1']);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cat-1-1']);
  
  // Form states
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '', groupId: '' });
  const [newSubCategory, setNewSubCategory] = useState({ name: '', description: '', categoryId: '' });
  
  // Edit states
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: '', description: '' });
  
  // Add states
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubCategory, setIsAddingSubCategory] = useState(false);

  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Group operations
  const handleAddGroup = () => {
    if (newGroup.name.trim()) {
      const group: Group = {
        id: generateId('group'),
        name: newGroup.name.trim(),
        description: newGroup.description.trim(),
        categories: []
      };
      
      setMasterData(prev => ({
        ...prev,
        groups: [...prev.groups, group]
      }));
      
      setNewGroup({ name: '', description: '' });
      setIsAddingGroup(false);
      
      toast({
        title: "Success",
        description: "Domain Group added successfully",
      });
    }
  };

  const handleEditGroup = (groupId: string) => {
    const group = masterData.groups.find(g => g.id === groupId);
    if (group) {
      setEditingGroup(groupId);
      setEditValues({ name: group.name, description: group.description });
    }
  };

  const handleSaveGroupEdit = () => {
    if (editingGroup && editValues.name.trim()) {
      setMasterData(prev => ({
        ...prev,
        groups: prev.groups.map(group => 
          group.id === editingGroup 
            ? { ...group, name: editValues.name.trim(), description: editValues.description.trim() }
            : group
        )
      }));
      
      setEditingGroup(null);
      setEditValues({ name: '', description: '' });
      
      toast({
        title: "Success",
        description: "Domain Group updated successfully",
      });
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    setMasterData(prev => ({
      ...prev,
      groups: prev.groups.filter(group => group.id !== groupId)
    }));
    
    toast({
      title: "Success",
      description: "Domain Group deleted successfully",
    });
  };

  // Category operations
  const handleAddCategory = () => {
    if (newCategory.name.trim() && newCategory.groupId) {
      const category: Category = {
        id: generateId('cat'),
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        subCategories: []
      };
      
      setMasterData(prev => ({
        ...prev,
        groups: prev.groups.map(group => 
          group.id === newCategory.groupId 
            ? { ...group, categories: [...group.categories, category] }
            : group
        )
      }));
      
      setNewCategory({ name: '', description: '', groupId: '' });
      setIsAddingCategory(false);
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    }
  };

  const handleEditCategory = (categoryId: string) => {
    const category = masterData.groups
      .flatMap(g => g.categories)
      .find(c => c.id === categoryId);
    
    if (category) {
      setEditingCategory(categoryId);
      setEditValues({ name: category.name, description: category.description });
    }
  };

  const handleSaveCategoryEdit = () => {
    if (editingCategory && editValues.name.trim()) {
      setMasterData(prev => ({
        ...prev,
        groups: prev.groups.map(group => ({
          ...group,
          categories: group.categories.map(category => 
            category.id === editingCategory 
              ? { ...category, name: editValues.name.trim(), description: editValues.description.trim() }
              : category
          )
        }))
      }));
      
      setEditingCategory(null);
      setEditValues({ name: '', description: '' });
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setMasterData(prev => ({
      ...prev,
      groups: prev.groups.map(group => ({
        ...group,
        categories: group.categories.filter(category => category.id !== categoryId)
      }))
    }));
    
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  // SubCategory operations
  const handleAddSubCategory = () => {
    if (newSubCategory.name.trim() && newSubCategory.categoryId) {
      const subCategory: SubCategory = {
        id: generateId('sub'),
        name: newSubCategory.name.trim(),
        description: newSubCategory.description.trim()
      };
      
      setMasterData(prev => ({
        ...prev,
        groups: prev.groups.map(group => ({
          ...group,
          categories: group.categories.map(category => 
            category.id === newSubCategory.categoryId 
              ? { ...category, subCategories: [...category.subCategories, subCategory] }
              : category
          )
        }))
      }));
      
      setNewSubCategory({ name: '', description: '', categoryId: '' });
      setIsAddingSubCategory(false);
      
      toast({
        title: "Success",
        description: "Sub-category added successfully",
      });
    }
  };

  const handleEditSubCategory = (subCategoryId: string) => {
    const subCategory = masterData.groups
      .flatMap(g => g.categories)
      .flatMap(c => c.subCategories)
      .find(sc => sc.id === subCategoryId);
    
    if (subCategory) {
      setEditingSubCategory(subCategoryId);
      setEditValues({ name: subCategory.name, description: subCategory.description });
    }
  };

  const handleSaveSubCategoryEdit = () => {
    if (editingSubCategory && editValues.name.trim()) {
      setMasterData(prev => ({
        ...prev,
        groups: prev.groups.map(group => ({
          ...group,
          categories: group.categories.map(category => ({
            ...category,
            subCategories: category.subCategories.map(subCategory => 
              subCategory.id === editingSubCategory 
                ? { ...subCategory, name: editValues.name.trim(), description: editValues.description.trim() }
                : subCategory
            )
          }))
        }))
      }));
      
      setEditingSubCategory(null);
      setEditValues({ name: '', description: '' });
      
      toast({
        title: "Success",
        description: "Sub-category updated successfully",
      });
    }
  };

  const handleDeleteSubCategory = (subCategoryId: string) => {
    setMasterData(prev => ({
      ...prev,
      groups: prev.groups.map(group => ({
        ...group,
        categories: group.categories.map(category => ({
          ...category,
          subCategories: category.subCategories.filter(subCategory => subCategory.id !== subCategoryId)
        }))
      }))
    }));
    
    toast({
      title: "Success",
      description: "Sub-category deleted successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain Groups Configuration</CardTitle>
        <CardDescription>
          Configure domain groups, categories, and sub-categories for the assessment framework
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="groups">Domain Groups</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="subcategories">Sub-Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Assessment Domain Groups</h3>
                <Button 
                  onClick={() => setIsAddingGroup(true)} 
                  disabled={isAddingGroup}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Domain Group
                </Button>
              </div>

              {isAddingGroup && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <div>
                    <Label htmlFor="new-group-name">Domain Group Name</Label>
                    <Input
                      id="new-group-name"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter domain group name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-group-description">Description</Label>
                    <Textarea
                      id="new-group-description"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter domain group description"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddGroup} size="sm" className="flex items-center gap-1">
                      <Save className="w-3 h-3" />
                      Save
                    </Button>
                    <Button onClick={() => setIsAddingGroup(false)} variant="outline" size="sm" className="flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {masterData.groups.map((group) => (
                  <Card key={group.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      {editingGroup === group.id ? (
                        <div className="space-y-3">
                          <div>
                            <Label>Domain Group Name</Label>
                            <Input
                              value={editValues.name}
                              onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={editValues.description}
                              onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveGroupEdit} size="sm">
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button onClick={() => setEditingGroup(null)} variant="outline" size="sm">
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">DOMAIN GROUP {masterData.groups.indexOf(group) + 1}</Badge>
                              <h4 className="font-semibold text-lg">{group.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {group.categories.length} categories
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditGroup(group.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteGroup(group.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Categories by Domain Group</h3>
                <Button 
                  onClick={() => setIsAddingCategory(true)} 
                  disabled={isAddingCategory}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </Button>
              </div>

              {isAddingCategory && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <div>
                    <Label htmlFor="category-group">Select Group</Label>
                    <select
                      id="category-group"
                      value={newCategory.groupId}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, groupId: e.target.value }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="">Select a group</option>
                      {masterData.groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="new-category-name">Category Name</Label>
                    <Input
                      id="new-category-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter category name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-category-description">Description</Label>
                    <Textarea
                      id="new-category-description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter category description"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddCategory} size="sm">
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button onClick={() => setIsAddingCategory(false)} variant="outline" size="sm">
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {masterData.groups.map((group) => (
                  <Card key={group.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleGroupExpansion(group.id)}>
                        {expandedGroups.includes(group.id) ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {group.categories.length} categories
                        </Badge>
                      </div>
                    </CardHeader>
                    {expandedGroups.includes(group.id) && (
                      <CardContent className="space-y-2">
                        {group.categories.map((category) => (
                          <div key={category.id} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                            {editingCategory === category.id ? (
                              <div className="space-y-3">
                                <div>
                                  <Label>Category Name</Label>
                                  <Input
                                    value={editValues.name}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <Textarea
                                    value={editValues.description}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={handleSaveCategoryEdit} size="sm">
                                    <Save className="w-3 h-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button onClick={() => setEditingCategory(null)} variant="outline" size="sm">
                                    <X className="w-3 h-3 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {group.categories.indexOf(category) + 1}
                                    </Badge>
                                    <h5 className="font-medium">{category.name}</h5>
                                    <Badge variant="outline" className="text-xs">
                                      {category.subCategories.length} sub-categories
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{category.description}</p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    onClick={() => handleEditCategory(category.id)}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    variant="destructive"
                                    size="sm"
                                    className="h-7 px-2"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {group.categories.length === 0 && (
                          <p className="text-sm text-muted-foreground italic">No categories defined for this group</p>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subcategories" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Sub-Categories by Category</h3>
                <Button 
                  onClick={() => setIsAddingSubCategory(true)} 
                  disabled={isAddingSubCategory}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Sub-Category
                </Button>
              </div>

              {isAddingSubCategory && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <div>
                    <Label htmlFor="subcategory-category">Select Category</Label>
                    <select
                      id="subcategory-category"
                      value={newSubCategory.categoryId}
                      onChange={(e) => setNewSubCategory(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="">Select a category</option>
                      {masterData.groups.flatMap(group => 
                        group.categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {group.name} → {category.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="new-subcategory-name">Sub-Category Name</Label>
                    <Input
                      id="new-subcategory-name"
                      value={newSubCategory.name}
                      onChange={(e) => setNewSubCategory(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter sub-category name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-subcategory-description">Description</Label>
                    <Textarea
                      id="new-subcategory-description"
                      value={newSubCategory.description}
                      onChange={(e) => setNewSubCategory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter sub-category description"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddSubCategory} size="sm">
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button onClick={() => setIsAddingSubCategory(false)} variant="outline" size="sm">
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {masterData.groups.map((group) => (
                  <Card key={group.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleGroupExpansion(group.id)}>
                        {expandedGroups.includes(group.id) ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                      </div>
                    </CardHeader>
                    {expandedGroups.includes(group.id) && (
                      <CardContent className="space-y-3">
                        {group.categories.map((category) => (
                          <Card key={category.id} className="border-l-2 border-l-blue-300">
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleCategoryExpansion(category.id)}>
                                {expandedCategories.includes(category.id) ? 
                                  <ChevronDown className="w-3 h-3" /> : 
                                  <ChevronRight className="w-3 h-3" />
                                }
                                <CardTitle className="text-base">{category.name}</CardTitle>
                                <Badge variant="outline" className="text-xs">
                                  {category.subCategories.length} sub-categories
                                </Badge>
                              </div>
                            </CardHeader>
                            {expandedCategories.includes(category.id) && (
                              <CardContent className="space-y-2">
                                {category.subCategories.map((subCategory) => (
                                  <div key={subCategory.id} className="p-2 border rounded hover:bg-muted/20 transition-colors">
                                    {editingSubCategory === subCategory.id ? (
                                      <div className="space-y-2">
                                        <div>
                                          <Label>Sub-Category Name</Label>
                                          <Input
                                            value={editValues.name}
                                            onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                                            className="mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label>Description</Label>
                                          <Textarea
                                            value={editValues.description}
                                            onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                                            className="mt-1"
                                          />
                                        </div>
                                        <div className="flex gap-2">
                                          <Button onClick={handleSaveSubCategoryEdit} size="sm">
                                            <Save className="w-3 h-3 mr-1" />
                                            Save
                                          </Button>
                                          <Button onClick={() => setEditingSubCategory(null)} variant="outline" size="sm">
                                            <X className="w-3 h-3 mr-1" />
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="secondary" className="text-xs">
                                              {category.subCategories.indexOf(subCategory) + 1}
                                            </Badge>
                                            <h6 className="font-medium text-sm">{subCategory.name}</h6>
                                          </div>
                                          <p className="text-xs text-muted-foreground">{subCategory.description}</p>
                                        </div>
                                        <div className="flex gap-1">
                                          <Button
                                            onClick={() => handleEditSubCategory(subCategory.id)}
                                            variant="outline"
                                            size="sm"
                                            className="h-6 px-2"
                                          >
                                            <Edit className="w-2 h-2" />
                                          </Button>
                                          <Button
                                            onClick={() => handleDeleteSubCategory(subCategory.id)}
                                            variant="destructive"
                                            size="sm"
                                            className="h-6 px-2"
                                          >
                                            <Trash2 className="w-2 h-2" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {category.subCategories.length === 0 && (
                                  <p className="text-xs text-muted-foreground italic">No sub-categories defined for this category</p>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        ))}
                        {group.categories.length === 0 && (
                          <p className="text-sm text-muted-foreground italic">No categories defined for this group</p>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MasterDataStructureConfig;
