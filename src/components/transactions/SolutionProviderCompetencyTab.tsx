
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

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

interface CompetencyCapability {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  isActive: boolean;
}

interface CompetencyAssessment {
  groupId: string;
  categoryId: string;
  subCategoryId: string;
  capability: string;
}

interface SolutionProviderCompetencyTabProps {
  selectedIndustrySegment: string;
}

const SolutionProviderCompetencyTab: React.FC<SolutionProviderCompetencyTabProps> = ({ 
  selectedIndustrySegment 
}) => {
  const [competencyAssessments, setCompetencyAssessments] = useState<Record<string, CompetencyAssessment>>({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Master data for Domain Groups - this should eventually come from your actual master data store
  const masterDomainGroups: DomainGroup[] = [
    {
      id: '1',
      name: 'Strategy, Innovation & Growth',
      industrySegment: 'Banking, Financial Services & Insurance (BFSI)',
      categories: [
        {
          id: '101',
          name: 'Strategic Vision & Business Planning',
          subCategories: [
            { id: '101-1', name: 'Vision, Mission, and Goals Alignment', description: 'Ability to align organizational vision with strategic goals' },
            { id: '101-2', name: 'Strategic Planning Frameworks', description: 'Expertise in strategic planning methodologies and frameworks' },
            { id: '101-3', name: 'Competitive Positioning', description: 'Skills in market analysis and competitive positioning' },
            { id: '101-4', name: 'Long-Term Scenario Thinking', description: 'Capability for long-term strategic scenario planning' },
          ],
        },
        {
          id: '102',
          name: 'Business Model & Value Proposition Design',
          subCategories: [
            { id: '102-1', name: 'Revenue Models & Monetization', description: 'Expertise in designing revenue models and monetization strategies' },
            { id: '102-2', name: 'Customer Segments & Value Mapping', description: 'Skills in customer segmentation and value proposition mapping' },
            { id: '102-3', name: 'Partner Ecosystem Design', description: 'Ability to design and manage partner ecosystems' },
            { id: '102-4', name: 'Business Sustainability Models', description: 'Knowledge of sustainable business model design' },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Operations, Delivery, Risk & Sustainability',
      industrySegment: 'Banking, Financial Services & Insurance (BFSI)',
      categories: [
        {
          id: '201',
          name: 'Product & Systems Development Excellence',
          subCategories: [
            { id: '201-1', name: 'Requirement Analysis & Specification', description: 'Skills in analyzing and documenting system requirements' },
            { id: '201-2', name: 'System Design Architecture', description: 'Expertise in designing scalable system architectures' },
            { id: '201-3', name: 'Prototyping & Iterative Development', description: 'Capability for agile prototyping and iterative development' },
            { id: '201-4', name: 'Quality & Reliability Engineering', description: 'Knowledge of quality assurance and reliability engineering' },
          ],
        },
        {
          id: '202',
          name: 'Risk Management & Compliance',
          subCategories: [
            { id: '202-1', name: 'Regulatory Compliance Management', description: 'Expertise in managing regulatory compliance requirements' },
            { id: '202-2', name: 'Risk Assessment & Mitigation', description: 'Skills in risk assessment and mitigation strategies' },
            { id: '202-3', name: 'Internal Controls & Audit', description: 'Knowledge of internal controls and audit processes' },
          ],
        },
      ],
    },
    {
      id: '3',
      name: 'Technology & Digital Transformation',
      industrySegment: 'Information Technology & Software Services',
      categories: [
        {
          id: '301',
          name: 'Digital Architecture & Infrastructure',
          subCategories: [
            { id: '301-1', name: 'Enterprise Architecture', description: 'Expertise in enterprise architecture design and implementation' },
            { id: '301-2', name: 'Cloud & Edge Infrastructure', description: 'Skills in cloud and edge computing infrastructure' },
            { id: '301-3', name: 'API & Integration Frameworks', description: 'Knowledge of API design and integration frameworks' },
            { id: '301-4', name: 'DevSecOps & Cybersecurity', description: 'Expertise in DevSecOps practices and cybersecurity' },
          ],
        },
      ],
    },
    {
      id: '4',
      name: 'Customer Experience & Digital Marketing',
      industrySegment: 'Retail & E-Commerce',
      categories: [
        {
          id: '401',
          name: 'Customer Journey & Experience Design',
          subCategories: [
            { id: '401-1', name: 'Customer Journey Mapping', description: 'Skills in mapping and optimizing customer journeys' },
            { id: '401-2', name: 'User Experience (UX) Design', description: 'Expertise in UX design principles and practices' },
            { id: '401-3', name: 'Customer Feedback & Analytics', description: 'Knowledge of customer feedback analysis and actionable insights' },
          ],
        },
      ],
    },
  ];

  // Competency Capabilities from master data
  const competencyCapabilities: CompetencyCapability[] = [
    {
      id: '1',
      name: 'Guru',
      description: 'Expert level with deep knowledge and ability to guide others',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      order: 1,
      isActive: true,
    },
    {
      id: '2',
      name: 'Advanced',
      description: 'High proficiency with comprehensive understanding',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      order: 2,
      isActive: true,
    },
    {
      id: '3',
      name: 'Basic',
      description: 'Fundamental knowledge and basic competency',
      color: 'bg-green-100 text-green-800 border-green-300',
      order: 3,
      isActive: true,
    },
    {
      id: '4',
      name: 'Not Applicable',
      description: 'This competency area is not relevant or applicable',
      color: 'bg-gray-100 text-gray-800 border-gray-300',
      order: 4,
      isActive: true,
    },
  ];

  const getIndustrySegmentName = (value: string) => {
    switch (value) {
      case 'bfsi': return 'Banking, Financial Services & Insurance (BFSI)';
      case 'retail': return 'Retail & E-Commerce';
      case 'healthcare': return 'Healthcare & Life Sciences';
      case 'it': return 'Information Technology & Software Services';
      case 'telecom': return 'Telecommunications';
      case 'education': return 'Education & EdTech';
      case 'manufacturing': return 'Manufacturing';
      case 'logistics': return 'Logistics & Supply Chain';
      default: return value;
    }
  };

  const filteredDomainGroups = selectedIndustrySegment === 'all' || !selectedIndustrySegment
    ? masterDomainGroups 
    : masterDomainGroups.filter(group => group.industrySegment === getIndustrySegmentName(selectedIndustrySegment));

  const activeCapabilities = competencyCapabilities
    .filter(cap => cap.isActive)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    // Initialize all assessments with 'Advanced' as default
    const initialAssessments: Record<string, CompetencyAssessment> = {};
    
    filteredDomainGroups.forEach(group => {
      group.categories.forEach(category => {
        category.subCategories.forEach(subCategory => {
          const key = `${group.id}-${category.id}-${subCategory.id}`;
          initialAssessments[key] = {
            groupId: group.id,
            categoryId: category.id,
            subCategoryId: subCategory.id,
            capability: 'Advanced'
          };
        });
      });
    });
    
    setCompetencyAssessments(initialAssessments);

    // Expand all groups and categories by default to show data
    const allGroupIds = new Set(filteredDomainGroups.map(group => group.id));
    const allCategoryIds = new Set(
      filteredDomainGroups.flatMap(group => 
        group.categories.map(category => `${group.id}-${category.id}`)
      )
    );
    
    setExpandedGroups(allGroupIds);
    setExpandedCategories(allCategoryIds);
  }, [selectedIndustrySegment]);

  const updateCapability = (groupId: string, categoryId: string, subCategoryId: string, capability: string) => {
    const key = `${groupId}-${categoryId}-${subCategoryId}`;
    setCompetencyAssessments(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        capability: capability
      }
    }));
  };

  const getCapabilityBadgeColor = (capabilityName: string) => {
    const capability = competencyCapabilities.find(cap => cap.name === capabilityName);
    return capability ? capability.color : 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const toggleCategoryExpansion = (groupId: string, categoryId: string) => {
    const key = `${groupId}-${categoryId}`;
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  if (!selectedIndustrySegment || selectedIndustrySegment === 'all') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Please select an industry segment in the Basic Details & Information tab to view competency assessment parameters.
          </p>
        </CardContent>
      </Card>
    );
  }

  console.log('Selected Industry Segment:', selectedIndustrySegment);
  console.log('Filtered Domain Groups:', filteredDomainGroups);
  console.log('Competency Assessments:', competencyAssessments);

  return (
    <div className="space-y-6">
      {/* Selected Industry Segment Display */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Industry Segment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-base px-4 py-2">
              {getIndustrySegmentName(selectedIndustrySegment)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Competency Assessment Parameters</CardTitle>
          <p className="text-sm text-muted-foreground">
            Assess your capability level for each competency area. Default level is set to Advanced - you can modify as needed.
          </p>
        </CardHeader>
        <CardContent>
          {filteredDomainGroups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No domain groups found for the selected industry segment: {getIndustrySegmentName(selectedIndustrySegment)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDomainGroups.map((group) => (
                <div key={group.id} className="border rounded-lg">
                  <Collapsible 
                    open={expandedGroups.has(group.id)} 
                    onOpenChange={() => toggleGroupExpansion(group.id)}
                  >
                    <CollapsibleTrigger className="w-full px-6 py-4 text-left hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold">{group.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {group.categories.length} categories • {group.categories.reduce((total, cat) => total + cat.subCategories.length, 0)} sub-categories
                          </div>
                        </div>
                        {expandedGroups.has(group.id) ? 
                          <ChevronDown className="w-5 h-5" /> : 
                          <ChevronRight className="w-5 h-5" />
                        }
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-6 pb-4">
                      <div className="space-y-3">
                        {group.categories.map((category) => (
                          <div key={category.id} className="border rounded-md">
                            <Collapsible 
                              open={expandedCategories.has(`${group.id}-${category.id}`)} 
                              onOpenChange={() => toggleCategoryExpansion(group.id, category.id)}
                            >
                              <CollapsibleTrigger className="w-full px-4 py-3 text-left hover:bg-muted/30 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-base font-medium">{category.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {category.subCategories.length} sub-categories
                                    </div>
                                  </div>
                                  {expandedCategories.has(`${group.id}-${category.id}`) ? 
                                    <ChevronDown className="w-4 h-4" /> : 
                                    <ChevronRight className="w-4 h-4" />
                                  }
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="px-4 pb-3">
                                <div className="space-y-3">
                                  {category.subCategories.map((subCategory) => {
                                    const assessmentKey = `${group.id}-${category.id}-${subCategory.id}`;
                                    const currentCapability = competencyAssessments[assessmentKey]?.capability || 'Advanced';
                                    
                                    return (
                                      <div key={subCategory.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
                                        <div className="flex-1">
                                          <div className="text-sm font-medium mb-1">
                                            {subCategory.name}
                                          </div>
                                          {subCategory.description && (
                                            <div className="text-xs text-muted-foreground">
                                              {subCategory.description}
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="flex items-center gap-3 ml-4">
                                          <Label className="text-xs font-medium">Capability:</Label>
                                          <Select
                                            value={currentCapability}
                                            onValueChange={(value) => updateCapability(group.id, category.id, subCategory.id, value)}
                                          >
                                            <SelectTrigger className="w-36">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {activeCapabilities.map((capability) => (
                                                <SelectItem key={capability.id} value={capability.name}>
                                                  {capability.name}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <Badge className={`min-w-[90px] justify-center text-xs ${getCapabilityBadgeColor(currentCapability)}`}>
                                            {currentCapability}
                                          </Badge>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionProviderCompetencyTab;
