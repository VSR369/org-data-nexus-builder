
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { EngagementModel } from './engagement-models/types';
import { getCleanEngagementModels, engagementModelsDataManager } from './engagement-models/engagementModelsDataManager';
import EngagementModelForm from './engagement-models/EngagementModelForm';
import EngagementModelsList from './engagement-models/EngagementModelsList';

const EngagementModelsConfig = () => {
  const { toast } = useToast();
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    console.log('🔄 EngagementModelsConfig: Loading clean engagement models...');
    const loadedModels = getCleanEngagementModels();
    // Filter to only show "Market Place" and "Aggregator" models
    const filteredModels = loadedModels.filter(model => 
      model.name === 'Market Place' || model.name === 'Aggregator'
    );
    console.log('✅ EngagementModelsConfig: Loaded filtered models:', filteredModels.length, filteredModels.map(m => m.name));
    setEngagementModels(filteredModels);
  }, []);

  const handleRefreshData = () => {
    console.log('🔄 Refreshing engagement models data...');
    const refreshedData = getCleanEngagementModels();
    // Filter to only show "Market Place" and "Aggregator" models
    const filteredData = refreshedData.filter(model => 
      model.name === 'Market Place' || model.name === 'Aggregator'
    );
    setEngagementModels(filteredData);
    toast({
      title: "Success",
      description: "Engagement models data refreshed and cleaned",
    });
  };

  const handleResetToDefault = () => {
    console.log('🔄 Resetting engagement models to filtered default models...');
    // Get filtered default data and save it
    const filteredDefaultData = [
      {
        id: 'marketplace',
        name: 'Market Place',
        description: 'A platform where solution seekers and providers connect directly for marketplace transactions',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'aggregator',
        name: 'Aggregator',
        description: 'Aggregation services that collect and organize solutions from multiple sources',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    setEngagementModels(filteredDefaultData);
    toast({
      title: "Success",
      description: "Engagement models reset to Market Place and Aggregator models",
    });
  };

  const handleModelSaved = (model: EngagementModel) => {
    const updatedModels = [...engagementModels];
    const existingIndex = updatedModels.findIndex(m => m.id === model.id);
    
    if (existingIndex >= 0) {
      updatedModels[existingIndex] = model;
    } else {
      updatedModels.push(model);
    }
    
    setEngagementModels(updatedModels);
    engagementModelsDataManager.saveData(updatedModels);
  };

  const handleModelDeleted = (modelId: string) => {
    const updatedModels = engagementModels.filter(m => m.id !== modelId);
    setEngagementModels(updatedModels);
    engagementModelsDataManager.saveData(updatedModels);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="h-5 w-5" />
                Engagement Models Configuration
              </CardTitle>
              <CardDescription>
                Configure engagement models that define how services are delivered and managed. 
                Showing Market Place and Aggregator models only.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRefreshData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clean & Refresh
              </Button>
              <Button
                onClick={handleResetToDefault}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Current engagement models: {engagementModels.length}/2 expected models
          </div>
        </CardContent>
      </Card>

      <EngagementModelForm onAdd={handleModelSaved} />
      
      <EngagementModelsList 
        models={engagementModels}
        onEdit={handleModelSaved}
        onDelete={handleModelDeleted}
      />
    </div>
  );
};

export default EngagementModelsConfig;
