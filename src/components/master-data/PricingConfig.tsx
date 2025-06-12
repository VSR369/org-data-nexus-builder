
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign } from 'lucide-react';
import { PricingConfig as PricingConfigType } from './pricing/types';
import InternalPaasPricingManager from './pricing/InternalPaasPricingManager';
import GeneralConfigForm from './pricing/GeneralConfigForm';
import { organizationTypesDataManager } from '@/utils/sharedDataManagers';

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

  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [currentGeneralConfig, setCurrentGeneralConfig] = useState<Partial<PricingConfigType>>({});

  useEffect(() => {
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    setOrganizationTypes(loadedOrgTypes);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general-config" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general-config">General Config</TabsTrigger>
              <TabsTrigger value="paas-pricing">Platform as a Service</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general-config" className="space-y-4">
              <GeneralConfigForm
                currentConfig={currentGeneralConfig}
                setCurrentConfig={setCurrentGeneralConfig}
                organizationTypes={organizationTypes}
              />
            </TabsContent>
            
            <TabsContent value="paas-pricing" className="space-y-4">
              <InternalPaasPricingManager
                configs={configs}
                setConfigs={setConfigs}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingConfig;
