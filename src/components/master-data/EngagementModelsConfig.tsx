
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Handshake } from 'lucide-react';
import { EngagementModel } from './engagement-models/types';
import { engagementModelsDataManager } from './engagement-models/engagementModelsDataManager';
import EngagementModelForm from './engagement-models/EngagementModelForm';
import EngagementModelsList from './engagement-models/EngagementModelsList';

const EngagementModelsConfig = () => {
  const [models, setModels] = useState<EngagementModel[]>([]);
  const [editingModel, setEditingModel] = useState<EngagementModel | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = () => {
    try {
      const loadedModels = engagementModelsDataManager.getEngagementModels();
      setModels(loadedModels);
      console.log('Loaded engagement models:', loadedModels);
    } catch (error) {
      console.error('Error loading engagement models:', error);
      toast({
        title: "Error",
        description: "Failed to load engagement models.",
        variant: "destructive",
      });
    }
  };

  const handleAddModel = (modelData: Omit<EngagementModel, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newModel = engagementModelsDataManager.addEngagementModel(modelData);
      setModels(prev => [...prev, newModel]);
      toast({
        title: "Success",
        description: "Engagement model added successfully.",
      });
    } catch (error) {
      console.error('Error adding engagement model:', error);
      toast({
        title: "Error",
        description: "Failed to add engagement model.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateModel = (id: string, updates: Partial<Omit<EngagementModel, 'id' | 'createdAt'>>) => {
    try {
      const updatedModel = engagementModelsDataManager.updateEngagementModel(id, updates);
      if (updatedModel) {
        setModels(prev => prev.map(model => model.id === id ? updatedModel : model));
        setEditingModel(null);
        toast({
          title: "Success",
          description: "Engagement model updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating engagement model:', error);
      toast({
        title: "Error",
        description: "Failed to update engagement model.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteModel = (id: string) => {
    try {
      const success = engagementModelsDataManager.deleteEngagementModel(id);
      if (success) {
        setModels(prev => prev.filter(model => model.id !== id));
        toast({
          title: "Success",
          description: "Engagement model deleted successfully.",
        });
      }
    } catch (error) {
      console.error('Error deleting engagement model:', error);
      toast({
        title: "Error",
        description: "Failed to delete engagement model.",
        variant: "destructive",
      });
    }
  };

  const handleEditModel = (model: EngagementModel) => {
    setEditingModel(model);
  };

  const handleCancelEdit = () => {
    setEditingModel(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="w-5 h-5" />
            Engagement Models Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Configure different engagement models like Marketplace, Aggregator, and Marketplace Plus Aggregator 
            that define how services are delivered and managed.
          </p>
          
          <div className="space-y-6">
            <EngagementModelForm
              onAdd={handleAddModel}
              editingModel={editingModel}
              onUpdate={handleUpdateModel}
              onCancelEdit={handleCancelEdit}
            />
            
            <EngagementModelsList
              models={models}
              onEdit={handleEditModel}
              onDelete={handleDeleteModel}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementModelsConfig;
