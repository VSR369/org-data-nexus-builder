import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Plus, Edit2, Save, X, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface SubCategory {
  id: string;
  name: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

interface DomainGroup {
  id: string;
  name: string;
  industrySegment: string;
  categories: Category[];
}

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

const groupColors = [
  'bg-blue-50 border-blue-200',
  'bg-green-50 border-green-200',
  'bg-purple-50 border-purple-200',
  'bg-orange-50 border-orange-200',
  'bg-teal-50 border-teal-200',
  'bg-pink-50 border-pink-200'
];

const initialDomainGroups: DomainGroup[] = [
  {
    id: '1',
    name: 'Strategy, Innovation & Growth',
    industrySegment: 'Technology',
    categories: [
      {
        id: '101',
        name: 'Strategic Vision & Business Planning',
        subCategories: [
          { id: '101-1', name: 'Vision, Mission, and Goals Alignment', description: 'Ensuring organizational vision, mission, and strategic goals are aligned and clearly communicated.' },
          { id: '101-2', name: 'Strategic Planning Frameworks', description: 'Using structured tools like SWOT, PESTLE, or Balanced Scorecards for strategic planning.' },
          { id: '101-3', name: 'Competitive Positioning', description: 'Identifying and strengthening the organization\'s differentiation in the marketplace.' },
          { id: '101-4', name: 'Long-Term Scenario Thinking', description: 'Planning for various future scenarios to remain resilient and adaptive.' },
        ],
      },
      {
        id: '102',
        name: 'Business Model & Value Proposition Design',
        subCategories: [
          { id: '102-1', name: 'Revenue Models & Monetization', description: 'Designing and optimizing revenue generation strategies.' },
          { id: '102-2', name: 'Customer Segments & Value Mapping', description: 'Identifying key customer groups and tailoring value propositions for each.' },
          { id: '102-3', name: 'Partner Ecosystem Design', description: 'Structuring collaborative networks with suppliers, partners, and platforms.' },
          { id: '102-4', name: 'Business Sustainability Models', description: 'Integrating sustainable practices into business models for long-term viability.' },
        ],
      },
      {
        id: '103',
        name: 'Outcome Measurement & Business Value Realization',
        subCategories: [
          { id: '103-1', name: 'ROI Analysis & Impact Metrics', description: 'Measuring return on investments and defining key impact indicators.' },
          { id: '103-2', name: 'Benefits Realization Management', description: 'Ensuring projects deliver intended benefits aligned with strategic goals.' },
          { id: '103-3', name: 'Outcome-based Contracting', description: 'Structuring contracts based on outcome delivery rather than inputs or activities.' },
          { id: '103-4', name: 'Value Assurance Reviews', description: 'Periodic reviews to ensure value creation throughout project or initiative lifecycles.' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Operations, Delivery, Risk & Sustainability',
    industrySegment: 'Healthcare',
    categories: [
      {
        id: '201',
        name: 'Product & Systems Development Excellence',
        subCategories: [
          { id: '201-1', name: 'Requirement Analysis & Specification', description: 'Capturing and documenting functional and non-functional requirements.' },
          { id: '201-2', name: 'System Design Architecture', description: 'Designing scalable and robust systems architecture.' },
          { id: '201-3', name: 'Prototyping & Iterative Development', description: 'Rapid design-build-test cycles to evolve solutions.' },
          { id: '201-4', name: 'Quality & Reliability Engineering', description: 'Ensuring consistency, safety, and reliability of products/services.' },
        ],
      },
      {
        id: '202',
        name: 'Service Design & Customer Experience',
        subCategories: [
          { id: '202-1', name: 'Journey Mapping & Service Blueprinting', description: 'Visualizing customer interactions and backend systems to improve services.' },
          { id: '202-2', name: 'Omnichannel Experience Strategy', description: 'Designing seamless experiences across physical and digital channels.' },
          { id: '202-3', name: 'Customer Feedback Integration', description: 'Embedding user feedback loops into service refinement.' },
          { id: '202-4', name: 'Personalization & Accessibility', description: 'Customizing experiences and ensuring inclusivity.' },
        ],
      },
      {
        id: '203',
        name: 'Process Excellence & Core Functions',
        subCategories: [
          { id: '203-1', name: 'Sales, Marketing, Finance, HR, Ops, SCM', description: 'Functional performance across all core departments.' },
          { id: '203-2', name: 'SOP Development', description: 'Creating standard operating procedures to ensure consistency.' },
          { id: '203-3', name: 'KPI/OKR Definition', description: 'Setting Key Performance Indicators and Objectives & Key Results for teams.' },
          { id: '203-4', name: 'Continuous Improvement (Lean, Six Sigma)', description: 'Using proven methodologies for process and performance improvement.' },
        ],
      },
      {
        id: '204',
        name: 'Compliance, Risk & Regulatory Governance',
        subCategories: [
          { id: '204-1', name: 'Stakeholder Engagement', description: 'Involving and aligning internal and external stakeholders to mitigate risks.' },
        ],
      },
      {
        id: '205',
        name: 'ESG & Sustainability Strategy',
        subCategories: [
          { id: '205-1', name: 'Carbon Footprint & Green IT', description: 'Reducing environmental impact through sustainable IT and operations.' },
          { id: '205-2', name: 'Circular Economy Practices', description: 'Promoting reuse, recycling, and cradle-to-cradle design.' },
          { id: '205-3', name: 'Ethical Governance Frameworks', description: 'Establishing values-driven, transparent decision-making systems.' },
          { id: '205-4', name: 'Social Responsibility Programs', description: 'Designing and running initiatives for social impact.' },
        ],
      },
      {
        id: '206',
        name: 'Global / Regional Delivery Capability',
        subCategories: [
          { id: '206-1', name: 'Multi-Region Operations', description: 'Managing operations across geographies with consistency.' },
          { id: '206-2', name: 'Countries Worked', description: 'Select the applicable countries.' },
          { id: '206-3', name: 'Regulatory & Localization Readiness', description: 'Ensuring compliance with regional regulations and local needs.' },
          { id: '206-4', name: 'Delivery Center Strategy', description: 'Designing and operating efficient delivery hubs in different regions/countries.' },
          { id: '206-5', name: 'Time Zone & Language Support', description: 'Supporting global teams and customers across languages and time zones.' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'People, Culture & Change',
    industrySegment: 'Technology',
    categories: [
      {
        id: '301',
        name: 'Talent Management & Organizational Culture',
        subCategories: [
          { id: '301-1', name: 'Stakeholder Engagement', description: 'Engaging leadership, employees, and partners during change or growth.' },
          { id: '301-2', name: 'Communication Planning', description: 'Crafting effective internal and external communication strategies.' },
          { id: '301-3', name: 'Cultural Assessment & Transformation', description: 'Evaluating and evolving organizational values, beliefs, and behaviors.' },
          { id: '301-4', name: 'Adoption & Training Programs', description: 'Preparing people to embrace new processes, tools, and mindsets.' },
        ],
      },
      {
        id: '302',
        name: 'Operating Model & Organizational Structure',
        subCategories: [
          { id: '302-1', name: 'Role Clarity & Governance Structure', description: 'Defining responsibilities and decision-making structures.' },
          { id: '302-2', name: 'Decision Rights Allocation', description: 'Clarifying who decides what and at which level.' },
          { id: '302-3', name: 'Centralization vs. Decentralization', description: 'Structuring operations to balance autonomy and control.' },
          { id: '302-4', name: 'Shared Services Design', description: 'Creating internal service hubs for scale and efficiency.' },
        ],
      },
      {
        id: '303',
        name: 'Digital Workplace & Workforce Enablement',
        subCategories: [
          { id: '303-1', name: 'Collaboration Tools & Digital Adoption', description: 'Using tools like Slack, Teams, Notion to boost team collaboration.' },
          { id: '303-2', name: 'Hybrid/Remote Work Enablement', description: 'Supporting flexible work arrangements with appropriate systems.' },
          { id: '303-3', name: 'Workforce Productivity Solutions', description: 'Enhancing employee output using automation, apps, and analytics.' },
          { id: '303-4', name: 'Employee Experience Platforms', description: 'Tools and systems to improve engagement, well-being, and satisfaction.' },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Technology & Digital Transformation',
    industrySegment: 'Technology',
    categories: [
      {
        id: '401',
        name: 'Technology & Digital Transformation',
        subCategories: [
          { id: '401-1', name: 'Enterprise Architecture', description: 'Designing IT infrastructure and digital systems aligned to business goals.' },
          { id: '401-2', name: 'Cloud & Edge Infrastructure', description: 'Leveraging cloud and edge computing for scalability and efficiency.' },
          { id: '401-3', name: 'API & Integration Frameworks', description: 'Enabling interoperability across systems via robust APIs.' },
          { id: '401-4', name: 'DevSecOps & Cybersecurity', description: 'Embedding security into the software development lifecycle.' },
        ],
      },
      {
        id: '402',
        name: 'Data Strategy & Decision Intelligence',
        subCategories: [
          { id: '402-1', name: 'KPI/OKR Definition', description: 'Leveraging performance metrics for data-driven decision making.' },
        ],
      },
    ],
  },
];

const MasterDataStructureConfig = () => {
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>(initialDomainGroups);
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState(new Set<string>());
  const [expandedCategories, setExpandedCategories] = useState(new Set<string>());
  const [message, setMessage] = useState<string | null>(null);

  // Dialog states
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showAddSubCategoryDialog, setShowAddSubCategoryDialog] = useState(false);

  // Form states
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupIndustrySegment, setNewGroupIndustrySegment] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [newSubCategoryDescription, setNewSubCategoryDescription] = useState('');
  const [selectedGroupForCategory, setSelectedGroupForCategory] = useState<string>('');
  const [selectedGroupForSubCategory, setSelectedGroupForSubCategory] = useState<string>('');
  const [selectedCategoryForSubCategory, setSelectedCategoryForSubCategory] = useState<string>('');

  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingSubCategoryName, setEditingSubCategoryName] = useState('');

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredDomainGroups = selectedIndustrySegment === 'all' 
    ? domainGroups 
    : domainGroups.filter(group => group.industrySegment === selectedIndustrySegment);

  const handleAddGroup = () => {
    if (!newGroupName.trim() || !newGroupIndustrySegment) {
      showMessage('Please fill in all required fields.');
      return;
    }

    const newGroup: DomainGroup = {
      id: generateId(),
      name: newGroupName.trim(),
      industrySegment: newGroupIndustrySegment,
      categories: [],
    };

    setDomainGroups([...domainGroups, newGroup]);
    setShowAddGroupDialog(false);
    setNewGroupName('');
    setNewGroupIndustrySegment('');
    showMessage('Domain Group added successfully.');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim() || !selectedGroupForCategory) {
      showMessage('Please fill in all required fields.');
      return;
    }

    const newCategory: Category = {
      id: generateId(),
      name: newCategoryName.trim(),
      subCategories: [],
    };

    const updatedGroups = domainGroups.map((group) =>
      group.id === selectedGroupForCategory
        ? { ...group, categories: [...group.categories, newCategory] }
        : group
    );

    setDomainGroups(updatedGroups);
    setShowAddCategoryDialog(false);
    setNewCategoryName('');
    setSelectedGroupForCategory('');
    showMessage('Category added successfully.');
  };

  const handleAddSubCategory = () => {
    if (!newSubCategoryName.trim() || !selectedGroupForSubCategory || !selectedCategoryForSubCategory) {
      showMessage('Please fill in all required fields.');
      return;
    }

    const newSubCategory: SubCategory = {
      id: generateId(),
      name: newSubCategoryName.trim(),
      description: newSubCategoryDescription.trim() || undefined,
    };

    const updatedGroups = domainGroups.map((group) =>
      group.id === selectedGroupForSubCategory
        ? {
            ...group,
            categories: group.categories.map((category) =>
              category.id === selectedCategoryForSubCategory
                ? { ...category, subCategories: [...category.subCategories, newSubCategory] }
                : category
            ),
          }
        : group
    );

    setDomainGroups(updatedGroups);
    setShowAddSubCategoryDialog(false);
    setNewSubCategoryName('');
    setNewSubCategoryDescription('');
    setSelectedGroupForSubCategory('');
    setSelectedCategoryForSubCategory('');
    showMessage('Sub-Category added successfully.');
  };

  const handleEditGroup = (id: string, name: string) => {
    setEditingGroup(id);
    setEditingGroupName(name);
  };

  const handleSaveGroup = (id: string) => {
    const updatedGroups = domainGroups.map((group) =>
      group.id === id ? { ...group, name: editingGroupName } : group
    );
    setDomainGroups(updatedGroups);
    setEditingGroup(null);
    setMessage('Domain Group updated.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteGroup = (id: string) => {
    const updatedGroups = domainGroups.filter((group) => group.id !== id);
    setDomainGroups(updatedGroups);
    setMessage('Domain Group deleted.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditCategory = (id: string, name: string) => {
    setEditingCategory(id);
    setEditingCategoryName(name);
  };

  const handleSaveCategory = (groupId: string, categoryId: string) => {
    const updatedGroups = domainGroups.map((group) =>
      group.id === groupId
        ? {
          ...group,
          categories: group.categories.map((category) =>
            category.id === categoryId ? { ...category, name: editingCategoryName } : category
          ),
        }
        : group
    );
    setDomainGroups(updatedGroups);
    setEditingCategory(null);
    setMessage('Category updated.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteCategory = (groupId: string, categoryId: string) => {
    const updatedGroups = domainGroups.map((group) =>
      group.id === groupId
        ? {
          ...group,
          categories: group.categories.filter((category) => category.id !== categoryId),
        }
        : group
    );
    setDomainGroups(updatedGroups);
    setMessage('Category deleted.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditSubCategory = (id: string, name: string) => {
    setEditingSubCategory(id);
    setEditingSubCategoryName(name);
  };

  const handleSaveSubCategory = (groupId: string, categoryId: string, subCategoryId: string) => {
    const updatedGroups = domainGroups.map((group) =>
      group.id === groupId
        ? {
          ...group,
          categories: group.categories.map((category) =>
            category.id === categoryId
              ? {
                ...category,
                subCategories: category.subCategories.map((subCategory) =>
                  subCategory.id === subCategoryId ? { ...subCategory, name: editingSubCategoryName } : subCategory
                ),
              }
              : category
          ),
        }
        : group
    );
    setDomainGroups(updatedGroups);
    setEditingSubCategory(null);
    setMessage('Sub-Category updated.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteSubCategory = (groupId: string, categoryId: string, subCategoryId: string) => {
    const updatedGroups = domainGroups.map((group) =>
      group.id === groupId
        ? {
          ...group,
          categories: group.categories.map((category) =>
            category.id === categoryId
              ? {
                ...category,
                subCategories: category.subCategories.filter((subCategory) => subCategory.id !== subCategoryId),
              }
              : category
          ),
        }
        : group
    );
    setDomainGroups(updatedGroups);
    setMessage('Sub-Category deleted.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditingCategory(null);
    setEditingSubCategory(null);
  };

  const toggleGroupExpansion = (groupId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpandedCategories = new Set(expandedCategories);
    if (newExpandedCategories.has(categoryId)) {
      newExpandedCategories.delete(categoryId);
    } else {
      newExpandedCategories.add(categoryId);
    }
    setExpandedCategories(newExpandedCategories);
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-foreground mb-2">Domain Groups Configuration</h2>
        <p className="text-muted-foreground">
          Configure the hierarchical structure of Domain Groups, Categories, and Sub-Categories
        </p>
      </div>

      {/* Industry Segment Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Industry Segment</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedIndustrySegment} onValueChange={setSelectedIndustrySegment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an industry segment to filter (or show all)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industry Segments</SelectItem>
              {industrySegments.map((segment) => (
                <SelectItem key={segment} value={segment}>{segment}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {message && (
        <Alert>
          <AlertDescription className="text-left">{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="text-left">
          <CardTitle className="flex items-center justify-between">
            <span>Domain Groups Structure</span>
            <div className="flex gap-2">
              <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Domain Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Domain Group</DialogTitle>
                    <DialogDescription>
                      Create a new domain group with an industry segment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="groupName">Group Name</Label>
                      <Input
                        id="groupName"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Enter group name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industrySegment">Industry Segment</Label>
                      <Select value={newGroupIndustrySegment} onValueChange={setNewGroupIndustrySegment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry segment" />
                        </SelectTrigger>
                        <SelectContent>
                          {industrySegments.map((segment) => (
                            <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddGroup}>Add Group</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Add a category to an existing domain group.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="categoryGroup">Select Domain Group</Label>
                      <Select value={selectedGroupForCategory} onValueChange={setSelectedGroupForCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a domain group" />
                        </SelectTrigger>
                        <SelectContent>
                          {domainGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddCategory}>Add Category</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showAddSubCategoryDialog} onOpenChange={setShowAddSubCategoryDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sub-Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Sub-Category</DialogTitle>
                    <DialogDescription>
                      Add a sub-category to an existing category.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subCategoryGroup">Select Domain Group</Label>
                      <Select value={selectedGroupForSubCategory} onValueChange={setSelectedGroupForSubCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a domain group" />
                        </SelectTrigger>
                        <SelectContent>
                          {domainGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subCategoryCategory">Select Category</Label>
                      <Select 
                        value={selectedCategoryForSubCategory} 
                        onValueChange={setSelectedCategoryForSubCategory}
                        disabled={!selectedGroupForSubCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedGroupForSubCategory && 
                            domainGroups
                              .find(g => g.id === selectedGroupForSubCategory)
                              ?.categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                              ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subCategoryName">Sub-Category Name</Label>
                      <Input
                        id="subCategoryName"
                        value={newSubCategoryName}
                        onChange={(e) => setNewSubCategoryName(e.target.value)}
                        placeholder="Enter sub-category name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subCategoryDescription">Description (Optional)</Label>
                      <Textarea
                        id="subCategoryDescription"
                        value={newSubCategoryDescription}
                        onChange={(e) => setNewSubCategoryDescription(e.target.value)}
                        placeholder="Enter sub-category description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddSubCategory}>Add Sub-Category</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredDomainGroups.map((group, groupIndex) => (
              <div key={group.id} className={`p-4 rounded-lg border-2 ${groupColors[groupIndex % groupColors.length]}`}>
                {/* Domain Group Header */}
                <div className="flex items-center gap-3 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGroupExpansion(group.id)}
                    className="p-1 h-auto"
                  >
                    {expandedGroups.has(group.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-green-600 text-lg font-bold">✅</span>
                    <div className="flex-1">
                      <div className="text-xl font-bold text-foreground mb-1">
                        GROUP {groupIndex + 1}: {group.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingGroup(group.id);
                          setEditingGroupName(group.name);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const updatedGroups = domainGroups.filter((g) => g.id !== group.id);
                          setDomainGroups(updatedGroups);
                          showMessage('Domain Group deleted.');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {expandedGroups.has(group.id) && (
                  <div className="ml-8 space-y-4">
                    {group.categories.map((category) => (
                      <div key={category.id} className="border-l-2 border-secondary pl-4">
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCategoryExpansion(category.id)}
                            className="p-1 h-auto"
                          >
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <div className="flex items-center gap-3 flex-1 justify-between">
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-foreground">
                                Category: {category.name}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingCategory(category.id);
                                  setEditingCategoryName(category.name);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const updatedGroups = domainGroups.map((g) =>
                                    g.id === group.id
                                      ? {
                                          ...g,
                                          categories: g.categories.filter((c) => c.id !== category.id),
                                        }
                                      : g
                                  );
                                  setDomainGroups(updatedGroups);
                                  showMessage('Category deleted.');
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Sub-Categories */}
                        {expandedCategories.has(category.id) && (
                          <div className="ml-6 space-y-3">
                            {category.subCategories.map((subCategory) => (
                              <div key={subCategory.id} className="border-l border-muted pl-4">
                                <div className="flex items-start gap-3 justify-between">
                                  <div className="flex-1">
                                    <div className="text-base font-medium text-foreground mb-1">
                                      Sub-Category: {subCategory.name}
                                    </div>
                                    {subCategory.description && (
                                      <div className="text-sm text-muted-foreground">
                                        {subCategory.description}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setEditingSubCategory(subCategory.id);
                                        setEditingSubCategoryName(subCategory.name);
                                      }}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        const updatedGroups = domainGroups.map((g) =>
                                          g.id === group.id
                                            ? {
                                                ...g,
                                                categories: g.categories.map((c) =>
                                                  c.id === category.id
                                                    ? {
                                                        ...c,
                                                        subCategories: c.subCategories.filter(
                                                          (sc) => sc.id !== subCategory.id
                                                        ),
                                                      }
                                                    : c
                                                ),
                                              }
                                            : g
                                        );
                                        setDomainGroups(updatedGroups);
                                        showMessage('Sub-Category deleted.');
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterDataStructureConfig;
