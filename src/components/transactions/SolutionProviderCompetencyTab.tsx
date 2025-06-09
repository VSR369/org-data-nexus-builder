
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

interface CompetencyAssessment {
  groupId: string;
  categoryId: string;
  subCategoryId: string;
  capability: 'basic' | 'advanced' | 'guru' | 'not-applicable';
}

interface SolutionProviderCompetencyTabProps {
  selectedIndustrySegment: string;
}

const SolutionProviderCompetencyTab: React.FC<SolutionProviderCompetencyTabProps> = ({ 
  selectedIndustrySegment 
}) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set<string>());
  const [expandedCategories, setExpandedCategories] = useState(new Set<string>());
  const [competencyAssessments, setCompetencyAssessments] = useState<Record<string, CompetencyAssessment>>({});

  // Master data - this would normally come from your master data structure
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
            { id: '101-1', name: 'Vision, Mission, and Goals Alignment' },
            { id: '101-2', name: 'Strategic Planning Frameworks' },
            { id: '101-3', name: 'Competitive Positioning' },
            { id: '101-4', name: 'Long-Term Scenario Thinking' },
          ],
        },
        {
          id: '102',
          name: 'Business Model & Value Proposition Design',
          subCategories: [
            { id: '102-1', name: 'Revenue Models & Monetization' },
            { id: '102-2', name: 'Customer Segments & Value Mapping' },
            { id: '102-3', name: 'Partner Ecosystem Design' },
            { id: '102-4', name: 'Business Sustainability Models' },
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
            { id: '201-1', name: 'Requirement Analysis & Specification' },
            { id: '201-2', name: 'System Design Architecture' },
            { id: '201-3', name: 'Prototyping & Iterative Development' },
            { id: '201-4', name: 'Quality & Reliability Engineering' },
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
          name: 'Technology & Digital Transformation',
          subCategories: [
            { id: '301-1', name: 'Enterprise Architecture' },
            { id: '301-2', name: 'Cloud & Edge Infrastructure' },
            { id: '301-3', name: 'API & Integration Frameworks' },
            { id: '301-4', name: 'DevSecOps & Cybersecurity' },
          ],
        },
      ],
    },
  ];

  const filteredDomainGroups = selectedIndustrySegment === 'all' || !selectedIndustrySegment
    ? masterDomainGroups 
    : masterDomainGroups.filter(group => group.industrySegment === selectedIndustrySegment);

  const groupColors = [
    'bg-blue-50 border-blue-200',
    'bg-green-50 border-green-200',
    'bg-purple-50 border-purple-200',
    'bg-orange-50 border-orange-200',
    'bg-teal-50 border-teal-200',
    'bg-pink-50 border-pink-200'
  ];

  useEffect(() => {
    // Initialize all assessments with 'advanced' as default
    const initialAssessments: Record<string, CompetencyAssessment> = {};
    
    filteredDomainGroups.forEach(group => {
      group.categories.forEach(category => {
        category.subCategories.forEach(subCategory => {
          const key = `${group.id}-${category.id}-${subCategory.id}`;
          initialAssessments[key] = {
            groupId: group.id,
            categoryId: category.id,
            subCategoryId: subCategory.id,
            capability: 'advanced'
          };
        });
      });
    });
    
    setCompetencyAssessments(initialAssessments);
  }, [selectedIndustrySegment]);

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

  const updateCapability = (groupId: string, categoryId: string, subCategoryId: string, capability: string) => {
    const key = `${groupId}-${categoryId}-${subCategoryId}`;
    setCompetencyAssessments(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        capability: capability as 'basic' | 'advanced' | 'guru' | 'not-applicable'
      }
    }));
  };

  const getCapabilityBadgeVariant = (capability: string) => {
    switch (capability) {
      case 'guru': return 'default';
      case 'advanced': return 'secondary';
      case 'basic': return 'outline';
      case 'not-applicable': return 'destructive';
      default: return 'outline';
    }
  };

  if (!selectedIndustrySegment || selectedIndustrySegment === 'all') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Please select an industry segment to view competency assessment parameters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solution Provider Competency Assessment Parameters</CardTitle>
          <p className="text-sm text-muted-foreground">
            Assess your capability level for each competency area. Default level is set to Advanced - you can modify as needed.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredDomainGroups.map((group, groupIndex) => (
              <div key={group.id} className={`p-6 rounded-xl border-2 ${groupColors[groupIndex % groupColors.length]} shadow-sm`}>
                {/* Domain Group Header */}
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGroupExpansion(group.id)}
                    className="p-2 h-auto hover:bg-white/60"
                  >
                    {expandedGroups.has(group.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </Button>
                  
                  <div className="flex-1">
                    <div className="text-xl font-bold text-foreground">
                      {group.name}
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {expandedGroups.has(group.id) && (
                  <div className="ml-8 space-y-4">
                    {group.categories.map((category) => (
                      <div key={category.id} className="border-l-4 border-secondary pl-6 bg-white/30 rounded-r-lg py-4">
                        {/* Category Header */}
                        <div className="flex items-center gap-4 mb-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCategoryExpansion(category.id)}
                            className="p-2 h-auto hover:bg-white/60"
                          >
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <div className="flex-1">
                            <div className="text-lg font-semibold text-foreground">
                              {category.name}
                            </div>
                          </div>
                        </div>

                        {/* Sub-Categories */}
                        {expandedCategories.has(category.id) && (
                          <div className="ml-8 space-y-3">
                            {category.subCategories.map((subCategory) => {
                              const assessmentKey = `${group.id}-${category.id}-${subCategory.id}`;
                              const currentCapability = competencyAssessments[assessmentKey]?.capability || 'advanced';
                              
                              return (
                                <div key={subCategory.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border">
                                  <div className="flex-1">
                                    <div className="text-base font-medium text-foreground mb-1">
                                      {subCategory.name}
                                    </div>
                                    {subCategory.description && (
                                      <div className="text-sm text-muted-foreground">
                                        {subCategory.description}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-3 ml-4">
                                    <Label className="text-sm font-medium">Capability:</Label>
                                    <Select
                                      value={currentCapability}
                                      onValueChange={(value) => updateCapability(group.id, category.id, subCategory.id, value)}
                                    >
                                      <SelectTrigger className="w-40">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                        <SelectItem value="guru">Guru</SelectItem>
                                        <SelectItem value="not-applicable">Not Applicable</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Badge variant={getCapabilityBadgeVariant(currentCapability)} className="min-w-[100px] justify-center">
                                      {currentCapability === 'not-applicable' ? 'Not Applicable' : 
                                       currentCapability.charAt(0).toUpperCase() + currentCapability.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
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

export default SolutionProviderCompetencyTab;
