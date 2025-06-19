
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Settings, Globe, Users, TrendingUp } from 'lucide-react';
import { PricingConfig as PricingConfigType } from '@/types/pricing';
import GeneralConfigForm from './pricing/GeneralConfigForm';
import ExistingConfigsList from './pricing/ExistingConfigsList';
import InternalPaasPricingManager from './pricing/InternalPaasPricingManager';
import { organizationTypesDataManager } from '@/utils/sharedDataManagers';
import { PricingDataManager } from '@/utils/pricingDataManager';

const PricingConfig = () => {
  const [configs, setConfigs] = useState<PricingConfigType[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [currentGeneralConfig, setCurrentGeneralConfig] = useState<Partial<PricingConfigType>>({});

  // Load data on component mount
  useEffect(() => {
    console.log('🔄 PricingConfig: Loading comprehensive pricing data...');
    
    // Load pricing configurations
    const loadedConfigs = PricingDataManager.getAllConfigurations();
    setConfigs(loadedConfigs);
    
    // Load organization types
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    setOrganizationTypes(loadedOrgTypes);
    
    console.log('✅ PricingConfig: Comprehensive pricing data loaded');
  }, []);

  // Save configurations whenever they change
  useEffect(() => {
    if (configs.length >= 0) {
      console.log('💾 PricingConfig: Saving configurations to persistent storage');
      PricingDataManager.saveConfigurations(configs);
    }
  }, [configs]);

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Comprehensive Pricing Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Manage all pricing models, engagement fees, PaaS pricing, and discount structures
        </p>
      </div>

      <Tabs defaultValue="general-config" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general-config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General Config
          </TabsTrigger>
          <TabsTrigger value="engagement-pricing" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Engagement Models
          </TabsTrigger>
          <TabsTrigger value="paas-pricing" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            PaaS Pricing
          </TabsTrigger>
          <TabsTrigger value="discount-management" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Discounts
          </TabsTrigger>
          <TabsTrigger value="saved-configs" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Saved Configs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general-config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Pricing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GeneralConfigForm
                currentConfig={currentGeneralConfig}
                setCurrentConfig={setCurrentGeneralConfig}
                organizationTypes={organizationTypes}
                configs={configs}
                setConfigs={setConfigs}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement-pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Engagement Model Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Direct Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Quarterly:</span>
                          <span className="font-medium">$2,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Half-yearly:</span>
                          <span className="font-medium">$4,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Annual:</span>
                          <span className="font-medium">$8,000</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Marketplace</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Quarterly:</span>
                          <span className="font-medium">$1,800</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Half-yearly:</span>
                          <span className="font-medium">$3,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Annual:</span>
                          <span className="font-medium">$5,500</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Aggregator</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Quarterly:</span>
                          <span className="font-medium">$1,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Half-yearly:</span>
                          <span className="font-medium">$2,100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Annual:</span>
                          <span className="font-medium">$3,800</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paas-pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Platform-as-a-Service Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InternalPaasPricingManager
                configs={configs}
                setConfigs={setConfigs}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discount-management">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Discount Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Membership Discounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active Members:</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Premium Members:</span>
                        <span className="font-medium">25%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Volume Discounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Bulk Purchase:</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Enterprise:</span>
                        <span className="font-medium">20%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Seasonal Offers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Early Bird:</span>
                        <span className="font-medium">12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Year End:</span>
                        <span className="font-medium">18%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved-configs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Saved Pricing Configurations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExistingConfigsList
                configs={configs}
                setConfigs={setConfigs}
                setCurrentConfig={setCurrentGeneralConfig}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingConfig;
