
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from '../domainGroupsDataManager';
import EmptyStateDisplay from './EmptyStateDisplay';
import IndustrySegmentCard from './IndustrySegmentCard';
import SummaryFooter from './SummaryFooter';

interface ManualDataEntryProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const ManualDataEntry: React.FC<ManualDataEntryProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  const [data, setData] = useState<DomainGroupsData>({
    domainGroups: [],
    categories: [],
    subCategories: []
  });

  useEffect(() => {
    // Load existing domain groups data
    const loadData = async () => {
      const loadedData = await domainGroupsDataManager.loadData();
      setData(loadedData);
      console.log('ManualDataEntry: Loaded existing data:', loadedData);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    // Validate - mark as valid if there's existing data to display
    const hasData = data.domainGroups.length > 0;
    console.log('ManualDataEntry: Validation - has data:', hasData);
    onValidationChange(hasData);
    
    // Update wizard data to indicate we're viewing existing data
    onUpdate({ 
      existingDataViewed: true,
      hasExistingData: hasData 
    });
  }, [data, onUpdate, onValidationChange]);

  // Group hierarchical data by industry segment
  const getGroupedHierarchicalData = () => {
    const hierarchicalData = data.domainGroups.map(domainGroup => {
      const categories = data.categories.filter(cat => cat.domain_group_id === domainGroup.id);
      return {
        ...domainGroup,
        categories: categories.map(category => ({
          ...category,
          subCategories: data.subCategories.filter(sub => sub.category_id === category.id)
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
    return <EmptyStateDisplay />;
  }

  const totalHierarchies = Object.values(groupedData).flat().length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="w-5 h-5" />
            Configured Domain Group Hierarchies
          </CardTitle>
          <CardDescription>
            View existing configured hierarchies organized by industry segment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedData).map(([industrySegment, domainGroups]) => (
              <IndustrySegmentCard 
                key={industrySegment}
                industrySegment={industrySegment}
                domainGroups={domainGroups}
              />
            ))}
          </div>

          <SummaryFooter totalHierarchies={totalHierarchies} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualDataEntry;
