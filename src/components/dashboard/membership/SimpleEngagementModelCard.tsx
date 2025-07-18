
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, ShoppingCart, Building, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EngagementModel {
  id: string;
  name: string;
  description: string | null;
}

interface SimpleEngagementModelCardProps {
  selectedModel: string | null;
  onModelSelect: (modelName: string) => void;
}

const getModelIcon = (modelName: string) => {
  const lowerName = modelName.toLowerCase();
  if (lowerName.includes('marketplace') || lowerName.includes('market place')) return ShoppingCart;
  if (lowerName.includes('aggregator')) return Building;
  
  return Users;
};

const getModelColor = (modelName: string) => {
  const lowerName = modelName.toLowerCase();
  if (lowerName.includes('marketplace') || lowerName.includes('market place')) return 'text-blue-600';
  if (lowerName.includes('aggregator')) return 'text-green-600';
  
  return 'text-blue-600';
};

const getModelDescription = (modelName: string, description: string | null) => {
  if (description) return description;
  
  const lowerName = modelName.toLowerCase();
  if (lowerName.includes('marketplace') || lowerName.includes('market place')) {
    return 'Connect directly with solution providers in an open marketplace environment';
  }
  if (lowerName.includes('aggregator')) {
    return 'Work with curated solution providers through our aggregated platform';
  }
  return 'Choose this engagement model for your challenges';
};

export const SimpleEngagementModelCard: React.FC<SimpleEngagementModelCardProps> = ({
  selectedModel,
  onModelSelect
}) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEngagementModels();
  }, []);

  const loadEngagementModels = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('master_engagement_models')
        .select('id, name, description')
        .order('name');

      if (error) throw error;
      
      setEngagementModels(data || []);
    } catch (error) {
      console.error('Error loading engagement models:', error);
      toast({
        title: "Error",
        description: "Failed to load engagement models",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading engagement models...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (engagementModels.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Engagement Models Available</CardTitle>
          <CardDescription>
            No engagement models found. Please contact support.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Your Engagement Model</CardTitle>
        <CardDescription>
          Choose how you want to engage with solution providers on our platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engagementModels.map((model) => {
            const Icon = getModelIcon(model.name);
            const isSelected = selectedModel === model.name;
            const description = getModelDescription(model.name, model.description);
            
            return (
              <div
                key={model.id}
                className={`rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => onModelSelect(model.name)}
              >
                <div className="text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-3 ${getModelColor(model.name)}`} />
                  <h3 className="text-lg font-semibold mb-2">{model.name}</h3>
                  
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    {description}
                  </p>
                  
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onModelSelect(model.name)}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        Select {model.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedModel && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                {selectedModel} engagement model selected
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              You can change your engagement model at any time from your account settings.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
