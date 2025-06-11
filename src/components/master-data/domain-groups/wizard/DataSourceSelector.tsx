
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Upload, Edit, Target } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';

interface DataSourceSelectorProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  const handleDataSourceChange = (value: 'manual' | 'excel' | 'template') => {
    console.log('DataSourceSelector: Changing data source to:', value);
    onUpdate({ dataSource: value });
    onValidationChange(true);
  };

  React.useEffect(() => {
    const isValid = !!wizardData.dataSource;
    console.log('DataSourceSelector: Validation check:', { dataSource: wizardData.dataSource, isValid });
    onValidationChange(isValid);
  }, [wizardData.dataSource, onValidationChange]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Choose Your Data Entry Method</h2>
        <p className="text-muted-foreground">
          Select how you'd like to add your domain group hierarchy
        </p>
      </div>

      <RadioGroup 
        value={wizardData.dataSource || ''} 
        onValueChange={handleDataSourceChange}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Manual Entry Option */}
        <div className="relative">
          <RadioGroupItem value="manual" id="manual" className="sr-only" />
          <Label htmlFor="manual" className="cursor-pointer">
            <Card className={`h-full border-2 transition-colors ${
              wizardData.dataSource === 'manual' 
                ? 'border-primary bg-primary/5' 
                : 'border-muted hover:border-primary/50'
            }`}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Edit className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Manual Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Create your hierarchy step by step using forms. 
                  Perfect for small hierarchies or when you want full control.
                </p>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <div>• Step-by-step guidance</div>
                  <div>• Duplicate detection</div>
                  <div>• Real-time validation</div>
                </div>
              </CardContent>
            </Card>
          </Label>
        </div>

        {/* Excel Upload Option */}
        <div className="relative">
          <RadioGroupItem value="excel" id="excel" className="sr-only" />
          <Label htmlFor="excel" className="cursor-pointer">
            <Card className={`h-full border-2 transition-colors ${
              wizardData.dataSource === 'excel' 
                ? 'border-primary bg-primary/5' 
                : 'border-muted hover:border-primary/50'
            }`}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Excel Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Upload an Excel file with your complete hierarchy. 
                  Fastest method for large datasets.
                </p>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <div>• Bulk data processing</div>
                  <div>• Template download</div>
                  <div>• Error validation</div>
                </div>
              </CardContent>
            </Card>
          </Label>
        </div>

        {/* Quick Template Option */}
        <div className="relative">
          <RadioGroupItem value="template" id="template" className="sr-only" />
          <Label htmlFor="template" className="cursor-pointer">
            <Card className={`h-full border-2 transition-colors ${
              wizardData.dataSource === 'template' 
                ? 'border-primary bg-primary/5' 
                : 'border-muted hover:border-primary/50'
            }`}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Start with pre-built industry templates. 
                  Quick setup with proven hierarchies.
                </p>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <div>• Industry-specific</div>
                  <div>• Pre-validated data</div>
                  <div>• Instant setup</div>
                </div>
              </CardContent>
            </Card>
          </Label>
        </div>
      </RadioGroup>

      {wizardData.dataSource && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">
            {wizardData.dataSource === 'manual' && 'Manual Entry Selected'}
            {wizardData.dataSource === 'excel' && 'Excel Upload Selected'}
            {wizardData.dataSource === 'template' && 'Quick Template Selected'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {wizardData.dataSource === 'manual' && 
              'You\'ll create your hierarchy using step-by-step forms with guidance and validation.'}
            {wizardData.dataSource === 'excel' && 
              'You\'ll upload an Excel file with your complete hierarchy. We\'ll validate and process it for you.'}
            {wizardData.dataSource === 'template' && 
              'You\'ll choose from pre-built industry templates to quickly setup your hierarchy.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DataSourceSelector;
