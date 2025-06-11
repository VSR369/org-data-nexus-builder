
import React from 'react';
import { WizardData } from '@/types/wizardTypes';
import ExcelUploader from './ExcelUploader';
import ManualDataEntry from './ManualDataEntry';
import TemplateSelector from './TemplateSelector';

interface DataEntryStepProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const DataEntryStep: React.FC<DataEntryStepProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  console.log('DataEntryStep: Rendering with dataSource:', wizardData.dataSource);

  const renderDataEntryComponent = () => {
    switch (wizardData.dataSource) {
      case 'excel':
        console.log('DataEntryStep: Rendering ExcelUploader');
        return (
          <ExcelUploader
            wizardData={wizardData}
            onUpdate={onUpdate}
            onValidationChange={onValidationChange}
          />
        );
      case 'manual':
        console.log('DataEntryStep: Rendering ManualDataEntry');
        return (
          <ManualDataEntry
            wizardData={wizardData}
            onUpdate={onUpdate}
            onValidationChange={onValidationChange}
          />
        );
      case 'template':
        console.log('DataEntryStep: Rendering TemplateSelector');
        return (
          <TemplateSelector
            wizardData={wizardData}
            onUpdate={onUpdate}
            onValidationChange={onValidationChange}
          />
        );
      default:
        console.log('DataEntryStep: No valid dataSource, showing fallback');
        return (
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              Please select a data source method in the previous step.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          {wizardData.dataSource === 'excel' && 'Upload Excel File'}
          {wizardData.dataSource === 'manual' && 'Manual Data Entry'}
          {wizardData.dataSource === 'template' && 'Select Template'}
          {!wizardData.dataSource && 'Data Entry'}
        </h2>
        <p className="text-muted-foreground">
          {wizardData.dataSource === 'excel' && 'Upload your Excel file with domain group hierarchy'}
          {wizardData.dataSource === 'manual' && 'Add categories and sub-categories manually'}
          {wizardData.dataSource === 'template' && 'Choose from pre-built industry templates'}
          {!wizardData.dataSource && 'Configure your data entry method first'}
        </p>
      </div>

      {renderDataEntryComponent()}
    </div>
  );
};

export default DataEntryStep;
