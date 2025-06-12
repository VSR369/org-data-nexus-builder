
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from 'lucide-react';
import { PricingConfig as PricingConfigType } from './pricing/types';
import InternalPaasPricingManager from './pricing/InternalPaasPricingManager';

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Platform as a Service Pricing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InternalPaasPricingManager
            configs={configs}
            setConfigs={setConfigs}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingConfig;
