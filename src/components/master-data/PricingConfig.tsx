
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { organizationTypesDataManager } from '@/utils/sharedDataManagers';
import { PricingConfig as PricingConfigType } from './pricing/types';
import GeneralConfigForm from './pricing/GeneralConfigForm';
import InternalPaasPricingManager from './pricing/InternalPaasPricingManager';
import ExistingConfigsList from './pricing/ExistingConfigsList';

const PricingConfig = () => {
  const [configs, setConfigs] = useState<PricingConfigType[]>([
    {
      id: '1',
      organizationType: 'All Organizations',
      marketplaceFee: 30,
      aggregatorFee: 15,
      marketplacePlusAggregatorFee: 45,
      internalPaasPricing: [
        { id: '1', country: 'India', currency: 'INR', quarterlyPrice: 50000, halfYearlyPrice: 90000, annualPrice: 150000 },
        { id: '2', country: 'United States of America', currency: 'USD', quarterlyPrice: 600, halfYearlyPrice: 1080, annualPrice: 1800 },
      ],
      version: 1,
      createdAt: '2024-01-01',
    },
  ]);

  const [currentConfig, setCurrentConfig] = useState<Partial<PricingConfigType>>({
    organizationType: 'All Organizations',
    marketplaceFee: 30,
    aggregatorFee: 15,
    marketplacePlusAggregatorFee: 45,
    internalPaasPricing: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);

  const { toast } = useToast();

  // Load organization types from master data
  useEffect(() => {
    console.log('🔄 PricingConfig: Loading organization types from master data...');
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    console.log('✅ PricingConfig: Loaded organization types:', loadedOrgTypes);
    setOrganizationTypes(loadedOrgTypes);
  }, []);

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentConfig.organizationType) {
      toast({
        title: "Error",
        description: "Please select an organization type.",
        variant: "destructive",
      });
      return;
    }

    // Log the current configuration being saved
    console.log('💾 Saving pricing configuration:', currentConfig);

    if (isEditing && currentConfig.id) {
      setConfigs(prev => prev.map(item => 
        item.id === currentConfig.id 
          ? { ...currentConfig as PricingConfigType, version: item.version + 1 }
          : item
      ));
      toast({
        title: "Success",
        description: "Pricing configuration updated successfully.",
      });
    } else {
      const newConfig = {
        ...currentConfig,
        id: Date.now().toString(),
        version: 1,
        createdAt: new Date().toISOString().split('T')[0],
      } as PricingConfigType;
      
      console.log('✅ Created new configuration:', newConfig);
      setConfigs(prev => [...prev, newConfig]);
      toast({
        title: "Success",
        description: "Pricing configuration created successfully.",
      });
    }

    resetForm();
  };

  const handleEdit = (config: PricingConfigType) => {
    console.log('✏️ Editing configuration:', config);
    setCurrentConfig(config);
    setIsEditing(true);
    setActiveTab('general');
  };

  const handleDelete = (id: string) => {
    setConfigs(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Pricing configuration deleted successfully.",
    });
  };

  const resetForm = () => {
    setCurrentConfig({
      organizationType: 'All Organizations',
      marketplaceFee: 30,
      aggregatorFee: 15,
      marketplacePlusAggregatorFee: 45,
      internalPaasPricing: [],
    });
    setIsEditing(false);
    setActiveTab('general');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {isEditing ? 'Edit Pricing Configuration' : 'Add New Pricing Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b">
            {['general', 'platform-as-service'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'general' && 'General Config'}
                {tab === 'platform-as-service' && 'Platform as a Service'}
              </button>
            ))}
          </div>

          <form onSubmit={handleConfigSubmit}>
            {activeTab === 'general' && (
              <GeneralConfigForm
                currentConfig={currentConfig}
                setCurrentConfig={setCurrentConfig}
                organizationTypes={organizationTypes}
              />
            )}

            {activeTab === 'platform-as-service' && (
              <InternalPaasPricingManager
                currentConfig={currentConfig}
                setCurrentConfig={setCurrentConfig}
              />
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit">
                {isEditing ? 'Update' : 'Create'} Configuration
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <ExistingConfigsList
        configs={configs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PricingConfig;
