
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Save, X, Database } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface DomainItem {
  id: string;
  name: string;
}

interface IndustrySegmentData {
  groups: DomainItem[];
  categories: { [groupId: string]: DomainItem[] };
  subCategories: { [categoryId: string]: DomainItem[] };
}

const MasterDataStructureConfig = () => {
  const { toast } = useToast();
  
  // Industry segments from master data
  const industrySegments = [
    'Banking, Financial Services & Insurance (BFSI)',
    'Retail & E-Commerce',
    'Healthcare & Life Sciences',
    'Information Technology & Software Services',
    'Telecommunications',
    'Education & EdTech',
    'Manufacturing (Smart / Discrete / Process)',
    'Logistics & Supply Chain',
    'Media, Entertainment & OTT',
    'Energy & Utilities (Power, Oil & Gas, Renewables)',
    'Automotive & Mobility',
    'Real Estate & Smart Infrastructure',
    'Travel, Tourism & Hospitality',
    'Agriculture & AgriTech',
    'Public Sector & e-Governance'
  ];

  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState<string>('');
  
  // Data structure per industry segment
  const [industryData, setIndustryData] = useState<{ [industrySegment: string]: IndustrySegmentData }>({});
  
  // Current editing states
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Initialize default data for all industry segments
  useEffect(() => {
    const defaultData: IndustrySegmentData = {
      groups: [
        { id: '1', name: 'Technology' },
        { id: '2', name: 'Business Process' },
        { id: '3', name: 'Finance & Accounting' },
        { id: '4', name: 'Marketing & Sales' },
        { id: '5', name: 'Operations' }
      ],
      categories: {
        '1': [
          { id: '1-1', name: 'Software Development' },
          { id: '1-2', name: 'Data Analytics' },
          { id: '1-3', name: 'Cybersecurity' },
          { id: '1-4', name: 'Cloud Computing' },
          { id: '1-5', name: 'AI/ML' }
        ],
        '2': [
          { id: '2-1', name: 'Process Optimization' },
          { id: '2-2', name: 'Quality Management' },
          { id: '2-3', name: 'Compliance' }
        ],
        '3': [
          { id: '3-1', name: 'Financial Planning' },
          { id: '3-2', name: 'Risk Management' },
          { id: '3-3', name: 'Audit & Compliance' }
        ]
      },
      subCategories: {
        '1-1': [
          { id: '1-1-1', name: 'Web Development' },
          { id: '1-1-2', name: 'Mobile Development' },
          { id: '1-1-3', name: 'Backend Development' }
        ],
        '1-2': [
          { id: '1-2-1', name: 'Business Intelligence' },
          { id: '1-2-2', name: 'Data Visualization' },
          { id: '1-2-3', name: 'Predictive Analytics' }
        ]
      }
    };

    const initialData: { [key: string]: IndustrySegmentData } = {};
    industrySegments.forEach(segment => {
      initialData[segment] = JSON.parse(JSON.stringify(defaultData));
    });
    
    setIndustryData(initialData);
    setSelectedIndustrySegment(industrySegments[0]);
  }, []);

  const getCurrentData = (): IndustrySegmentData => {
    return industryData[selectedIndustrySegment] || { groups: [], categories: {}, subCategories: {} };
  };

  const updateIndustryData = (updatedData: IndustrySegmentData) => {
    setIndustryData(prev => ({
      ...prev,
      [selectedIndustrySegment]: updatedData
    }));
  };

  // Group operations
  const addGroup = () => {
    if (!newItemName.trim()) return;
    
    const currentData = getCurrentData();
    const newGroup: DomainItem = {
      id: Date.now().toString(),
      name: newItemName.trim()
    };
    
    const updatedData = {
      ...currentData,
      groups: [...currentData.groups, newGroup]
    };
    
    updateIndustryData(updatedData);
    setNewItemName('');
    
    toast({
      title: "Success",
      description: "Domain group added successfully",
    });
  };

  const editGroup = (groupId: string) => {
    const currentData = getCurrentData();
    const group = currentData.groups.find(g => g.id === groupId);
    if (group) {
      setEditingGroup(groupId);
      setEditingValue(group.name);
    }
  };

  const saveGroupEdit = () => {
    if (!editingValue.trim() || !editingGroup) return;
    
    const currentData = getCurrentData();
    const updatedData = {
      ...currentData,
      groups: currentData.groups.map(group =>
        group.id === editingGroup
          ? { ...group, name: editingValue.trim() }
          : group
      )
    };
    
    updateIndustryData(updatedData);
    setEditingGroup(null);
    setEditingValue('');
    
    toast({
      title: "Success",
      description: "Domain group updated successfully",
    });
  };

  const deleteGroup = (groupId: string) => {
    const currentData = getCurrentData();
    const updatedData = {
      ...currentData,
      groups: currentData.groups.filter(group => group.id !== groupId),
      categories: Object.fromEntries(
        Object.entries(currentData.categories).filter(([key]) => key !== groupId)
      )
    };
    
    updateIndustryData(updatedData);
    
    toast({
      title: "Success",
      description: "Domain group deleted successfully",
    });
  };

  // Category operations
  const addCategory = () => {
    if (!newItemName.trim() || !selectedGroup) return;
    
    const currentData = getCurrentData();
    const newCategory: DomainItem = {
      id: `${selectedGroup}-${Date.now()}`,
      name: newItemName.trim()
    };
    
    const updatedData = {
      ...currentData,
      categories: {
        ...currentData.categories,
        [selectedGroup]: [...(currentData.categories[selectedGroup] || []), newCategory]
      }
    };
    
    updateIndustryData(updatedData);
    setNewItemName('');
    
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  // Sub-category operations
  const addSubCategory = () => {
    if (!newItemName.trim() || !selectedCategory) return;
    
    const currentData = getCurrentData();
    const newSubCategory: DomainItem = {
      id: `${selectedCategory}-${Date.now()}`,
      name: newItemName.trim()
    };
    
    const updatedData = {
      ...currentData,
      subCategories: {
        ...currentData.subCategories,
        [selectedCategory]: [...(currentData.subCategories[selectedCategory] || []), newSubCategory]
      }
    };
    
    updateIndustryData(updatedData);
    setNewItemName('');
    
    toast({
      title: "Success",
      description: "Sub-category added successfully",
    });
  };

  const handleSaveAll = () => {
    toast({
      title: "Success",
      description: "Domain groups configuration saved successfully",
    });
  };

  const currentData = getCurrentData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Domain Groups Configuration
        </CardTitle>
        <CardDescription>
          Configure domain groups, categories, and sub-categories for challenge and solution management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Industry Segment Selection */}
        <div className="space-y-2">
          <Label htmlFor="industry-segment">Industry Segment *</Label>
          <Select value={selectedIndustrySegment} onValueChange={setSelectedIndustrySegment}>
            <SelectTrigger>
              <SelectValue placeholder="Select Industry Segment" />
            </SelectTrigger>
            <SelectContent>
              {industrySegments.map((segment) => (
                <SelectItem key={segment} value={segment}>
                  {segment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Configure domain structure for: <strong>{selectedIndustrySegment}</strong>
          </p>
        </div>

        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="groups">Domain Groups</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="subcategories">Sub-Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new domain group name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addGroup} disabled={!newItemName.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Group
                </Button>
              </div>

              <div className="space-y-2">
                {currentData.groups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                    {editingGroup === group.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={saveGroupEdit} size="sm">
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button onClick={() => setEditingGroup(null)} variant="outline" size="sm">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{group.name}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {(currentData.categories[group.id] || []).length} categories
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => editGroup(group.id)} variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button onClick={() => deleteGroup(group.id)} variant="destructive" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Domain Group</Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a domain group" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentData.groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedGroup && (
                <>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter new category name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addCategory} disabled={!newItemName.trim()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(currentData.categories[selectedGroup] || []).map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{category.name}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {(currentData.subCategories[category.id] || []).length} sub-categories
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="subcategories">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedGroup && (currentData.categories[selectedGroup] || []).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && (
                <>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter new sub-category name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addSubCategory} disabled={!newItemName.trim()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Sub-Category
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(currentData.subCategories[selectedCategory] || []).map((subCategory) => (
                      <div key={subCategory.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <Badge variant="outline">{subCategory.name}</Badge>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSaveAll}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MasterDataStructureConfig;
