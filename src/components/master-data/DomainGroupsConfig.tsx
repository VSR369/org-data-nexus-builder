
import React, { useState, useEffect, useRef } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domain-groups/domainGroupsDataManager';
import DomainGroupForm from './domain-groups/DomainGroupForm';
import ManualEntryWizard from './domain-groups/wizard/ManualEntryWizard';
import CombinedHierarchyDisplay from './domain-groups/CombinedHierarchyDisplay';
import DomainGroupsHeader from './domain-groups/DomainGroupsHeader';
import DataEntryTabs from './domain-groups/DataEntryTabs';

const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>(defaultDomainGroupsData);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [newlyCreatedIds, setNewlyCreatedIds] = useState<Set<string>>(new Set());
  
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
    setShowManualEntry(true);
  };

  if (showManualEntry) {
    return (
      <div className="space-y-6">
        <ManualEntryWizard
          data={data}
          onDataUpdate={handleDataUpdate}
          onCancel={() => setShowManualEntry(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DomainGroupsHeader 
        onStartManualEntry={handleStartManualEntry}
        onScrollToDataEntry={scrollToDataEntry}
      />

      {/* Display existing hierarchies first */}
      <CombinedHierarchyDisplay 
        data={data} 
        expandedGroups={expandedGroups}
        expandedCategories={expandedCategories}
        newlyCreatedIds={newlyCreatedIds}
        onToggleGroupExpansion={handleToggleGroupExpansion}
        onToggleCategoryExpansion={handleToggleCategoryExpansion}
        onDataUpdate={handleDataUpdate}
      />

      {/* Data Entry Section */}
      <div ref={dataEntryRef} className="scroll-mt-6">
        <DataEntryTabs onStartManualEntry={handleStartManualEntry} />
        <DomainGroupForm data={data} onDataUpdate={handleDataUpdate} />
      </div>
    </div>
  );
};

export default DomainGroupsConfig;
