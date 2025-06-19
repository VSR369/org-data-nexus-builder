
import React, { useState, useEffect } from 'react';
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
  pricing: {
    currency: string;
    originalAmount: number;
    discountedAmount?: number;
    frequency: string;
  };
}

interface EngagementModelSelectorProps {
  userId: string;
  isMember: boolean;
  onClose: () => void;
  onSelectionSaved: () => void;
}

const EngagementModelSelector: React.FC<EngagementModelSelectorProps> = ({
  userId,
  isMember,
  onClose,
  onSelectionSaved
}) => {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [engagementModels] = useState<EngagementModel[]>([
    {
      id: 'marketplace',
      name: 'Market Place',
      description: 'Direct marketplace transactions',
      pricing: { currency: 'USD', originalAmount: 500, discountedAmount: isMember ? 400 : undefined, frequency: 'quarterly' }
    },
    {
      id: 'aggregator',
      name: 'Aggregator',
      description: 'Aggregation services from multiple sources',
      pricing: { currency: 'USD', originalAmount: 600, discountedAmount: isMember ? 480 : undefined, frequency: 'quarterly' }
    },
    {
      id: 'marketplace-aggregator',
      name: 'Market Place & Aggregator',
      description: 'Combined marketplace and aggregation services',
      pricing: { currency: 'USD', originalAmount: 750, discountedAmount: isMember ? 600 : undefined, frequency: 'quarterly' }
    },
    {
      id: 'platform-service',
      name: 'Platform as a Service',
      description: 'Complete platform infrastructure and services',
      pricing: { currency: 'USD', originalAmount: 1000, discountedAmount: isMember ? 800 : undefined, frequency: 'quarterly' }
    }
  ]);

  const durations = ['3 months', '6 months', '12 months'];

  const getSelectedModelData = () => {
    return engagementModels.find(model => model.id === selectedModel);
  };

  const handleSubmit = () => {
    if (!selectedModel || !selectedDuration) {
      toast({
        title: "Selection Required",
        description: "Please select both an engagement model and duration.",
        variant: "destructive"
      });
      return;
    }

    const modelData = getSelectedModelData();
    if (!modelData) return;

    const selection = {
      model: modelData.name,
      duration: selectedDuration,
      pricing: modelData.pricing,
      selectedAt: new Date().toISOString()
    };

    const success = MembershipService.saveEngagementSelection(userId, selection);
    
    if (success) {
      toast({
        title: "Selection Saved",
        description: `${modelData.name} engagement model has been selected.`,
      });
      onSelectionSaved();
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to save selection. Please try again.",
        variant: "destructive"
      });
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
              Select Engagement Model
              {isMember && <Badge variant="default" className="bg-green-600">Member Pricing</Badge>}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {engagementModels.map((model) => (
              <Card 
                key={model.id}
                className={`cursor-pointer transition-colors ${
                  selectedModel === model.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">{model.name}</h3>
                    <input
                      type="radio"
                      checked={selectedModel === model.id}
                      onChange={() => setSelectedModel(model.id)}
                      className="mt-1"
                    />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                  <div className="flex items-center gap-2">
                    {model.pricing.discountedAmount ? (
                      <>
                        <span className="text-lg font-bold text-green-600">
                          ${model.pricing.discountedAmount}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${model.pricing.originalAmount}
                        </span>
                        <Badge variant="secondary" className="text-xs">20% OFF</Badge>
                      </>
                    ) : (
                      <span className="text-lg font-bold">
                        ${model.pricing.originalAmount}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">/{model.pricing.frequency}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedModel && selectedDuration && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Selection Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Model:</strong> {getSelectedModelData()?.name}</div>
                    <div><strong>Duration:</strong> {selectedDuration}</div>
                    <div className="flex items-center gap-2">
                      <strong>Price:</strong>
                      {getSelectedModelData()?.pricing.discountedAmount ? (
                        <>
                          <span className="text-green-600 font-bold">
                            ${getSelectedModelData()?.pricing.discountedAmount}
                          </span>
                          <span className="text-gray-500 line-through text-xs">
                            ${getSelectedModelData()?.pricing.originalAmount}
                          </span>
                        </>
                      ) : (
                        <span>${getSelectedModelData()?.pricing.originalAmount}</span>
                      )}
                      <span>/{getSelectedModelData()?.pricing.frequency}</span>
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
                className="flex-1"
              >
                Save Selection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementModelSelector;
