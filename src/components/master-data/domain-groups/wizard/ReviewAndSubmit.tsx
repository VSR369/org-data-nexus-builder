
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, AlertCircle, ChevronDown, ChevronRight, Save, Globe, Building2, Target } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { DomainGroupsData, DomainGroup, Category, SubCategory } from '@/types/domainGroups';
import { domainGroupsDataManager } from '../domainGroupsDataManager';
import { industrySegmentDataManager } from '../industrySegmentDataManager';

interface ReviewAndSubmitProps {
  wizardData: WizardData;
  existingData: DomainGroupsData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onSubmit: (newData: DomainGroupsData) => void;
  onValidationChange: (isValid: boolean) => void;
}

const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  wizardData,
  existingData,
  onUpdate,
  onSubmit,
  onValidationChange
}) => {
  const [processedData, setProcessedData] = useState<DomainGroupsData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedIndustrySegments, setExpandedIndustrySegments] = useState<Set<string>>(new Set());
  const [expandedDomainGroups, setExpandedDomainGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Process the manual data into proper domain groups structure
    if (wizardData.dataSource === 'manual' && wizardData.manualData) {
      processManualData();
    } else {
      onValidationChange(false);
    }
  }, [wizardData.manualData, wizardData.dataSource, wizardData.selectedIndustrySegment, wizardData.selectedDomainGroup]);

  const processManualData = () => {
    console.log('ReviewAndSubmit: Processing manual data');
    setIsProcessing(true);
    
    try {
      const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
      const selectedSegment = industrySegments.find(seg => seg.id === wizardData.selectedIndustrySegment);
      
      if (!selectedSegment || !wizardData.selectedDomainGroup || !wizardData.manualData) {
        onValidationChange(false);
        return;
      }

      const timestamp = new Date().toISOString();
      const domainGroupId = `dg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create Domain Group
      const newDomainGroups: DomainGroup[] = [{
        id: domainGroupId,
        name: wizardData.selectedDomainGroup,
        description: wizardData.manualData.domainGroupDescription,
        industrySegmentId: selectedSegment.id,
        industrySegmentName: selectedSegment.industrySegment,
        isActive: true,
        createdAt: timestamp
      }];

      // Create Categories and Sub-Categories
      const newCategories: Category[] = [];
      const newSubCategories: SubCategory[] = [];

      wizardData.manualData.categories?.forEach((catData, catIndex) => {
        if (!catData.name.trim()) return;

        const categoryId = `cat-${Date.now()}-${catIndex}-${Math.random().toString(36).substr(2, 9)}`;
        
        newCategories.push({
          id: categoryId,
          name: catData.name,
          description: catData.description,
          domainGroupId: domainGroupId,
          isActive: true,
          createdAt: timestamp
        });

        // Add sub-categories for this category
        wizardData.manualData?.subCategories?.forEach((subData, subIndex) => {
          if (subData.categoryName === catData.name && subData.name.trim()) {
            newSubCategories.push({
              id: `sub-${Date.now()}-${catIndex}-${subIndex}-${Math.random().toString(36).substr(2, 9)}`,
              name: subData.name,
              description: subData.description,
              categoryId: categoryId,
              isActive: true,
              createdAt: timestamp
            });
          }
        });
      });

      const processedData: DomainGroupsData = {
        domainGroups: newDomainGroups,
        categories: newCategories,
        subCategories: newSubCategories
      };

      console.log('ReviewAndSubmit: Processed manual data:', processedData);
      setProcessedData(processedData);
      
      // Initialize all items as expanded by default
      const industrySegmentName = selectedSegment.industrySegment;
      setExpandedIndustrySegments(new Set([industrySegmentName]));
      setExpandedDomainGroups(new Set([domainGroupId]));
      setExpandedCategories(new Set(newCategories.map(cat => cat.id)));
      
      onValidationChange(true);
    } catch (error) {
      console.error('ReviewAndSubmit: Error processing manual data:', error);
      onValidationChange(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (processedData) {
      console.log('ReviewAndSubmit: Submitting processed data');
      
      // Merge with existing data
      const mergedData: DomainGroupsData = {
        domainGroups: [...existingData.domainGroups, ...processedData.domainGroups],
        categories: [...existingData.categories, ...processedData.categories],
        subCategories: [...existingData.subCategories, ...processedData.subCategories]
      };
      
      // Save to data manager
      domainGroupsDataManager.saveData(mergedData);
      
      // Call parent submit handler
      onSubmit(mergedData);
    }
  };

  const toggleIndustrySegmentExpansion = (industrySegment: string) => {
    const newExpanded = new Set(expandedIndustrySegments);
    if (newExpanded.has(industrySegment)) {
      newExpanded.delete(industrySegment);
    } else {
      newExpanded.add(industrySegment);
    }
    setExpandedIndustrySegments(newExpanded);
  };

  const toggleDomainGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedDomainGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedDomainGroups(newExpanded);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (isProcessing) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-8 h-8 mx-auto mb-4 animate-spin" />
        <p className="text-muted-foreground">Processing your manual data...</p>
      </div>
    );
  }

  if (!processedData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to process the data. Please check your inputs and try again.
        </AlertDescription>
      </Alert>
    );
  }

  // Prepare data for display
  const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
  const selectedSegment = industrySegments.find(seg => seg.id === wizardData.selectedIndustrySegment);
  const industrySegmentName = selectedSegment?.industrySegment || 'Unknown Industry';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">
          Review the new hierarchy structure before saving to database
        </p>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Creation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {processedData.domainGroups.length}
              </div>
              <div className="text-sm text-muted-foreground">Domain Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {processedData.categories.length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {processedData.subCategories.length}
              </div>
              <div className="text-sm text-muted-foreground">Sub-Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Hierarchy Preview - Only shows the newly created hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>New Hierarchy Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Industry Segment Level */}
            <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <Collapsible 
                open={expandedIndustrySegments.has(industrySegmentName)}
                onOpenChange={() => toggleIndustrySegmentExpansion(industrySegmentName)}
              >
                <CollapsibleTrigger className="w-full text-left hover:bg-blue-100/50 rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="text-2xl font-bold text-blue-900">{industrySegmentName}</h3>
                        <p className="text-sm text-blue-700">Industry Segment</p>
                      </div>
                    </div>
                    {expandedIndustrySegments.has(industrySegmentName) ? (
                      <ChevronDown className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-4">
                  <div className="space-y-3 ml-6">
                    {processedData.domainGroups.map((domainGroup) => {
                      const categories = processedData.categories.filter(cat => cat.domainGroupId === domainGroup.id);
                      
                      return (
                        <div key={domainGroup.id} className="bg-white border rounded-lg">
                          <Collapsible 
                            open={expandedDomainGroups.has(domainGroup.id)}
                            onOpenChange={() => toggleDomainGroupExpansion(domainGroup.id)}
                          >
                            <CollapsibleTrigger className="w-full p-4 text-left hover:bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Building2 className="w-5 h-5 text-primary" />
                                  <div>
                                    <h4 className="text-xl font-semibold text-primary">{domainGroup.name}</h4>
                                    <p className="text-sm text-muted-foreground">Domain Group</p>
                                  </div>
                                </div>
                                {expandedDomainGroups.has(domainGroup.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent className="px-4 pb-4">
                              <div className="space-y-2 ml-8">
                                {categories.map((category) => {
                                  const subCategories = processedData.subCategories.filter(sub => sub.categoryId === category.id);
                                  
                                  return (
                                    <div key={category.id} className="border-l-2 border-primary/20 pl-4">
                                      <Collapsible
                                        open={expandedCategories.has(category.id)}
                                        onOpenChange={() => toggleCategoryExpansion(category.id)}
                                      >
                                        <CollapsibleTrigger className="w-full text-left p-2 hover:bg-gray-50 rounded">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <Target className="w-4 h-4 text-primary" />
                                              <span className="text-lg font-medium">{category.name}</span>
                                              <Badge variant="outline" className="text-xs">
                                                {subCategories.length} sub-categories
                                              </Badge>
                                            </div>
                                            {expandedCategories.has(category.id) ? (
                                              <ChevronDown className="w-3 h-3" />
                                            ) : (
                                              <ChevronRight className="w-3 h-3" />
                                            )}
                                          </div>
                                        </CollapsibleTrigger>
                                        
                                        <CollapsibleContent className="mt-2">
                                          <div className="space-y-1 ml-6">
                                            {subCategories.map((subCategory, index) => (
                                              <div key={subCategory.id} className="flex items-start gap-2 p-2 bg-muted/30 rounded text-sm">
                                                <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium shrink-0">
                                                  {index + 1}
                                                </span>
                                                <div>
                                                  <div className="font-medium">{subCategory.name}</div>
                                                  {subCategory.description && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                      {subCategory.description}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </div>
                                  );
                                })}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button onClick={handleSubmit} size="lg" className="flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save to Database
        </Button>
      </div>
    </div>
  );
};

export default ReviewAndSubmit;
