
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { WizardData } from '@/types/wizardTypes';
import { TreePine, FileSpreadsheet, Upload } from 'lucide-react';

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
  useEffect(() => {
    // Since we only support manual entry, mark as valid if manual is selected
    const isValid = wizardData.dataSource === 'manual';
    console.log('DataSourceSelector: Validation check:', { dataSource: wizardData.dataSource, isValid });
    onValidationChange(isValid);
  }, [wizardData.dataSource, onValidationChange]);

  const handleDataSourceChange = (value: string) => {
    console.log('DataSourceSelector: Data source changed to:', value);
    onUpdate({ dataSource: value as 'manual' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select Data Entry Method</h2>
        <p className="text-muted-foreground">
          Choose how you want to create your domain group hierarchy
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Entry Options</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={wizardData.dataSource} 
            onValueChange={handleDataSourceChange}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual" className="flex items-center space-x-3 cursor-pointer flex-1">
                <TreePine className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Manual Entry</div>
                  <div className="text-sm text-muted-foreground">
                    Create categories and sub-categories manually using forms
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
              <RadioGroupItem value="excel" id="excel" disabled />
              <Label htmlFor="excel" className="flex items-center space-x-3 cursor-not-allowed flex-1">
                <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-muted-foreground">Excel Upload</div>
                  <div className="text-sm text-muted-foreground">
                    Upload data from Excel file (Coming Soon)
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
              <RadioGroupItem value="template" id="template" disabled />
              <Label htmlFor="template" className="flex items-center space-x-3 cursor-not-allowed flex-1">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-muted-foreground">Template Upload</div>
                  <div className="text-sm text-muted-foreground">
                    Upload using predefined template (Coming Soon)
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourceSelector;
