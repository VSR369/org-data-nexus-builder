
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronRight, 
  Building2, 
  Target, 
  Globe, 
  FolderTree,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { HierarchyData, SavedExcelDocument, ProcessingResult } from './excelProcessing';

interface ExcelTreeStructureDisplayProps {
  hierarchyData: HierarchyData;
  savedDocument: SavedExcelDocument | null;
  processingResult: ProcessingResult;
  onIntegrateToMasterData: () => void;
}

const ExcelTreeStructureDisplay: React.FC<ExcelTreeStructureDisplayProps> = ({
  hierarchyData,
  savedDocument,
  processingResult,
  onIntegrateToMasterData
}) => {
  const [expandedIndustries, setExpandedIndustries] = useState<Set<string>>(new Set());
  const [expandedDomainGroups, setExpandedDomainGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  if (Object.keys(hierarchyData).length === 0) {
    return null;
  }

  const toggleIndustryExpansion = (industry: string) => {
    const newExpanded = new Set(expandedIndustries);
    if (newExpanded.has(industry)) {
      newExpanded.delete(industry);
    } else {
      newExpanded.add(industry);
    }
    setExpandedIndustries(newExpanded);
  };

  const toggleDomainGroupExpansion = (key: string) => {
    const newExpanded = new Set(expandedDomainGroups);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedDomainGroups(newExpanded);
  };

  const toggleCategoryExpansion = (key: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAll = () => {
    setExpandedIndustries(new Set(Object.keys(hierarchyData)));
    const allDomainGroups = new Set<string>();
    const allCategories = new Set<string>();
    
    Object.entries(hierarchyData).forEach(([industry, domainGroups]) => {
      Object.entries(domainGroups).forEach(([domainGroup, categories]) => {
        const dgKey = `${industry}_${domainGroup}`;
        allDomainGroups.add(dgKey);
        Object.keys(categories).forEach(category => {
          allCategories.add(`${dgKey}_${category}`);
        });
      });
    });
    
    setExpandedDomainGroups(allDomainGroups);
    setExpandedCategories(allCategories);
  };

  const collapseAll = () => {
    setExpandedIndustries(new Set());
    setExpandedDomainGroups(new Set());
    setExpandedCategories(new Set());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Excel Data Structure Preview
          {processingResult.validRows > 0 && (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Ready to Import
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Complete hierarchy structure from your Excel file - this will be integrated with existing master data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Processing Statistics */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{processingResult.totalRows}</div>
              <div className="text-sm text-blue-700">Total Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{processingResult.validRows}</div>
              <div className="text-sm text-green-700">Valid Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{Object.keys(hierarchyData).length}</div>
              <div className="text-sm text-muted-foreground">Industry Segments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Object.values(hierarchyData).reduce((sum, dgs) => sum + Object.keys(dgs).length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Domain Groups</div>
            </div>
          </div>
        </div>

        {/* Errors and Warnings */}
        {(processingResult.errors.length > 0 || processingResult.warnings.length > 0) && (
          <div className="space-y-2">
            {processingResult.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-900">Validation Errors</span>
                </div>
                <ul className="text-sm text-red-800 space-y-1">
                  {processingResult.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {processingResult.errors.length > 5 && (
                    <li className="font-medium">...and {processingResult.errors.length - 5} more errors</li>
                  )}
                </ul>
              </div>
            )}
            
            {processingResult.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Warnings</span>
                </div>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {processingResult.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tree Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Collapse All
            </Button>
          </div>
          {processingResult.validRows > 0 && (
            <Button onClick={onIntegrateToMasterData} className="bg-green-600 hover:bg-green-700">
              <FolderTree className="w-4 h-4 mr-2" />
              Integrate to Master Data
            </Button>
          )}
        </div>

        {/* Tree Structure */}
        <div className="space-y-4">
          {Object.entries(hierarchyData).map(([industrySegment, domainGroups]) => (
            <div key={industrySegment} className="border rounded-lg">
              <Collapsible 
                open={expandedIndustries.has(industrySegment)}
                onOpenChange={() => toggleIndustryExpansion(industrySegment)}
              >
                <CollapsibleTrigger className="w-full p-4 text-left hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-lg">{industrySegment}</h4>
                        <p className="text-sm text-muted-foreground">
                          {Object.keys(domainGroups).length} domain groups
                        </p>
                      </div>
                    </div>
                    {expandedIndustries.has(industrySegment) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="px-4 pb-4">
                  <div className="space-y-3 ml-6">
                    {Object.entries(domainGroups).map(([domainGroup, categories]) => {
                      const dgKey = `${industrySegment}_${domainGroup}`;
                      return (
                        <div key={domainGroup} className="border-l-2 border-blue-200 pl-4">
                          <Collapsible
                            open={expandedDomainGroups.has(dgKey)}
                            onOpenChange={() => toggleDomainGroupExpansion(dgKey)}
                          >
                            <CollapsibleTrigger className="w-full text-left p-2 hover:bg-gray-50 rounded">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-primary" />
                                  <span className="font-medium">{domainGroup}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {Object.keys(categories).length} categories
                                  </Badge>
                                </div>
                                {expandedDomainGroups.has(dgKey) ? (
                                  <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <ChevronRight className="w-3 h-3" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent className="mt-2">
                              <div className="space-y-2 ml-6">
                                {Object.entries(categories).map(([category, subCategories]) => {
                                  const catKey = `${dgKey}_${category}`;
                                  return (
                                    <div key={category} className="border-l-2 border-primary/20 pl-4">
                                      <Collapsible
                                        open={expandedCategories.has(catKey)}
                                        onOpenChange={() => toggleCategoryExpansion(catKey)}
                                      >
                                        <CollapsibleTrigger className="w-full text-left p-2 hover:bg-gray-50 rounded">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <Target className="w-3 h-3 text-primary" />
                                              <span className="text-sm font-medium">{category}</span>
                                              <Badge variant="secondary" className="text-xs">
                                                {subCategories.length} sub-categories
                                              </Badge>
                                            </div>
                                            {expandedCategories.has(catKey) ? (
                                              <ChevronDown className="w-3 h-3" />
                                            ) : (
                                              <ChevronRight className="w-3 h-3" />
                                            )}
                                          </div>
                                        </CollapsibleTrigger>
                                        
                                        <CollapsibleContent className="mt-2">
                                          <div className="grid gap-1 ml-4">
                                            {subCategories.map((subCategory, index) => (
                                              <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                                                <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium shrink-0">
                                                  {index + 1}
                                                </span>
                                                <span>{subCategory}</span>
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelTreeStructureDisplay;
