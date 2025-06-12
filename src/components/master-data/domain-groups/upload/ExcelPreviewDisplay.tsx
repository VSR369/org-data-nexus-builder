
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2, Target, Globe, FolderTree } from 'lucide-react';

interface HierarchyData {
  [industrySegment: string]: {
    [domainGroup: string]: {
      [category: string]: string[];
    };
  };
}

interface SavedExcelDocument {
  fileName: string;
  fileSize: number;
  uploadDate: string;
  excelData: string[][];
  parsedData: ParsedExcelData[];
  hierarchyData: HierarchyData;
}

interface ParsedExcelData {
  industrySegment: string;
  domainGroup: string;
  category: string;
  subCategory: string;
}

interface ExcelPreviewDisplayProps {
  hierarchyData: HierarchyData;
  savedDocument: SavedExcelDocument | null;
}

const ExcelPreviewDisplay: React.FC<ExcelPreviewDisplayProps> = ({
  hierarchyData,
  savedDocument
}) => {
  if (Object.keys(hierarchyData).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          Excel Data Preview
        </CardTitle>
        <CardDescription>
          Preview of your uploaded domain groups hierarchy (not yet saved to master data)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(hierarchyData).map(([industrySegment, domainGroups]) => (
            <div key={industrySegment} className="border rounded-lg p-6 bg-gradient-to-r from-orange-50 to-amber-50">
              {/* Industry Segment Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-orange-900">{industrySegment}</h2>
                  <p className="text-sm text-orange-700">
                    {Object.keys(domainGroups).length} Domain Group{Object.keys(domainGroups).length !== 1 ? 's' : ''} • {' '}
                    {Object.values(domainGroups).reduce((sum, dg) => sum + Object.keys(dg).length, 0)} Categories • {' '}
                    {Object.values(domainGroups).reduce((sum, dg) => 
                      sum + Object.values(dg).reduce((catSum, cat) => catSum + cat.length, 0), 0
                    )} Sub-Categories
                  </p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Excel Import Preview
                </Badge>
              </div>

              {/* Domain Groups within this Industry Segment */}
              <div className="space-y-4">
                {Object.entries(domainGroups).map(([domainGroupName, categories]) => (
                  <div key={domainGroupName} className="bg-white border rounded-lg p-5 shadow-sm">
                    {/* Domain Group Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">{domainGroupName}</h3>
                          <Badge variant="outline" className="border-orange-300 text-orange-700">
                            Preview
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {Object.keys(categories).length} Categories
                          </span>
                          <span>
                            {Object.values(categories).reduce((sum, cat) => sum + cat.length, 0)} Sub-Categories
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Categories Accordion */}
                    {Object.keys(categories).length > 0 && (
                      <Accordion type="multiple" className="w-full">
                        {Object.entries(categories).map(([categoryName, subCategories], categoryIndex) => (
                          <AccordionItem key={categoryName} value={`category-${categoryName}`}>
                            <AccordionTrigger className="text-left hover:no-underline">
                              <div className="flex items-center gap-3">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                  {categoryIndex + 1}
                                </span>
                                <div className="text-left">
                                  <div className="font-medium">{categoryName}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {subCategories.length} sub-categories
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                              {/* Sub-Categories Grid */}
                              <div className="grid gap-3 ml-6">
                                {subCategories.map((subCategory, subIndex) => (
                                  <div key={subIndex} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border-l-2 border-primary/30">
                                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium mt-0.5 shrink-0">
                                      {categoryIndex + 1}.{subIndex + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-sm mb-1">{subCategory}</h4>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                                          Excel Import
                                        </Badge>
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
      </CardContent>
    </Card>
  );
};

export default ExcelPreviewDisplay;
