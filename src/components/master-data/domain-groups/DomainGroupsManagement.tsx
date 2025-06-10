
import React from 'react';
import { IndustrySegmentTab } from './IndustrySegmentTab';
import { DomainGroupTab } from './DomainGroupTab';
import { DomainGroup, IndustrySegment } from './types';

interface DomainGroupsManagementProps {
  industrySegments: IndustrySegment[];
  selectedIndustrySegment: string;
  onSelectIndustrySegment: (id: string) => void;
  domainGroups: DomainGroup[];
  selectedDomainGroup: string;
  onSelectDomainGroup: (id: string) => void;
  onAddDomainGroup: (group: Omit<DomainGroup, 'id' | 'createdAt' | 'categories'>) => void;
  onUpdateDomainGroup: (id: string, updates: Partial<DomainGroup>) => void;
  onDeleteDomainGroup: (id: string) => void;
  showMessage: (message: string) => void;
}

export const DomainGroupsManagement: React.FC<DomainGroupsManagementProps> = ({
  industrySegments,
  selectedIndustrySegment,
  onSelectIndustrySegment,
  domainGroups,
  selectedDomainGroup,
  onSelectDomainGroup,
  onAddDomainGroup,
  onUpdateDomainGroup,
  onDeleteDomainGroup,
  showMessage
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <IndustrySegmentTab
        industrySegments={industrySegments}
        selectedIndustrySegment={selectedIndustrySegment}
        onSelectIndustrySegment={onSelectIndustrySegment}
        showMessage={showMessage}
      />
      
      <DomainGroupTab
        selectedIndustrySegment={selectedIndustrySegment}
        domainGroups={domainGroups}
        selectedDomainGroup={selectedDomainGroup}
        onSelectDomainGroup={onSelectDomainGroup}
        onAddDomainGroup={onAddDomainGroup}
        onUpdateDomainGroup={onUpdateDomainGroup}
        onDeleteDomainGroup={onDeleteDomainGroup}
        showMessage={showMessage}
      />
    </div>
  );
};
