
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet } from 'lucide-react';
import { HierarchyData, SavedExcelDocument, ProcessingResult } from './types';
import ProcessingStats from './components/ProcessingStats';
import TreeControls from './components/TreeControls';
import HierarchyTree from './components/HierarchyTree';

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
        </CardTitle>
        <CardDescription>
          Complete hierarchy structure from your Excel file - this will be integrated with existing master data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProcessingStats 
          processingResult={processingResult}
          hierarchyData={hierarchyData}
        />

        <TreeControls
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          onIntegrateToMasterData={onIntegrateToMasterData}
          canIntegrate={processingResult.validRows > 0}
        />

        <HierarchyTree
          hierarchyData={hierarchyData}
          expandedIndustries={expandedIndustries}
          expandedDomainGroups={expandedDomainGroups}
          expandedCategories={expandedCategories}
          onToggleIndustry={toggleIndustryExpansion}
          onToggleDomainGroup={toggleDomainGroupExpansion}
          onToggleCategory={toggleCategoryExpansion}
        />
      </CardContent>
    </Card>
  );
};

export default ExcelTreeStructureDisplay;
