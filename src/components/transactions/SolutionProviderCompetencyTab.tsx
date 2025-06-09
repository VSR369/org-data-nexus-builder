
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
            Please select an industry segment in the Basic Details & Information tab to view competency assessment parameters.
          </p>
        </CardContent>
      </Card>
    );
  }

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
          <Accordion type="multiple" className="space-y-4">
            {filteredDomainGroups.map((group) => (
              <AccordionItem key={group.id} value={group.id} className="border rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="text-left">
                    <div className="text-lg font-semibold">{group.name}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <Accordion type="multiple" className="space-y-3">
                    {group.categories.map((category) => (
                      <AccordionItem key={category.id} value={category.id} className="border rounded-md">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                          <div className="text-left">
                            <div className="text-base font-medium">{category.name}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3">
                          <div className="space-y-3">
                            {category.subCategories.map((subCategory) => {
                              const assessmentKey = `${group.id}-${category.id}-${subCategory.id}`;
                              const currentCapability = competencyAssessments[assessmentKey]?.capability || 'advanced';
                              
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
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                        <SelectItem value="guru">Guru</SelectItem>
                                        <SelectItem value="not-applicable">Not Applicable</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Badge variant={getCapabilityBadgeVariant(currentCapability)} className="min-w-[90px] justify-center text-xs">
                                      {currentCapability === 'not-applicable' ? 'Not Applicable' : 
                                       currentCapability.charAt(0).toUpperCase() + currentCapability.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionProviderCompetencyTab;
