
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Edit, Trash2, Save, X, Database, ChevronDown, ChevronRight } from 'lucide-react';
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

  // Expand/collapse states
  const [expandedGroups, setExpandedGroups] = useState<{ [groupId: string]: boolean }>({});
  const [expandedCategories, setExpandedCategories] = useState<{ [categoryId: string]: boolean }>({});

  // Initialize default data for all industry segments with the domain structure
  useEffect(() => {
    const defaultData: IndustrySegmentData = {
      groups: [
        { id: '1', name: 'Strategy, Innovation & Growth' },
        { id: '2', name: 'Operations, Delivery, Risk & Sustainability' },
        { id: '3', name: 'People, Culture & Change' },
        { id: '4', name: 'Technology & Digital Transformation' }
      ],
      categories: {
        '1': [
          { id: '1-1', name: 'Strategic Vision & Business Planning' },
          { id: '1-2', name: 'Business Model & Value Proposition Design' },
          { id: '1-3', name: 'Outcome Measurement & Business Value Realization' }
        ],
        '2': [
          { id: '2-1', name: 'Product & Systems Development Excellence' },
          { id: '2-2', name: 'Service Design & Customer Experience' },
          { id: '2-3', name: 'Process Excellence & Core Functions' },
          { id: '2-4', name: 'Compliance, Risk & Regulatory Governance' },
          { id: '2-5', name: 'ESG & Sustainability Strategy' },
          { id: '2-6', name: 'Global / Regional Delivery Capability' }
        ],
        '3': [
          { id: '3-1', name: 'Talent Management & Organizational Culture' },
          { id: '3-2', name: 'Operating Model & Organizational Structure' },
          { id: '3-3', name: 'Digital Workplace & Workforce Enablement' }
        ],
        '4': [
          { id: '4-1', name: 'Technology & Digital Transformation' },
          { id: '4-2', name: 'Data Strategy & Decision Intelligence' }
        ]
      },
      subCategories: {
        '1-1': [
          { id: '1-1-1', name: 'Vision, Mission, and Goals Alignment' },
          { id: '1-1-2', name: 'Strategic Planning Frameworks' },
          { id: '1-1-3', name: 'Competitive Positioning' },
          { id: '1-1-4', name: 'Long-Term Scenario Thinking' }
        ],
        '1-2': [
          { id: '1-2-1', name: 'Revenue Models & Monetization' },
          { id: '1-2-2', name: 'Customer Segments & Value Mapping' },
          { id: '1-2-3', name: 'Partner Ecosystem Design' },
          { id: '1-2-4', name: 'Business Sustainability Models' }
        ],
        '1-3': [
          { id: '1-3-1', name: 'ROI Analysis & Impact Metrics' },
          { id: '1-3-2', name: 'Benefits Realization Management' },
          { id: '1-3-3', name: 'Outcome-based Contracting' },
          { id: '1-3-4', name: 'Value Assurance Reviews' }
        ],
        '2-1': [
          { id: '2-1-1', name: 'Requirement Analysis & Specification' },
          { id: '2-1-2', name: 'System Design Architecture' },
          { id: '2-1-3', name: 'Prototyping & Iterative Development' },
          { id: '2-1-4', name: 'Quality & Reliability Engineering' }
        ],
        '2-2': [
          { id: '2-2-1', name: 'Journey Mapping & Service Blueprinting' },
          { id: '2-2-2', name: 'Omnichannel Experience Strategy' },
          { id: '2-2-3', name: 'Customer Feedback Integration' },
          { id: '2-2-4', name: 'Personalization & Accessibility' }
        ],
        '2-3': [
          { id: '2-3-1', name: 'Sales, Marketing, Finance, HR, Ops, SCM' },
          { id: '2-3-2', name: 'SOP Development' },
          { id: '2-3-3', name: 'KPI/OKR Definition' },
          { id: '2-3-4', name: 'Continuous Improvement (Lean, Six Sigma)' }
        ],
        '2-4': [
          { id: '2-4-1', name: 'Stakeholder Engagement' }
        ],
        '2-5': [
          { id: '2-5-1', name: 'Carbon Footprint & Green IT' },
          { id: '2-5-2', name: 'Circular Economy Practices' },
          { id: '2-5-3', name: 'Ethical Governance Frameworks' },
          { id: '2-5-4', name: 'Social Responsibility Programs' }
        ],
        '2-6': [
          { id: '2-6-1', name: 'Multi-Region Operations' },
          { id: '2-6-2', name: 'Countries Worked' },
          { id: '2-6-3', name: 'Regulatory & Localization Readiness' },
          { id: '2-6-4', name: 'Delivery Center Strategy' },
          { id: '2-6-5', name: 'Time Zone & Language Support' }
        ],
        '3-1': [
          { id: '3-1-1', name: 'Stakeholder Engagement' },
          { id: '3-1-2', name: 'Communication Planning' },
          { id: '3-1-3', name: 'Cultural Assessment & Transformation' },
          { id: '3-1-4', name: 'Adoption & Training Programs' }
        ],
        '3-2': [
          { id: '3-2-1', name: 'Role Clarity & Governance Structure' },
          { id: '3-2-2', name: 'Decision Rights Allocation' },
          { id: '3-2-3', name: 'Centralization vs. Decentralization' },
          { id: '3-2-4', name: 'Shared Services Design' }
        ],
        '3-3': [
          { id: '3-3-1', name: 'Collaboration Tools & Digital Adoption' },
          { id: '3-3-2', name: 'Hybrid/Remote Work Enablement' },
          { id: '3-3-3', name: 'Workforce Productivity Solutions' },
          { id: '3-3-4', name: 'Employee Experience Platforms' }
        ],
        '4-1': [
          { id: '4-1-1', name: 'Enterprise Architecture' },
          { id: '4-1-2', name: 'Cloud & Edge Infrastructure' },
          { id: '4-1-3', name: 'API & Integration Frameworks' },
          { id: '4-1-4', name: 'DevSecOps & Cybersecurity' }
        ],
        '4-2': [
          { id: '4-2-1', name: 'KPI/OKR Definition' }
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

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // CRUD operations for groups
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

  // CRUD operations for categories
  const addCategory = (groupId: string) => {
    if (!newItemName.trim()) return;
    
    const currentData = getCurrentData();
    const newCategory: DomainItem = {
      id: `${groupId}-${Date.now()}`,
      name: newItemName.trim()
    };
    
    const updatedData = {
      ...currentData,
      categories: {
        ...currentData.categories,
        [groupId]: [...(currentData.categories[groupId] || []), newCategory]
      }
    };
    
    updateIndustryData(updatedData);
    setNewItemName('');
    
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const editCategory = (categoryId: string) => {
    const currentData = getCurrentData();
    let categoryToEdit = null;
    
    for (const groupId in currentData.categories) {
      const category = currentData.categories[groupId].find(c => c.id === categoryId);
      if (category) {
        categoryToEdit = category;
        break;
      }
    }
    
    if (categoryToEdit) {
      setEditingCategory(categoryId);
      setEditingValue(categoryToEdit.name);
    }
  };

  const saveCategoryEdit = () => {
    if (!editingValue.trim() || !editingCategory) return;
    
    const currentData = getCurrentData();
    const updatedCategories = { ...currentData.categories };
    
    for (const groupId in updatedCategories) {
      updatedCategories[groupId] = updatedCategories[groupId].map(category =>
        category.id === editingCategory
          ? { ...category, name: editingValue.trim() }
          : category
      );
    }
    
    const updatedData = {
      ...currentData,
      categories: updatedCategories
    };
    
    updateIndustryData(updatedData);
    setEditingCategory(null);
    setEditingValue('');
    
    toast({
      title: "Success",
      description: "Category updated successfully",
    });
  };

  const deleteCategory = (categoryId: string) => {
    const currentData = getCurrentData();
    const updatedCategories = { ...currentData.categories };
    
    for (const groupId in updatedCategories) {
      updatedCategories[groupId] = updatedCategories[groupId].filter(category => category.id !== categoryId);
    }
    
    const updatedData = {
      ...currentData,
      categories: updatedCategories,
      subCategories: Object.fromEntries(
        Object.entries(currentData.subCategories).filter(([key]) => key !== categoryId)
      )
    };
    
    updateIndustryData(updatedData);
    
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  // CRUD operations for sub-categories
  const addSubCategory = (categoryId: string) => {
    if (!newItemName.trim()) return;
    
    const currentData = getCurrentData();
    const newSubCategory: DomainItem = {
      id: `${categoryId}-${Date.now()}`,
      name: newItemName.trim()
    };
    
    const updatedData = {
      ...currentData,
      subCategories: {
        ...currentData.subCategories,
        [categoryId]: [...(currentData.subCategories[categoryId] || []), newSubCategory]
      }
    };
    
    updateIndustryData(updatedData);
    setNewItemName('');
    
    toast({
      title: "Success",
      description: "Sub-category added successfully",
    });
  };

  const editSubCategory = (subCategoryId: string) => {
    const currentData = getCurrentData();
    let subCategoryToEdit = null;
    
    for (const categoryId in currentData.subCategories) {
      const subCategory = currentData.subCategories[categoryId].find(sc => sc.id === subCategoryId);
      if (subCategory) {
        subCategoryToEdit = subCategory;
        break;
      }
    }
    
    if (subCategoryToEdit) {
      setEditingSubCategory(subCategoryId);
      setEditingValue(subCategoryToEdit.name);
    }
  };

  const saveSubCategoryEdit = () => {
    if (!editingValue.trim() || !editingSubCategory) return;
    
    const currentData = getCurrentData();
    const updatedSubCategories = { ...currentData.subCategories };
    
    for (const categoryId in updatedSubCategories) {
      updatedSubCategories[categoryId] = updatedSubCategories[categoryId].map(subCategory =>
        subCategory.id === editingSubCategory
          ? { ...subCategory, name: editingValue.trim() }
          : subCategory
      );
    }
    
    const updatedData = {
      ...currentData,
      subCategories: updatedSubCategories
    };
    
    updateIndustryData(updatedData);
    setEditingSubCategory(null);
    setEditingValue('');
    
    toast({
      title: "Success",
      description: "Sub-category updated successfully",
    });
  };

  const deleteSubCategory = (subCategoryId: string) => {
    const currentData = getCurrentData();
    const updatedSubCategories = { ...currentData.subCategories };
    
    for (const categoryId in updatedSubCategories) {
      updatedSubCategories[categoryId] = updatedSubCategories[categoryId].filter(subCategory => subCategory.id !== subCategoryId);
    }
    
    const updatedData = {
      ...currentData,
      subCategories: updatedSubCategories
    };
    
    updateIndustryData(updatedData);
    
    toast({
      title: "Success",
      description: "Sub-category deleted successfully",
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

        {/* Add New Group */}
        <div className="border rounded-lg p-4 bg-muted/50">
          <h3 className="font-medium mb-3">Add New Domain Group</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter domain group name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addGroup} disabled={!newItemName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </Button>
          </div>
        </div>

        {/* Tree Structure */}
        <div className="space-y-2">
          {currentData.groups.map((group) => (
            <div key={group.id} className="border rounded-lg overflow-hidden">
              <Collapsible 
                open={expandedGroups[group.id]} 
                onOpenChange={() => toggleGroupExpansion(group.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    {editingGroup === group.id ? (
                      <div className="flex gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
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
                          <div className="flex items-center gap-2">
                            {expandedGroups[group.id] ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                          <Badge variant="default" className="font-medium">
                            GROUP: {group.name}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {(currentData.categories[group.id] || []).length} categories
                          </span>
                        </div>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="border-t bg-muted/20 p-4 space-y-4">
                    {/* Add Category */}
                    <div className="flex gap-2">
                      <Input
                        placeholder={`Add category to ${group.name}`}
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => addCategory(group.id)} 
                        disabled={!newItemName.trim()}
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                      </Button>
                    </div>

                    {/* Categories */}
                    <div className="space-y-2 ml-6">
                      {(currentData.categories[group.id] || []).map((category) => (
                        <div key={category.id} className="border rounded-lg overflow-hidden bg-background">
                          <Collapsible 
                            open={expandedCategories[category.id]} 
                            onOpenChange={() => toggleCategoryExpansion(category.id)}
                          >
                            <CollapsibleTrigger className="w-full">
                              <div className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                                {editingCategory === category.id ? (
                                  <div className="flex gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                                    <Input
                                      value={editingValue}
                                      onChange={(e) => setEditingValue(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button onClick={saveCategoryEdit} size="sm">
                                      <Save className="w-3 h-3" />
                                    </Button>
                                    <Button onClick={() => setEditingCategory(null)} variant="outline" size="sm">
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        {expandedCategories[category.id] ? (
                                          <ChevronDown className="w-4 h-4" />
                                        ) : (
                                          <ChevronRight className="w-4 h-4" />
                                        )}
                                      </div>
                                      <div className="flex flex-col items-start">
                                        <Badge variant="secondary" className="font-medium mb-1">
                                          CATEGORY: {category.name}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          Group: {group.name}
                                        </span>
                                      </div>
                                      <span className="text-sm text-muted-foreground ml-2">
                                        {(currentData.subCategories[category.id] || []).length} sub-categories
                                      </span>
                                    </div>
                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                      <Button onClick={() => editCategory(category.id)} variant="outline" size="sm">
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button onClick={() => deleteCategory(category.id)} variant="destructive" size="sm">
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                              <div className="border-t bg-muted/20 p-3 space-y-3">
                                {/* Add Sub-Category */}
                                <div className="flex gap-2">
                                  <Input
                                    placeholder={`Add sub-category to ${category.name}`}
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button 
                                    onClick={() => addSubCategory(category.id)} 
                                    disabled={!newItemName.trim()}
                                    size="sm"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Sub-Category
                                  </Button>
                                </div>

                                {/* Sub-Categories */}
                                <div className="space-y-2 ml-6">
                                  {(currentData.subCategories[category.id] || []).map((subCategory) => (
                                    <div key={subCategory.id} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                                      {editingSubCategory === subCategory.id ? (
                                        <div className="flex gap-2 flex-1">
                                          <Input
                                            value={editingValue}
                                            onChange={(e) => setEditingValue(e.target.value)}
                                            className="flex-1"
                                          />
                                          <Button onClick={saveSubCategoryEdit} size="sm">
                                            <Save className="w-3 h-3" />
                                          </Button>
                                          <Button onClick={() => setEditingSubCategory(null)} variant="outline" size="sm">
                                            <X className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="flex flex-col items-start">
                                            <Badge variant="outline" className="font-medium mb-1">
                                              SUB-CATEGORY: {subCategory.name}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                              Category: {category.name}
                                            </span>
                                          </div>
                                          <div className="flex gap-2">
                                            <Button onClick={() => editSubCategory(subCategory.id)} variant="outline" size="sm">
                                              <Edit className="w-3 h-3" />
                                            </Button>
                                            <Button onClick={() => deleteSubCategory(subCategory.id)} variant="destructive" size="sm">
                                              <Trash2 className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>

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
