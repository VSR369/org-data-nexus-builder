import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PricingDataManager } from '@/utils/pricingDataManager';
import { PricingConfig } from '@/types/pricing';
import { MembershipFeeFixer, MembershipFeeEntry } from '@/utils/membershipFeeFixer';

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
  const [selectedPricingFrequency, setSelectedPricingFrequency] = useState<string>('');
  
  // State for pricing data
  const [pricingConfigs, setPricingConfigs] = useState<PricingConfig[]>([]);
  const [membershipFees, setMembershipFees] = useState<MembershipFeeEntry[]>([]);
  const [selectedMembershipFee, setSelectedMembershipFee] = useState<MembershipFeeEntry | null>(null);

  // Load localStorage data and pricing configurations on mount
  useEffect(() => {
    const savedMembershipPlan = localStorage.getItem('selectedMembershipPlan');
    const savedEngagementModel = localStorage.getItem('selectedEngagementModel');
    const savedPricingFrequency = localStorage.getItem('selectedPricingFrequency');

    if (savedMembershipPlan) setSelectedMembershipPlan(savedMembershipPlan);
    if (savedEngagementModel) setSelectedEngagementModel(savedEngagementModel);
    if (savedPricingFrequency) setSelectedPricingFrequency(savedPricingFrequency);

    // Load all pricing configurations for this country/organization/entity type
    const allConfigs = PricingDataManager.getAllConfigurations();
    setPricingConfigs(allConfigs);
    
    // Load membership fees from SeekerMembershipFeeConfig - CORRECT DATA SOURCE
    const allMembershipFees = MembershipFeeFixer.getMembershipFees();
    const filteredMembershipFees = allMembershipFees.filter(fee => 
      fee.country === country && 
      fee.organizationType === organizationType && 
      fee.entityType === entityType
    );
    setMembershipFees(filteredMembershipFees);
    
    console.log('🔍 Loading membership pricing for:', { country, organizationType, entityType });
    console.log('📊 Found membership fees:', filteredMembershipFees.length);
    console.log('💡 Membership fees data:', filteredMembershipFees);
    
    // Set initial membership fee if we have saved plan
    if (savedMembershipPlan && filteredMembershipFees.length > 0) {
      const initialFee = filteredMembershipFees[0]; // Use first available config
      setSelectedMembershipFee(initialFee);
      console.log('💰 Initial membership fee loaded:', initialFee);
    }
  }, [country, organizationType, entityType]);

  // Update localStorage when membership plan changes
  useEffect(() => {
    if (selectedMembershipPlan) {
      localStorage.setItem('selectedMembershipPlan', selectedMembershipPlan);
      console.log('💾 Saved membership plan to localStorage:', selectedMembershipPlan);
      
      // Update membership fee when plan changes
      if (membershipFees.length > 0) {
        const fee = membershipFees[0]; // Use first available fee for now
        setSelectedMembershipFee(fee);
        console.log('🔄 Updated membership fee:', fee);
      }
    }
  }, [selectedMembershipPlan, membershipFees]);

  // Update localStorage when engagement model changes (only if membership plan is selected)
  useEffect(() => {
    if (selectedEngagementModel && selectedMembershipPlan) {
      localStorage.setItem('selectedEngagementModel', selectedEngagementModel);
      console.log('💾 Saved engagement model to localStorage:', selectedEngagementModel);
    }
  }, [selectedEngagementModel, selectedMembershipPlan]);

  // Handle membership plan selection/deselection
  const handleMembershipPlanChange = (value: string) => {
    if (selectedMembershipPlan === value) {
      // Deselect if clicking on already selected plan
      setSelectedMembershipPlan('');
      setSelectedEngagementModel(''); // Clear engagement model when deselecting membership
      setSelectedPricingFrequency(''); // Clear pricing frequency too
      localStorage.removeItem('selectedMembershipPlan');
      localStorage.removeItem('selectedEngagementModel');
      localStorage.removeItem('selectedPricingFrequency');
      console.log('🔄 Deselected membership plan');
    } else {
      setSelectedMembershipPlan(value);
      console.log('✅ Selected membership plan:', value);
    }
  };

  // Handle engagement model selection/deselection
  const handleEngagementModelChange = (value: string) => {
    if (selectedEngagementModel === value) {
      // Deselect if clicking on already selected model
      setSelectedEngagementModel('');
      setSelectedPricingFrequency(''); // Clear pricing frequency when deselecting
      localStorage.removeItem('selectedEngagementModel');
      localStorage.removeItem('selectedPricingFrequency');
      console.log('🔄 Deselected engagement model');
    } else {
      setSelectedEngagementModel(value);
      console.log('✅ Selected engagement model:', value);
    }
  };

  // Handle pricing frequency selection/deselection
  const handlePricingFrequencyChange = (value: string) => {
    if (selectedPricingFrequency === value) {
      // Deselect if clicking on already selected frequency
      setSelectedPricingFrequency('');
      localStorage.removeItem('selectedPricingFrequency');
      console.log('🔄 Deselected pricing frequency');
    } else {
      setSelectedPricingFrequency(value);
      console.log('✅ Selected pricing frequency:', value);
    }
  };

  // Update localStorage when pricing frequency changes
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

  // Get membership plans with dynamic pricing from master data (independent of engagement model)
  const getMembershipPlans = (): PricingPlan[] => {
    if (membershipFees.length === 0) {
      console.log('⚠️ No membership fees found');
      return [];
    }

    // Use the first available membership fee entry
    const membershipFee = membershipFees[0];
    console.log('📋 Using membership fee entry:', membershipFee.id);
    console.log('💰 Fee data:', membershipFee);

    const plans = [
      {
        id: 'annual',
        name: 'Annual',
        duration: '12 months',
        description: `${membershipFee.organizationType} ${membershipFee.entityType} - 12 month plan`,
        price: membershipFee.annualAmount,
        currency: membershipFee.annualCurrency || 'INR'
      }
    ].filter(plan => plan.price && plan.price > 0); // Only show plans with valid pricing

    console.log('🏷️ Generated membership plans:', plans.length);
    console.log('📊 Plans data:', plans);
    return plans;
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
    if (!selectedEngagementModel || !selectedMembershipPlan) {
      return { price: 0, currency: 'INR', configName: 'Select Membership Plan First' };
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
         basePrice = engagementPricing.annualFee || 0;
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
            <RadioGroup value={selectedMembershipPlan} onValueChange={handleMembershipPlanChange}>
              <div className="space-y-4">
                {/* Not a Member Option */}
                <div className="space-y-2">
                  <Label htmlFor="membership-not-member" className="cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="not-member" id="membership-not-member" />
                      <div className="flex-1">
                        <div className="font-medium">Not a Member</div>
                        <div className="text-sm text-gray-500">No membership required</div>
                        <div className="text-sm text-gray-600">
                          Access basic features without membership
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
                
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
                               ~{formatCurrency(Math.round(calculatePrice(plan.price) / 12), plan.currency)}/mo
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
        <Card className={`h-fit ${!selectedMembershipPlan ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Engagement Models
              {!selectedMembershipPlan && (
                <Badge variant="outline" className="ml-2 text-xs">Select Membership Plan First</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMembershipPlan ? (
              <RadioGroup value={selectedEngagementModel} onValueChange={handleEngagementModelChange}>
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
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">Please select a membership plan first</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Column 3: Advanced Models */}
        <Card className={`h-fit ${!selectedMembershipPlan ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Advanced Models
              {!selectedMembershipPlan && (
                <Badge variant="outline" className="ml-2 text-xs">Select Membership Plan First</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMembershipPlan ? (
              <RadioGroup value={selectedEngagementModel} onValueChange={handleEngagementModelChange}>
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
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">Please select a membership plan first</p>
              </div>
            )}
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
            {selectedEngagementModel && selectedMembershipPlan ? (
              <div className="space-y-4">
                 {/* Featured pricing - Annual highlighted */}
                 <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                   <CardContent className="p-6 text-center">
                     <div className="text-sm opacity-90 mb-1">{getPricingForDisplay(selectedPricingFrequency || 'annual').configName}</div>
                     <div className="text-3xl font-bold mb-1">
                       {formatCurrency(getPricingForDisplay(selectedPricingFrequency || 'annual').price, getPricingForDisplay(selectedPricingFrequency || 'annual').currency)}
                     </div>
                     <div className="text-sm opacity-90">{selectedPricingFrequency ? (selectedPricingFrequency.charAt(0).toUpperCase() + selectedPricingFrequency.slice(1)) : 'Annual'}</div>
                     {membershipStatus === 'active' && (
                       <div className="text-xs opacity-75 mt-1">Member Discount Applied</div>
                     )}
                   </CardContent>
                 </Card>

                {/* Other pricing options */}
                <RadioGroup value={selectedPricingFrequency} onValueChange={handlePricingFrequencyChange}>
                  <div className="space-y-3">
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
                   Pricing from: {getPricingForDisplay(selectedPricingFrequency || 'annual').configName}
                 </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">
                  {!selectedMembershipPlan 
                    ? "Select a membership plan first" 
                    : "Select an engagement model to view pricing"
                  }
                </p>
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
              <div className="text-sm space-y-1">
                {selectedMembershipPlan && (
                  <div>
                    <span className="font-medium">Current Selection of Membership Plan:</span>
                    <span className="ml-2 text-green-700">{selectedMembershipPlan.charAt(0).toUpperCase() + selectedMembershipPlan.slice(1)} Plan</span>
                  </div>
                )}
                {selectedEngagementModel && (
                  <div>
                    <span className="font-medium">Current Selection of Engagement Model:</span>
                    <span className="ml-2 text-green-700">{selectedEngagementModel}</span>
                  </div>
                )}
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
