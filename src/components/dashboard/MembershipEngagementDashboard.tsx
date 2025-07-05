import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PricingDataManager } from '@/utils/pricingDataManager';
import { PricingConfig } from '@/types/pricing';

interface MembershipEngagementDashboardProps {
  organizationType: string;
  entityType: string;
  country: string;
  membershipStatus?: 'active' | 'inactive' | 'not-a-member';
}

interface PricingPlan {
  id: string;
  name: string;
  duration: string;
  description: string;
  price?: number;
  currency?: string;
}

interface EngagementModel {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

const MembershipEngagementDashboard: React.FC<MembershipEngagementDashboardProps> = ({
  organizationType,
  entityType,
  country,
  membershipStatus = 'not-a-member'
}) => {
  // State for selections
  const [selectedMembershipPlan, setSelectedMembershipPlan] = useState<string>('');
  const [selectedEngagementModel, setSelectedEngagementModel] = useState<string>('');
  const [selectedPricingFrequency, setSelectedPricingFrequency] = useState<string>('halfyearly');
  
  // State for pricing data
  const [pricingConfigs, setPricingConfigs] = useState<PricingConfig[]>([]);
  const [currentPricing, setCurrentPricing] = useState<PricingConfig | null>(null);
  const [countryPricingConfigs, setCountryPricingConfigs] = useState<PricingConfig[]>([]);

  // Load localStorage data and pricing configurations on mount
  useEffect(() => {
    const savedMembershipPlan = localStorage.getItem('selectedMembershipPlan');
    const savedEngagementModel = localStorage.getItem('selectedEngagementModel');
    const savedPricingFrequency = localStorage.getItem('selectedPricingFrequency');

    if (savedMembershipPlan) setSelectedMembershipPlan(savedMembershipPlan);
    if (savedEngagementModel) setSelectedEngagementModel(savedEngagementModel);
    if (savedPricingFrequency) setSelectedPricingFrequency(savedPricingFrequency);

    // Load all pricing configurations
    const allConfigs = PricingDataManager.getAllConfigurations();
    setPricingConfigs(allConfigs);
    
    // Load country-specific pricing configurations
    const countryConfigs = PricingDataManager.getPricingForCountry(country, organizationType, entityType);
    setCountryPricingConfigs(countryConfigs);
    
    console.log('🔍 Loading pricing for:', { country, organizationType, entityType });
    console.log('📊 Found configurations:', countryConfigs.length);
    
    // Set initial engagement model pricing if saved engagement model exists
    if (savedEngagementModel) {
      const pricing = PricingDataManager.getPricingForCountryOrgTypeAndEngagement(
        country, 
        organizationType, 
        savedEngagementModel
      );
      setCurrentPricing(pricing);
      console.log('💰 Initial pricing loaded:', pricing);
    }
  }, [country, organizationType, entityType]);

  // Update localStorage when selections change
  useEffect(() => {
    if (selectedMembershipPlan) {
      localStorage.setItem('selectedMembershipPlan', selectedMembershipPlan);
    }
  }, [selectedMembershipPlan]);

  useEffect(() => {
    if (selectedEngagementModel) {
      localStorage.setItem('selectedEngagementModel', selectedEngagementModel);
      
      // Update pricing based on engagement model selection
      const pricing = PricingDataManager.getPricingForCountryOrgTypeAndEngagement(
        country, 
        organizationType, 
        selectedEngagementModel
      );
      setCurrentPricing(pricing);
    }
  }, [selectedEngagementModel, country, organizationType]);

  useEffect(() => {
    if (selectedPricingFrequency) {
      localStorage.setItem('selectedPricingFrequency', selectedPricingFrequency);
    }
  }, [selectedPricingFrequency]);

  // Calculate price based on membership status and apply discounts
  const calculatePrice = (basePrice: number): number => {
    if (!basePrice) return 0;
    
    // Apply member discount if applicable
    const memberDiscount = membershipStatus === 'active' ? 0.8 : 1; // 20% discount for active members
    return Math.round(basePrice * memberDiscount);
  };

  // Get formatted currency
  const formatCurrency = (amount: number, currency: string = 'INR'): string => {
    if (currency === 'INR') {
      return `INR ${amount}`;
    }
    return `${currency} ${amount}`;
  };

  // Get membership plans with dynamic pricing from master data
  const getMembershipPlans = (): PricingPlan[] => {
    // If no engagement model selected, try to get general pricing for the country/org type
    let pricingConfig = currentPricing;
    
    if (!pricingConfig && countryPricingConfigs.length > 0) {
      // Use the first available config for this country/org type
      pricingConfig = countryPricingConfigs[0];
      console.log('📋 Using first available config for membership plans:', pricingConfig);
    }
    
    if (!pricingConfig) {
      console.log('⚠️ No pricing configuration found for membership plans');
      return [];
    }

    return [
      {
        id: 'quarterly',
        name: 'Quarterly',
        duration: '3 months',
        description: `${pricingConfig.configName || 'Standard'} - 3 month plan`,
        price: pricingConfig.quarterlyFee,
        currency: pricingConfig.currency || 'INR'
      },
      {
        id: 'halfyearly',
        name: 'Half-Yearly',
        duration: '6 months',
        description: `${pricingConfig.configName || 'Standard'} - 6 month plan`,
        price: pricingConfig.halfYearlyFee,
        currency: pricingConfig.currency || 'INR'
      },
      {
        id: 'annual',
        name: 'Annual',
        duration: '12 months',
        description: `${pricingConfig.configName || 'Standard'} - 12 month plan`,
        price: pricingConfig.annualFee,
        currency: pricingConfig.currency || 'INR'
      }
    ].filter(plan => plan.price && plan.price > 0); // Only show plans with valid pricing
  };

  const membershipPlans = getMembershipPlans();

  // Engagement models data
  const engagementModels: EngagementModel[] = [
    {
      id: 'Market Place',
      name: 'Market Place',
      description: 'A platform where solution seekers and providers connect directly for marketplace transactions',
      tags: ['MSME', 'Commercial']
    },
    {
      id: 'Aggregator',
      name: 'Aggregator',
      description: 'Aggregation services that collect and organize solutions from multiple sources',
      tags: ['MSME', 'Commercial']
    }
  ];

  // Advanced models data
  const advancedModels: EngagementModel[] = [
    {
      id: 'Market Place & Aggregator',
      name: 'Market Place & Aggregator',
      description: 'Combined marketplace and aggregation services for comprehensive solution management',
      tags: ['MSME', 'Commercial']
    },
    {
      id: 'Platform as a Service',
      name: 'Platform as a Service',
      description: 'Complete platform infrastructure and services for solution development and deployment',
      tags: ['MSME', 'Commercial']
    }
  ];

  // Get pricing for display in column 4 with detailed master data lookup
  const getPricingForDisplay = (frequency: string): { price: number; currency: string; configName: string } => {
    if (!selectedEngagementModel) {
      return { price: 0, currency: 'INR', configName: 'No Model Selected' };
    }

    // Get the specific pricing configuration for the selected engagement model
    const engagementPricing = PricingDataManager.getPricingForCountryOrgTypeAndEngagement(
      country, 
      organizationType, 
      selectedEngagementModel
    );

    if (!engagementPricing) {
      console.log('⚠️ No pricing found for engagement model:', selectedEngagementModel);
      return { price: 0, currency: 'INR', configName: 'No Pricing Available' };
    }
    
    let basePrice = 0;
    switch (frequency) {
      case 'quarterly':
        basePrice = engagementPricing.quarterlyFee || 0;
        break;
      case 'halfyearly':
        basePrice = engagementPricing.halfYearlyFee || 0;
        break;
      case 'annual':
        basePrice = engagementPricing.annualFee || 0;
        break;
      default:
        basePrice = engagementPricing.halfYearlyFee || 0;
    }
    
    const finalPrice = calculatePrice(basePrice);
    console.log(`💰 Pricing for ${selectedEngagementModel} (${frequency}):`, {
      basePrice,
      finalPrice,
      membershipDiscount: membershipStatus === 'active' ? '20%' : 'None',
      config: engagementPricing.configName
    });
    
    return { 
      price: finalPrice, 
      currency: engagementPricing.currency || 'INR',
      configName: engagementPricing.configName || selectedEngagementModel
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Organization Dashboard</h1>
        <p className="text-gray-600">Select your membership plan and engagement model</p>
      </div>

      {/* 4-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Column 1: Membership Plans */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Membership Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedMembershipPlan} onValueChange={setSelectedMembershipPlan}>
              <div className="space-y-4">
                {membershipPlans.map((plan) => (
                  <div key={plan.id} className="space-y-2">
                    <Label htmlFor={`membership-${plan.id}`} className="cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={plan.id} id={`membership-${plan.id}`} />
                        <div className="flex-1">
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-gray-500">{plan.duration}</div>
                          {plan.price && (
                            <div className="text-lg font-bold text-blue-600">
                              {formatCurrency(calculatePrice(plan.price), plan.currency)}
                            </div>
                          )}
                          {plan.price && (
                            <div className="text-xs text-gray-400">
                              ~{formatCurrency(Math.round(calculatePrice(plan.price) / (plan.id === 'quarterly' ? 3 : plan.id === 'halfyearly' ? 6 : 12)), plan.currency)}/mo
                            </div>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
                {/* Best Value Badge for Annual */}
                {selectedMembershipPlan === 'annual' && (
                  <Badge className="bg-green-100 text-green-800 text-xs">Best Value</Badge>
                )}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Column 2: Engagement Models */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Engagement Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedEngagementModel} onValueChange={setSelectedEngagementModel}>
              <div className="space-y-6">
                {engagementModels.map((model) => (
                  <div key={model.id}>
                    <Label htmlFor={`engagement-${model.id}`} className="cursor-pointer">
                      <Card className={`border-2 transition-all hover:shadow-sm ${
                        selectedEngagementModel === model.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem 
                              value={model.id} 
                              id={`engagement-${model.id}`}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="font-medium mb-2">{model.name}</div>
                              <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                              <div className="flex gap-2">
                                {model.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Column 3: Advanced Models */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Advanced Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedEngagementModel} onValueChange={setSelectedEngagementModel}>
              <div className="space-y-6">
                {advancedModels.map((model) => (
                  <div key={model.id}>
                    <Label htmlFor={`advanced-${model.id}`} className="cursor-pointer">
                      <Card className={`border-2 transition-all hover:shadow-sm ${
                        selectedEngagementModel === model.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem 
                              value={model.id} 
                              id={`advanced-${model.id}`}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="font-medium mb-2">{model.name}</div>
                              <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                              <div className="flex gap-2">
                                {model.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Column 4: Model Pricing */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Model Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEngagementModel ? (
              <div className="space-y-4">
                {/* Featured pricing - Half-Yearly highlighted */}
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-sm opacity-90 mb-1">{getPricingForDisplay('halfyearly').configName}</div>
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(getPricingForDisplay('halfyearly').price, getPricingForDisplay('halfyearly').currency)}
                    </div>
                    <div className="text-sm opacity-90">Half-Yearly</div>
                    {membershipStatus === 'active' && (
                      <div className="text-xs opacity-75 mt-1">Member Discount Applied</div>
                    )}
                  </CardContent>
                </Card>

                {/* Other pricing options */}
                <RadioGroup value={selectedPricingFrequency} onValueChange={setSelectedPricingFrequency}>
                  <div className="space-y-3">
                    <Label htmlFor="pricing-quarterly" className="cursor-pointer">
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="quarterly" id="pricing-quarterly" />
                          <span className="font-medium">Quarterly</span>
                        </div>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(getPricingForDisplay('quarterly').price, getPricingForDisplay('quarterly').currency)}
                        </span>
                      </div>
                    </Label>

                    <Label htmlFor="pricing-halfyearly" className="cursor-pointer">
                      <div className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 ${
                        selectedPricingFrequency === 'halfyearly' ? 'border-blue-500 bg-blue-50' : ''
                      }`}>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="halfyearly" id="pricing-halfyearly" />
                          <span className="font-medium">Half-Yearly</span>
                        </div>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(getPricingForDisplay('halfyearly').price, getPricingForDisplay('halfyearly').currency)}
                        </span>
                      </div>
                    </Label>

                    <Label htmlFor="pricing-annual" className="cursor-pointer">
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="annual" id="pricing-annual" />
                          <span className="font-medium">Annual</span>
                        </div>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(getPricingForDisplay('annual').price, getPricingForDisplay('annual').currency)}
                        </span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Pricing Configuration Info */}
                <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded">
                  Pricing from: {getPricingForDisplay(selectedPricingFrequency).configName}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select an engagement model to view pricing</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Bar */}
      {(selectedMembershipPlan || selectedEngagementModel) && (
        <Card className="bg-green-50 border border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Current Selection:</span>
                {selectedMembershipPlan && <span className="ml-2 text-green-700">{selectedMembershipPlan.charAt(0).toUpperCase() + selectedMembershipPlan.slice(1)} Plan</span>}
                {selectedMembershipPlan && selectedEngagementModel && <span className="mx-2">•</span>}
                {selectedEngagementModel && <span className="text-green-700">{selectedEngagementModel}</span>}
              </div>
              {membershipStatus === 'active' && (
                <Badge className="bg-green-100 text-green-800">20% Member Discount Applied</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MembershipEngagementDashboard;
