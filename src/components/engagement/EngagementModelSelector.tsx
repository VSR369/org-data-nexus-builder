
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign } from 'lucide-react';
import { MembershipService } from '@/services/MembershipService';
import { useToast } from "@/hooks/use-toast";

interface EngagementModel {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

interface EngagementModelSelectorProps {
  userId: string;
  isMember: boolean;
  onClose: () => void;
  onSelectionSaved: () => void;
}

const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    id: 'marketplace',
    name: 'Market Place',
    description: 'Direct marketplace transactions',
    basePrice: 500
  },
  {
    id: 'aggregator',
    name: 'Aggregator',
    description: 'Aggregation services from multiple sources',
    basePrice: 600
  },
  {
    id: 'marketplace-aggregator',
    name: 'Market Place & Aggregator',
    description: 'Combined marketplace and aggregation services',
    basePrice: 750
  },
  {
    id: 'platform-service',
    name: 'Platform as a Service',
    description: 'Complete platform infrastructure and services',
    basePrice: 1000
  }
];

const DURATIONS = ['3 months', '6 months', '12 months'];

const EngagementModelSelector: React.FC<EngagementModelSelectorProps> = ({
  userId,
  isMember,
  onClose,
  onSelectionSaved
}) => {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');

  console.log('🔍 EngagementModelSelector opened for user:', userId, 'isMember:', isMember);

  const getSelectedModelData = () => ENGAGEMENT_MODELS.find(model => model.id === selectedModel);

  const calculatePrice = (basePrice: number) => ({
    originalAmount: basePrice,
    discountedAmount: isMember ? Math.round(basePrice * 0.8) : undefined
  });

  const handleSubmit = () => {
    console.log('💾 Attempting to save selection:', { selectedModel, selectedDuration });
    
    if (!selectedModel || !selectedDuration) {
      toast({
        title: "Selection Required",
        description: "Please select both an engagement model and duration.",
        variant: "destructive"
      });
      return;
    }

    const modelData = getSelectedModelData();
    if (!modelData) {
      console.error('❌ Model data not found for ID:', selectedModel);
      return;
    }

    const pricing = calculatePrice(modelData.basePrice);
    const selection = {
      model: modelData.name,
      duration: selectedDuration,
      pricing: {
        currency: 'USD',
        originalAmount: pricing.originalAmount,
        discountedAmount: pricing.discountedAmount,
        frequency: 'quarterly'
      },
      selectedAt: new Date().toISOString()
    };

    console.log('💾 Saving engagement selection:', selection);
    const success = MembershipService.saveEngagementSelection(userId, selection);
    
    if (success) {
      toast({
        title: "Selection Saved",
        description: `${modelData.name} engagement model has been selected successfully.`,
      });
      console.log('✅ Selection saved successfully');
      onSelectionSaved();
    } else {
      toast({
        title: "Error",
        description: "Failed to save selection. Please try again.",
        variant: "destructive"
      });
      console.error('❌ Failed to save selection');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
              Select Engagement Model & Pricing
              {isMember && <Badge variant="default" className="bg-green-600">Member Pricing Active</Badge>}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Choose Your Engagement Model</h4>
            <p className="text-sm text-blue-700">
              {isMember ? 
                "✅ You're eligible for 20% member discount on all pricing options!" : 
                "💡 Join as a member to get 20% discount on all engagement models"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ENGAGEMENT_MODELS.map((model) => {
              const pricing = calculatePrice(model.basePrice);
              return (
                <Card 
                  key={model.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedModel === model.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'hover:bg-gray-50 hover:shadow-sm'
                  }`}
                  onClick={() => {
                    console.log('🔄 Selected model:', model.name);
                    setSelectedModel(model.id);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg">{model.name}</h3>
                      <input
                        type="radio"
                        checked={selectedModel === model.id}
                        onChange={() => setSelectedModel(model.id)}
                        className="mt-1 h-4 w-4"
                      />
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                    <div className="flex items-center gap-2">
                      {pricing.discountedAmount ? (
                        <>
                          <span className="text-xl font-bold text-green-600">
                            ${pricing.discountedAmount}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${pricing.originalAmount}
                          </span>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">20% OFF</Badge>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">${pricing.originalAmount}</span>
                      )}
                      <span className="text-sm text-gray-500">/quarterly</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Duration</label>
            <Select value={selectedDuration} onValueChange={(value) => {
              console.log('🔄 Selected duration:', value);
              setSelectedDuration(value);
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select engagement duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedModel && selectedDuration && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-green-900 mb-2">Selection Summary</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Model:</strong> {getSelectedModelData()?.name}</div>
                  <div><strong>Duration:</strong> {selectedDuration}</div>
                  <div className="flex items-center gap-2">
                    <strong>Price:</strong>
                    {(() => {
                      const pricing = calculatePrice(getSelectedModelData()?.basePrice || 0);
                      return pricing.discountedAmount ? (
                        <>
                          <span className="text-green-600 font-bold">${pricing.discountedAmount}</span>
                          <span className="text-gray-500 line-through text-xs">${pricing.originalAmount}</span>
                          <span className="text-xs text-green-600">(Member Price)</span>
                        </>
                      ) : (
                        <span className="font-bold">${pricing.originalAmount}</span>
                      );
                    })()}
                    <span>/quarterly</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedModel || !selectedDuration}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Save Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementModelSelector;
