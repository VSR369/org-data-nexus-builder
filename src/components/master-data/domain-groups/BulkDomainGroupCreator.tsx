import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { createLifeSciencesHierarchyData } from './lifeSciencesHierarchyData';
import { domainGroupsDataManager } from './domainGroupsDataManager';
import DebugPanel from './DebugPanel';
import HierarchyDisplay from './HierarchyDisplay';
import ActionsSection from './ActionsSection';
import DevelopmentInfo from './DevelopmentInfo';

interface BulkDomainGroupCreatorProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
  onShowDataEntry?: () => void;
}

const BulkDomainGroupCreator: React.FC<BulkDomainGroupCreatorProps> = ({ 
  data, 
  onDataUpdate,
  onShowDataEntry 
}) => {
  const [forceRefresh, setForceRefresh] = useState(0);
  const [hierarchyExists, setHierarchyExists] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Enhanced debugging effect
  useEffect(() => {
    console.log('🔄 BulkDomainGroupCreator: useEffect triggered');
    console.log('📊 BulkDomainGroupCreator: Current data prop:', data);
    
    // Check localStorage directly
    const storedData = localStorage.getItem('master_data_domain_groups');
    console.log('💾 Direct localStorage check:', storedData);
    
    // Check if data manager has data
    const managerHasData = domainGroupsDataManager.hasData();
    console.log('🔍 Data manager hasData():', managerHasData);
    
    // Load fresh data from manager
    const freshData = domainGroupsDataManager.loadData();
    console.log('🆕 Fresh data from manager:', freshData);
    
    // Check all localStorage keys
    const allKeys = Object.keys(localStorage);
    const relevantKeys = allKeys.filter(key => key.includes('domain') || key.includes('group'));
    console.log('🗝️ All relevant localStorage keys:', relevantKeys);
    relevantKeys.forEach(key => {
      console.log(`📋 ${key}:`, localStorage.getItem(key));
    });

    const exists = data.domainGroups && data.domainGroups.length > 0;
    setHierarchyExists(exists);
    
    // Store debug info for display
    setDebugInfo({
      propData: data,
      storedRaw: storedData,
      managerHasData,
      freshData,
      relevantKeys,
      hierarchyExists: exists
    });
    
    console.log('📊 BulkDomainGroupCreator: Hierarchy existence result:', exists);
  }, [data, forceRefresh]);

  // Test data loading button
  const handleTestDataLoad = () => {
    console.log('🧪 Testing data load...');
    
    // Force reload from localStorage
    const testData = domainGroupsDataManager.loadData();
    console.log('🧪 Test load result:', testData);
    
    // Update parent component
    onDataUpdate(testData);
    setForceRefresh(prev => prev + 1);
  };

  // Clear all data button for testing
  const handleClearAllData = () => {
    console.log('🗑️ Clearing all domain groups data...');
    domainGroupsDataManager.clearData();
    
    const emptyData: DomainGroupsData = {
      domainGroups: [],
      categories: [],
      subCategories: []
    };
    
    onDataUpdate(emptyData);
    setForceRefresh(prev => prev + 1);
  };

  const handleCreateLifeSciencesHierarchy = async () => {
    setIsCreating(true);
    console.log('🚀 Creating Life Sciences hierarchy...');
    
    try {
      const { newDomainGroups, newCategories, newSubCategories } = createLifeSciencesHierarchyData();
      
      const updatedData: DomainGroupsData = {
        domainGroups: [...(data.domainGroups || []), ...newDomainGroups],
        categories: [...(data.categories || []), ...newCategories],
        subCategories: [...(data.subCategories || []), ...newSubCategories]
      };
      
      console.log('✅ Life Sciences hierarchy created:', {
        newDomainGroups: newDomainGroups.length,
        newCategories: newCategories.length,
        newSubCategories: newSubCategories.length,
        totalDomainGroups: updatedData.domainGroups.length,
        totalCategories: updatedData.categories.length,
        totalSubCategories: updatedData.subCategories.length
      });
      
      // Save the data using the data manager
      domainGroupsDataManager.saveData(updatedData);
      console.log('💾 Data saved to localStorage');
      
      // Verify save
      const verificationData = domainGroupsDataManager.loadData();
      console.log('🔍 Verification load after save:', verificationData);
      
      onDataUpdate(updatedData);
      setForceRefresh(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error creating Life Sciences hierarchy:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const hasData = data.domainGroups && data.domainGroups.length > 0;

  console.log('🎯 BulkDomainGroupCreator: Render decision:', {
    hierarchyExists,
    hasData,
    dataHasDomainGroups: data.domainGroups?.length > 0
  });

  return (
    <div className="space-y-6">
      {/* Debug Panel */}
      <DebugPanel
        data={data}
        debugInfo={debugInfo}
        hasData={!!hasData}
        hierarchyExists={hierarchyExists}
        onTestDataLoad={handleTestDataLoad}
        onClearAllData={handleClearAllData}
      />

      {/* Existing Hierarchies Display */}
      {hasData && (
        <HierarchyDisplay
          data={data}
          expandedGroups={expandedGroups}
          expandedCategories={expandedCategories}
          onToggleGroupExpansion={toggleGroupExpansion}
          onToggleCategoryExpansion={toggleCategoryExpansion}
        />
      )}

      {/* Action Buttons */}
      <ActionsSection
        hasData={!!hasData}
        isCreating={isCreating}
        onShowDataEntry={onShowDataEntry}
        onCreateLifeSciencesHierarchy={handleCreateLifeSciencesHierarchy}
      />

      {/* Debug Information */}
      <DevelopmentInfo
        data={data}
        hierarchyExists={hierarchyExists}
        hasData={!!hasData}
      />
    </div>
  );
};

export default BulkDomainGroupCreator;
