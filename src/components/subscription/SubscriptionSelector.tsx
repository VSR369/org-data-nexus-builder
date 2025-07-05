import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Crown, Layout, Star } from 'lucide-react';

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  popular?: boolean;
  discount?: number;
}

interface EngagementModel {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

const membershipPlans: MembershipPlan[] = [
  {
    id: 'quarterly',
    name: 'Quarterly',
    description: 'Perfect for getting started',
    price: 299,
    currency: 'USD',
    duration: '3 months',
    features: ['Basic Support', 'Core Features', 'Email Support']
  },
  {
    id: 'half-yearly',
    name: 'Half-Yearly',
    description: 'Most popular choice',
    price: 549,
    currency: 'USD',
    duration: '6 months',
    features: ['Priority Support', 'Advanced Features', 'Phone Support'],
    popular: true,
    discount: 8
  },
  {
    id: 'annual',
    name: 'Annual',
    description: 'Best value for long-term',
    price: 999,
    currency: 'USD',
    duration: '12 months',
    features: ['Premium Support', 'All Features', '24/7 Support'],
    discount: 17
  }
];

const engagementModels: EngagementModel[] = [
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Direct marketplace transactions',
    price: 500,
    features: ['Transaction Management', 'Vendor Network', 'Payment Processing']
  },
  {
    id: 'aggregator',
    name: 'Aggregator',
    description: 'Aggregation services from multiple sources',
    price: 650,
    features: ['Multi-source Integration', 'Data Aggregation', 'Analytics Dashboard']
  },
  {
    id: 'platform-service',
    name: 'Platform as a Service',
    description: 'Complete platform infrastructure',
    price: 1200,
    features: ['Full Infrastructure', 'Custom Solutions', 'Dedicated Support']
  },
  {
    id: 'hybrid',
    name: 'Hybrid Model',
    description: 'Combined marketplace and aggregation',
    price: 850,
    features: ['Best of Both Worlds', 'Flexible Options', 'Scalable Solutions']
  }
];

const SubscriptionSelector: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  const getSelectedPlanData = () => membershipPlans.find(plan => plan.id === selectedPlan);
  const getSelectedModelData = () => engagementModels.find(model => model.id === selectedModel);

  const calculateTotal = () => {
    const plan = getSelectedPlanData();
    const model = getSelectedModelData();
    if (!plan || !model) return 0;
    return plan.price + model.price;
  };

  const calculateSavings = () => {
    const plan = getSelectedPlanData();
    if (!plan?.discount) return 0;
    return Math.round((plan.price * plan.discount) / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect combination of membership plan and engagement model for your needs
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Membership Plans (35%) */}
          <div className="col-span-4">
            <Card className="h-fit shadow-lg border-0 bg-white">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="h-6 w-6 text-yellow-600" />
                  <CardTitle className="text-2xl">Membership Plans</CardTitle>
                </div>
                <p className="text-gray-600">Choose your subscription duration</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  {membershipPlans.map((plan) => (
                    <div key={plan.id} className="relative">
                      <div className={`p-6 border-2 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer ${
                        selectedPlan === plan.id 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        {plan.popular && (
                          <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            Most Popular
                          </Badge>
                        )}
                        
                        <div className="flex items-start justify-between mb-4">
                          <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                          <Label htmlFor={plan.id} className="flex-1 ml-3 cursor-pointer">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                                <div className="text-sm text-gray-500">{plan.duration}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  ${plan.price}
                                </div>
                                {plan.discount && (
                                  <div className="text-sm text-green-600 font-medium">
                                    Save {plan.discount}%
                                  </div>
                                )}
                              </div>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="h-4 w-4 text-green-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Engagement Models (40%) */}
          <div className="col-span-5">
            <Card className="h-fit shadow-lg border-0 bg-white">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Layout className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-2xl">Engagement Models</CardTitle>
                </div>
                <p className="text-gray-600">Select your preferred engagement approach</p>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedModel} onValueChange={setSelectedModel}>
                  <div className="grid grid-cols-2 gap-4">
                    {engagementModels.map((model) => (
                      <div key={model.id} className="relative">
                        <div className={`p-5 border-2 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer h-full ${
                          selectedModel === model.id 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex flex-col h-full">
                            <div className="flex items-start justify-between mb-3">
                              <RadioGroupItem value={model.id} id={model.id} />
                              <div className="text-lg font-bold text-blue-600">
                                ${model.price}
                              </div>
                            </div>
                            
                            <Label htmlFor={model.id} className="flex-1 cursor-pointer">
                              <h3 className="text-base font-semibold text-gray-900 mb-2">
                                {model.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                {model.description}
                              </p>
                              
                              <div className="space-y-1">
                                {model.features.map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                    <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Confirmation Summary (25%) */}
          <div className="col-span-3">
            <Card className="shadow-lg border-0 bg-white sticky top-6">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Star className="h-6 w-6 text-orange-600" />
                  <CardTitle className="text-xl">Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {selectedPlan && selectedModel ? (
                  <div className="space-y-6">
                    {/* Selected Plan */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Membership Plan</h4>
                      <div className="text-sm text-gray-600 mb-1">
                        {getSelectedPlanData()?.name} - {getSelectedPlanData()?.duration}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ${getSelectedPlanData()?.price}
                      </div>
                      {calculateSavings() > 0 && (
                        <div className="text-sm text-green-600 font-medium">
                          You save ${calculateSavings()}
                        </div>
                      )}
                    </div>

                    {/* Selected Model */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Engagement Model</h4>
                      <div className="text-sm text-gray-600 mb-1">
                        {getSelectedModelData()?.name}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ${getSelectedModelData()?.price}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${calculateTotal()}
                        </span>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                        Confirm Selection
                      </Button>
                    </div>

                    {/* Benefits */}
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                      <div className="space-y-2">
                        {getSelectedPlanData()?.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="h-4 w-4 text-green-500" />
                            {feature}
                          </div>
                        ))}
                        {getSelectedModelData()?.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="h-4 w-4 text-blue-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      Select a membership plan and engagement model to see your summary
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSelector;