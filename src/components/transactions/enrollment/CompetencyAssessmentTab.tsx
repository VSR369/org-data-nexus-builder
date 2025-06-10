
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Building2, FolderTree, Target } from 'lucide-react';
import { DomainGroupsData } from '@/types/domainGroups';
import RatingSlider from './components/RatingSlider';

interface CompetencyAssessmentTabProps {
  selectedIndustrySegment: string;
  competencyData: any;
  updateCompetencyData: (domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

const CompetencyAssessmentTab: React.FC<CompetencyAssessmentTabProps> = ({
  selectedIndustrySegment,
  competencyData,
  updateCompetencyData
}) => {
  const [domainGroupsData, setDomainGroupsData] = useState<DomainGroupsData>({
    domainGroups: [],
    categories: [],
    subCategories: []
  });

  // Load domain groups from master data
  useEffect(() => {
    const loadDomainGroups = () => {
      try {
        const savedData = localStorage.getItem('master_data_domain_groups');
        if (savedData) {
          const data = JSON.parse(savedData);
          console.log('Loaded domain groups data:', data);
          setDomainGroupsData(data);
        } else {
          console.log('No domain groups found in master data');
          setDomainGroupsData({
            domainGroups: [],
            categories: [],
            subCategories: []
          });
        }
      } catch (error) {
        console.error('Error loading domain groups:', error);
        setDomainGroupsData({
          domainGroups: [],
          categories: [],
          subCategories: []
        });
      }
    };

    loadDomainGroups();
  }, []);

  // Filter domain groups by selected industry segment
  const relevantDomainGroups = domainGroupsData.domainGroups.filter(
    group => group.industrySegmentId === selectedIndustrySegment && group.isActive
  );

  console.log('CompetencyAssessmentTab - selectedIndustrySegment:', selectedIndustrySegment);
  console.log('CompetencyAssessmentTab - relevantDomainGroups:', relevantDomainGroups);

  // Get hierarchical data with categories and subcategories
  const getHierarchicalData = () => {
    return relevantDomainGroups.map(domainGroup => {
      const categories = domainGroupsData.categories.filter(
        cat => cat.domainGroupId === domainGroup.id && cat.isActive
      );
      
      return {
        ...domainGroup,
        categories: categories.map(category => ({
          ...category,
          subCategories: domainGroupsData.subCategories.filter(
            sub => sub.categoryId === category.id && sub.isActive
          )
        }))
      };
    });
  };

  const hierarchicalData = getHierarchicalData();

  // Get current rating for a subcategory
  const getCurrentRating = (domainGroupName: string, categoryName: string, subCategoryName: string) => {
    return competencyData[domainGroupName]?.[categoryName]?.[subCategoryName] || 0;
  };

  // Handle rating change
  const handleRatingChange = (domainGroupName: string, categoryName: string, subCategoryName: string, rating: number) => {
    console.log('Rating changed:', { domainGroupName, categoryName, subCategoryName, rating });
    updateCompetencyData(domainGroupName, categoryName, subCategoryName, rating);
  };

  if (!selectedIndustrySegment) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Please select an industry segment to view competency evaluation.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (hierarchicalData.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center gap-4">
            <FolderTree className="w-12 h-12 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground font-medium">
                No domain groups found for this industry segment
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Please configure domain groups in Master Data first.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Competency Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Rate your competency levels across different domain groups, categories, and sub-categories using the interactive sliders below.
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {hierarchicalData.length} Domain Groups
            </Badge>
            <Badge variant="outline">
              {hierarchicalData.reduce((total, group) => total + group.categories.length, 0)} Categories
            </Badge>
            <Badge variant="outline">
              {hierarchicalData.reduce((total, group) => 
                total + group.categories.reduce((catTotal, cat) => catTotal + cat.subCategories.length, 0), 0
              )} Sub-Categories
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Domain Groups Hierarchy with Rating Sliders */}
      <div className="space-y-4">
        {hierarchicalData.map((domainGroup) => (
          <Card key={domainGroup.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">{domainGroup.name}</CardTitle>
                <Badge variant="default">Domain Group</Badge>
              </div>
              {domainGroup.description && (
                <p className="text-sm text-muted-foreground">{domainGroup.description}</p>
              )}
            </CardHeader>
            <CardContent>
              {domainGroup.categories.length > 0 ? (
                <Accordion type="multiple" defaultValue={domainGroup.categories.map(cat => `category-${cat.id}`)} className="w-full">
                  {domainGroup.categories.map((category, categoryIndex) => (
                    <AccordionItem key={category.id} value={`category-${category.id}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                            {categoryIndex + 1}
                          </span>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.subCategories.length} sub-categories
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        {category.description && (
                          <p className="text-muted-foreground mb-6 italic">{category.description}</p>
                        )}
                        
                        {/* Sub-Categories with Rating Sliders */}
                        <div className="space-y-6 ml-4">
                          {category.subCategories.map((subCategory, subIndex) => (
                            <div key={subCategory.id} className="border-l-2 border-primary/30 pl-6 py-4 bg-muted/20 rounded-r-lg">
                              <div className="mb-4">
                                <div className="flex items-start gap-2 mb-3">
                                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium mt-0.5">
                                    {categoryIndex + 1}.{subIndex + 1}
                                  </span>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm">{subCategory.name}</h4>
                                    {subCategory.description && (
                                      <p className="text-muted-foreground text-sm mt-1">{subCategory.description}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Rating Slider */}
                              <div className="mt-4">
                                <RatingSlider
                                  subCategoryName={subCategory.name}
                                  description={subCategory.description}
                                  currentRating={getCurrentRating(domainGroup.name, category.name, subCategory.name)}
                                  onRatingChange={(rating) => 
                                    handleRatingChange(domainGroup.name, category.name, subCategory.name, rating)
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No categories configured for this domain group.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompetencyAssessmentTab;
