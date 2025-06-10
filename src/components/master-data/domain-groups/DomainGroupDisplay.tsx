
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Building2, FolderTree, Target, Globe } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domainGroupsDataManager';

interface DomainGroupDisplayProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

const DomainGroupDisplay: React.FC<DomainGroupDisplayProps> = ({ data, onDataUpdate }) => {
  const { toast } = useToast();

  // Handle delete
  const handleDelete = (domainGroupId: string) => {
    const updatedData = {
      domainGroups: data.domainGroups.filter(dg => dg.id !== domainGroupId),
      categories: data.categories.filter(cat => cat.domainGroupId !== domainGroupId),
      subCategories: data.subCategories.filter(sub => {
        const category = data.categories.find(cat => cat.id === sub.categoryId);
        return category?.domainGroupId !== domainGroupId;
      })
    };
    
    onDataUpdate(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    toast({
      title: "Deleted",
      description: "Domain group hierarchy deleted successfully",
    });
  };

  // Group hierarchical data by industry segment
  const getGroupedHierarchicalData = () => {
    const hierarchicalData = data.domainGroups.map(domainGroup => {
      const categories = data.categories.filter(cat => cat.domainGroupId === domainGroup.id);
      return {
        ...domainGroup,
        categories: categories.map(category => ({
          ...category,
          subCategories: data.subCategories.filter(sub => sub.categoryId === category.id)
        }))
      };
    });

    // Group by industry segment
    const grouped = hierarchicalData.reduce((acc, domainGroup) => {
      const industryKey = domainGroup.industrySegmentName || 'Unknown Industry';
      if (!acc[industryKey]) {
        acc[industryKey] = [];
      }
      acc[industryKey].push(domainGroup);
      return acc;
    }, {} as Record<string, typeof hierarchicalData>);

    return grouped;
  };

  const groupedData = getGroupedHierarchicalData();

  if (Object.keys(groupedData).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          Saved Domain Group Hierarchies
        </CardTitle>
        <CardDescription>
          Your configured hierarchies organized by industry segment. These are ready for use in competency evaluations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedData).map(([industrySegment, domainGroups]) => (
            <div key={industrySegment} className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              {/* Industry Segment Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-blue-900">{industrySegment}</h2>
                  <p className="text-sm text-blue-700">
                    {domainGroups.length} Domain Group{domainGroups.length !== 1 ? 's' : ''} • {' '}
                    {domainGroups.reduce((sum, dg) => sum + dg.categories.length, 0)} Categories • {' '}
                    {domainGroups.reduce((sum, dg) => 
                      sum + dg.categories.reduce((catSum, cat) => catSum + cat.subCategories.length, 0), 0
                    )} Sub-Categories
                  </p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Industry Segment
                </Badge>
              </div>

              {/* Domain Groups within this Industry Segment */}
              <div className="space-y-4">
                {domainGroups.map((domainGroup) => (
                  <div key={domainGroup.id} className="bg-white border rounded-lg p-5 shadow-sm">
                    {/* Domain Group Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">{domainGroup.name}</h3>
                          <Badge variant={domainGroup.isActive ? "default" : "secondary"}>
                            {domainGroup.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {domainGroup.description && (
                          <p className="text-muted-foreground mb-2">{domainGroup.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {domainGroup.categories.length} Categories
                          </span>
                          <span>
                            {domainGroup.categories.reduce((sum, cat) => sum + cat.subCategories.length, 0)} Sub-Categories
                          </span>
                          <span className="text-xs">
                            Created: {new Date(domainGroup.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(domainGroup.id)}
                        className="ml-4"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>

                    {/* Categories Accordion */}
                    {domainGroup.categories.length > 0 && (
                      <Accordion type="multiple" className="w-full">
                        {domainGroup.categories.map((category, categoryIndex) => (
                          <AccordionItem key={category.id} value={`category-${category.id}`}>
                            <AccordionTrigger className="text-left hover:no-underline">
                              <div className="flex items-center gap-3">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                  {categoryIndex + 1}
                                </span>
                                <div className="text-left">
                                  <div className="font-medium">{category.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {category.subCategories.length} sub-categories
                                    {category.description && ` • ${category.description}`}
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                              {/* Sub-Categories Grid */}
                              <div className="grid gap-3 ml-6">
                                {category.subCategories.map((subCategory, subIndex) => (
                                  <div key={subCategory.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border-l-2 border-primary/30">
                                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium mt-0.5 shrink-0">
                                      {categoryIndex + 1}.{subIndex + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-sm mb-1">{subCategory.name}</h4>
                                      {subCategory.description && (
                                        <p className="text-muted-foreground text-xs leading-relaxed">{subCategory.description}</p>
                                      )}
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs">
                                          {subCategory.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          Ready for Evaluation
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Footer */}
        <div className="mt-6 pt-6 border-t bg-muted/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Ready for Competency Evaluation</p>
              <p className="text-xs text-muted-foreground">
                These hierarchies are saved and available in Self Enrollment → Competency Evaluation
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <FolderTree className="w-3 h-3 mr-1" />
              {Object.values(groupedData).flat().length} Hierarchies Saved
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainGroupDisplay;
