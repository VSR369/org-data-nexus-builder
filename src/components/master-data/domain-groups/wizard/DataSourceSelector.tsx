
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit } from 'lucide-react';
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
  React.useEffect(() => {
    // Auto-select manual entry as the only option
    if (!wizardData.dataSource) {
      onUpdate({ dataSource: 'manual' });
      onValidationChange(true);
    }
  }, [wizardData.dataSource, onUpdate, onValidationChange]);

  const handleDataSourceChange = () => {
    onUpdate({ dataSource: 'manual' });
    onValidationChange(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Manual Domain Group Creation</h2>
        <p className="text-muted-foreground">
          Create your domain group hierarchy step by step using guided forms
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Label htmlFor="manual" className="cursor-pointer">
            <Card className="border-2 border-primary bg-primary/5">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Edit className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Manual Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Create your hierarchy step by step using forms. 
                  Perfect for controlled setup with guidance and validation.
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
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-medium mb-2">Manual Entry Selected</h3>
        <p className="text-sm text-muted-foreground">
          You'll create your hierarchy using step-by-step forms with guidance and validation.
        </p>
      </div>
    </div>
  );
};

export default DataSourceSelector;
