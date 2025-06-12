
import React, { useState, useEffect } from 'react';
import { WizardData } from '@/types/wizardTypes';
import { IndustrySegment } from '@/types/industrySegments';
import { industrySegmentDataManager } from '../industrySegmentDataManager';
import { domainGroupsDataManager } from '../domainGroupsDataManager';
import { DomainGroupsData, DomainGroup } from '@/types/domainGroups';
import DomainGroupForm from './DomainGroupForm';
import HierarchyDisplay from './HierarchyDisplay';
import ExistingDataTreeView from './ExistingDataTreeView';

interface DomainGroupSetupProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const DomainGroupSetup: React.FC<DomainGroupSetupProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [existingData, setExistingData] = useState<DomainGroupsData>({ domainGroups: [], categories: [], subCategories: [] });

  // Get values from wizardData or use empty strings as defaults
  const domainGroupName = wizardData.selectedDomainGroup || '';

  useEffect(() => {
    // Load industry segments and existing domain groups
    const industryData = industrySegmentDataManager.loadData();
    const domainData = domainGroupsDataManager.loadData();
    
    setIndustrySegments(industryData.industrySegments || []);
    setExistingData(domainData);
  }, []);

  useEffect(() => {
    // Validate inputs - require industry segment and domain group name
    const isValid = wizardData.selectedIndustrySegment && domainGroupName.trim().length > 0;
    console.log('DomainGroupSetup: Validation:', { 
      selectedIndustrySegment: wizardData.selectedIndustrySegment, 
      domainGroupName, 
      isValid 
    });
    
    onValidationChange(isValid);
  }, [wizardData.selectedIndustrySegment, domainGroupName, onValidationChange]);

  const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);

  // Transform domain groups data to include nested categories and subcategories
  const enhancedDomainGroups: DomainGroup[] = existingData.domainGroups.map(dg => {
    const domainCategories = existingData.categories.filter(cat => cat.domainGroupId === dg.id);
    
    return {
      ...dg,
      categories: domainCategories.map(cat => ({
        ...cat,
        subCategories: existingData.subCategories.filter(sub => sub.categoryId === cat.id)
      }))
    };
  });

  // Group enhanced domain groups by industry segment
  const groupedDomainGroups = enhancedDomainGroups.reduce((acc, dg) => {
    const segment = industrySegments.find(is => is.id === dg.industrySegmentId);
    if (segment) {
      if (!acc[segment.industrySegment]) {
        acc[segment.industrySegment] = [];
      }
      acc[segment.industrySegment].push(dg);
    }
    return acc;
  }, {} as Record<string, DomainGroup[]>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Domain Group Setup</h2>
        <p className="text-muted-foreground">
          Configure the industry segment and domain group for your hierarchy
        </p>
        
        <HierarchyDisplay 
          selectedSegment={selectedSegment}
          domainGroupName={domainGroupName}
        />
      </div>

      <DomainGroupForm
        wizardData={wizardData}
        industrySegments={industrySegments}
        onUpdate={onUpdate}
      />

      <ExistingDataTreeView
        industrySegments={industrySegments}
        groupedDomainGroups={groupedDomainGroups}
      />
    </div>
  );
};

export default DomainGroupSetup;
