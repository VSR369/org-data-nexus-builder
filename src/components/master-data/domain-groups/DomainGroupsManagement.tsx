
import React from 'react';
import { DomainGroup, IndustrySegment } from './types';
import { IndustrySegmentSelector } from './components/IndustrySegmentSelector';
import { DomainGroupHierarchy } from './components/DomainGroupHierarchy';

interface DomainGroupsManagementProps {
  industrySegments: IndustrySegment[];
  selectedIndustrySegment: string;
  onSelectIndustrySegment: (segmentId: string) => void;
  domainGroups: DomainGroup[];
  selectedDomainGroup: string;
  onSelectDomainGroup: (groupId: string) => void;
  onAddDomainGroup: (group: Omit<DomainGroup, 'id' | 'createdAt'>) => void;
  onUpdateDomainGroup: (id: string, updates: Partial<DomainGroup>) => void;
  onDeleteDomainGroup: (id: string) => void;
  showMessage: (message: string) => void;
}

export const DomainGroupsManagement: React.FC<DomainGroupsManagementProps> = ({
  industrySegments,
  selectedIndustrySegment,
  onSelectIndustrySegment,
  domainGroups,
  showMessage
}) => {
  const selectedSegmentInfo = industrySegments.find(s => s.id === selectedIndustrySegment);

  return (
    <div className="space-y-6">
      <IndustrySegmentSelector
        industrySegments={industrySegments}
        selectedIndustrySegment={selectedIndustrySegment}
        onSelectIndustrySegment={onSelectIndustrySegment}
      />

      {selectedIndustrySegment && (
        <DomainGroupHierarchy
          domainGroups={domainGroups}
          selectedSegmentInfo={selectedSegmentInfo}
        />
      )}
    </div>
  );
};
