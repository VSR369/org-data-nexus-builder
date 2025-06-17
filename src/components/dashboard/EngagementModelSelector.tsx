
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Handshake, X, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { getCleanEngagementModels } from '@/components/master-data/engagement-models/engagementModelsDataManager';

interface EngagementModelSelectorProps {
  onClose: () => void;
  onSelect: (model: EngagementModel) => void;
}

const EngagementModelSelector: React.FC<EngagementModelSelectorProps> = ({
  onClose,
  onSelect
}) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadEngagementModels = () => {
      try {
        console.log('🔄 Loading clean engagement models...');
        const models = getCleanEngagementModels();
        console.log('✅ Loaded engagement models:', models.length, models.map(m => m.name));
        setEngagementModels(models);
      } catch (error) {
        console.error('❌ Error loading engagement models:', error);
        toast({
          title: "Error",
          description: "Failed to load engagement models.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEngagementModels();
  }, [toast]);

  const handleSelectModel = () => {
    if (!selectedModelId) {
      toast({
        title: "Selection Required",
        description: "Please select an engagement model.",
        variant: "destructive",
      });
      return;
    }

    const selectedModel = engagementModels.find(model => model.id === selectedModelId);
    if (selectedModel) {
      onSelect(selectedModel);
      toast({
        title: "Engagement Model Selected",
        description: `You have selected: ${selectedModel.name}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p>Loading engagement models...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Handshake className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl font-bold">
                Select Engagement Model
              </CardTitle>
            </div>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {engagementModels.length === 0 ? (
            <div className="p-6 text-center">
              <Handshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Engagement Models Found
              </h3>
              <p className="text-gray-600">
                No engagement models are currently configured. Please contact your administrator 
                to set up engagement models in the master data.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Available Engagement Models ({engagementModels.length})</h3>
                <p className="text-sm text-blue-700">
                  Choose an engagement model that best fits your organization's needs. 
                  Each model defines how services are delivered and managed.
                </p>
              </div>

              <RadioGroup value={selectedModelId} onValueChange={setSelectedModelId}>
                <div className="grid grid-cols-1 gap-4">
                  {engagementModels.map((model) => (
                    <div key={model.id} className="relative">
                      <Label htmlFor={model.id} className="cursor-pointer">
                        <Card className={`border-2 transition-all hover:shadow-md ${
                          selectedModelId === model.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200'
                        }`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={model.id} id={model.id} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-lg">{model.name}</h4>
                                  <Badge variant="default">Active</Badge>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">
                                  {model.description}
                                </p>
                              </div>
                              {selectedModelId === model.id && (
                                <div className="flex items-center gap-2 text-blue-600">
                                  <Check className="h-4 w-4" />
                                  <span className="text-sm font-medium">Selected</span>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleSelectModel}
                  disabled={!selectedModelId}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Handshake className="mr-2 h-4 w-4" />
                  Select Engagement Model
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementModelSelector;
