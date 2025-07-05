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

  // Load localStorage data on mount
  useEffect(() => {
    const savedMembershipPlan = localStorage.getItem('selectedMembershipPlan');
    const savedEngagementModel = localStorage.getItem('selectedEngagementModel');
    const savedPricingFrequency = localStorage.getItem('selectedPricingFrequency');

    if (savedMembershipPlan) setSelectedMembershipPlan(savedMembershipPlan);
    if (savedEngagementModel) setSelectedEngagementModel(savedEngagementModel);
    if (savedPricingFrequency) setSelectedPricingFrequency(savedPricingFrequency);

    // Load pricing data
    const configs = PricingDataManager.getAllConfigurations();
    setPricingConfigs(configs);
  }, []);

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

  // Membership plans data
  const membershipPlans: PricingPlan[] = [
    {
      id: 'quarterly',
      name: 'Quarterly',
      duration: '3 months',
      description: '',
      price: currentPricing?.quarterlyFee,
      currency: currentPricing?.currency || 'INR'
    },
    {
      id: 'halfyearly',
      name: 'Half-Yearly',
      duration: '6 months',
      description: '',
      price: currentPricing?.halfYearlyFee,
      currency: currentPricing?.currency || 'INR'
    },
    {
      id: 'annual',
      name: 'Annual',
      duration: '12 months',
      description: '',
      price: currentPricing?.annualFee,
      currency: currentPricing?.currency || 'INR'
    }
  ];

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

  // Get pricing for display in column 4
  const getPricingForDisplay = (frequency: string): number => {
    if (!currentPricing) return 0;
    
    let basePrice = 0;
    switch (frequency) {
      case 'quarterly':
        basePrice = currentPricing.quarterlyFee || 0;
        break;
      case 'halfyearly':
        basePrice = currentPricing.halfYearlyFee || 0;
        break;
      case 'annual':
        basePrice = currentPricing.annualFee || 0;
        break;
      default:
        basePrice = currentPricing.halfYearlyFee || 0;
    }
    
    return calculatePrice(basePrice);
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
                    <div className="text-sm opacity-90 mb-1">{selectedEngagementModel}</div>
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(getPricingForDisplay('halfyearly'), currentPricing?.currency)}
                    </div>
                    <div className="text-sm opacity-90">Half-Yearly</div>
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
                          {formatCurrency(getPricingForDisplay('quarterly'), currentPricing?.currency)}
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
                          {formatCurrency(getPricingForDisplay('halfyearly'), currentPricing?.currency)}
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
                          {formatCurrency(getPricingForDisplay('annual'), currentPricing?.currency)}
                        </span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
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
