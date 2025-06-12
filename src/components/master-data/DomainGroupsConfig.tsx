
import React, { useState, useEffect, useRef } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domain-groups/domainGroupsDataManager';
import DomainGroupForm from './domain-groups/DomainGroupForm';
import CombinedHierarchyDisplay from './domain-groups/CombinedHierarchyDisplay';
import DomainGroupsHeader from './domain-groups/DomainGroupsHeader';
import ManualEntryWizard from './domain-groups/wizard/ManualEntryWizard';

const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>(defaultDomainGroupsData);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [newlyCreatedIds, setNewlyCreatedIds] = useState<Set<string>>(new Set());
  const [showWizard, setShowWizard] = useState(false);
  
  // Ref for scrolling to data entry section
  const dataEntryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadedData = domainGroupsDataManager.loadData();
    setData(loadedData);
  }, []);

  const handleDataUpdate = (newData: DomainGroupsData) => {
    // Identify newly created domain groups
    const existingIds = new Set(data.domainGroups.map(dg => dg.id));
    const newIds = new Set(
      newData.domainGroups
        .filter(dg => !existingIds.has(dg.id))
        .map(dg => dg.id)
    );
    
    setNewlyCreatedIds(newIds);
    setData(newData);
    
    // Clear the "new" indicators after 10 seconds
    if (newIds.size > 0) {
      setTimeout(() => {
        setNewlyCreatedIds(new Set());
      }, 10000);
    }
  };

  const handleToggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleToggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const scrollToDataEntry = () => {
    dataEntryRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleStartManualEntry = () => {
    // No-op since manual entry is removed
  };

  const handleOpenWizard = () => {
    setShowWizard(true);
  };

  const handleCloseWizard = () => {
    setShowWizard(false);
  };

  const handleUploadExcel = () => {
    console.log('Upload Excel functionality to be implemented');
    // TODO: Implement Excel upload functionality
  };

  // If wizard is open, show only the wizard
  if (showWizard) {
    return (
      <div className="space-y-6">
        <ManualEntryWizard 
          data={data}
          onDataUpdate={handleDataUpdate}
          onCancel={handleCloseWizard}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DomainGroupsHeader 
        onStartManualEntry={handleStartManualEntry}
        onScrollToDataEntry={scrollToDataEntry}
        onOpenWizard={handleOpenWizard}
        onUploadExcel={handleUploadExcel}
      />

      {/* Display existing hierarchies */}
      <CombinedHierarchyDisplay 
        data={data} 
        expandedGroups={expandedGroups}
        expandedCategories={expandedCategories}
        newlyCreatedIds={newlyCreatedIds}
        onToggleGroupExpansion={handleToggleGroupExpansion}
        onToggleCategoryExpansion={handleToggleCategoryExpansion}
        onDataUpdate={handleDataUpdate}
      />

      {/* Data Entry Section - simplified to only show the form */}
      <div ref={dataEntryRef} className="scroll-mt-6">
        <DomainGroupForm data={data} onDataUpdate={handleDataUpdate} />
      </div>
    </div>
  );
};

export default DomainGroupsConfig;
