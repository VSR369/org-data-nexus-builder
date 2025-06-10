
import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domain-groups/domainGroupsDataManager';
import DomainGroupForm from './domain-groups/DomainGroupForm';
import DomainGroupDisplay from './domain-groups/DomainGroupDisplay';
import BulkDomainGroupCreator from './domain-groups/BulkDomainGroupCreator';

const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>(defaultDomainGroupsData);

  // Load data on component mount
  useEffect(() => {
    console.log('=== DomainGroupsConfig: Loading data ===');
    const loadedData = domainGroupsDataManager.loadData();
    
    console.log('📊 Loaded domain groups data:', loadedData);
    setData(loadedData);
  }, []);

  const handleDataUpdate = (newData: DomainGroupsData) => {
    console.log('🔄 DomainGroupsConfig: Updating data:', newData);
    console.log('📊 New data structure:', {
      domainGroups: newData.domainGroups?.length || 0,
      categories: newData.categories?.length || 0,
      subCategories: newData.subCategories?.length || 0
    });
    
    // Save the data through the data manager
    domainGroupsDataManager.saveData(newData);
    
    // Update local state
    setData(newData);
    
    console.log('✅ Domain groups data saved and state updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add Domain Group Details</h1>
          <p className="text-muted-foreground">Create complete domain group hierarchy</p>
        </div>
      </div>

      <BulkDomainGroupCreator data={data} onDataUpdate={handleDataUpdate} />
      <DomainGroupForm data={data} onDataUpdate={handleDataUpdate} />
      <DomainGroupDisplay data={data} onDataUpdate={handleDataUpdate} />
    </div>
  );
};

export default DomainGroupsConfig;
