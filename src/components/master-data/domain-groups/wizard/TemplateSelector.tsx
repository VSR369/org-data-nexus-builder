
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Download, CheckCircle, Building2 } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { industrySegmentDataManager } from '../industrySegmentDataManager';

interface TemplateSelectorProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

// Mock template data - in real implementation, this would come from a templates service
const INDUSTRY_TEMPLATES = {
  'life-sciences': {
    name: 'Life Sciences',
    description: 'Pre-built hierarchy for Life Sciences industry',
    domainGroups: [
      {
        name: 'Drug Discovery & Development',
        categories: [
          { name: 'Target Identification', subCategories: ['Genomics', 'Proteomics', 'Biomarkers'] },
          { name: 'Lead Optimization', subCategories: ['ADMET', 'SAR Analysis', 'Chemical Libraries'] }
        ]
      }
    ]
  },
  'manufacturing': {
    name: 'Manufacturing',
    description: 'Smart manufacturing and process optimization',
    domainGroups: [
      {
        name: 'Process Optimization',
        categories: [
          { name: 'Lean Manufacturing', subCategories: ['Waste Reduction', 'Value Stream Mapping'] },
          { name: 'Quality Control', subCategories: ['Statistical Process Control', 'Six Sigma'] }
        ]
      }
    ]
  },
  'logistics': {
    name: 'Logistics & Supply Chain',
    description: 'Supply chain and logistics optimization',
    domainGroups: [
      {
        name: 'Supply Chain Management',
        categories: [
          { name: 'Inventory Management', subCategories: ['Demand Forecasting', 'Stock Optimization'] },
          { name: 'Transportation', subCategories: ['Route Optimization', 'Fleet Management'] }
        ]
      }
    ]
  }
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);

  useEffect(() => {
    // Load industry segments and match with available templates
    const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
    const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);
    
    if (selectedSegment) {
      // Map industry segment to available templates
      const templates = getTemplatesForIndustrySegment(selectedSegment.industrySegment);
      setAvailableTemplates(templates);
    }
  }, [wizardData.selectedIndustrySegment]);

  useEffect(() => {
    // Validate selection
    onValidationChange(selectedTemplate !== null);
  }, [selectedTemplate, onValidationChange]);

  const getTemplatesForIndustrySegment = (industrySegmentName: string) => {
    const templates = [];
    
    // Map industry segments to template keys
    const segmentToTemplateMap: { [key: string]: string[] } = {
      'Life Sciences': ['life-sciences'],
      'Manufacturing (Smart, Process, Discrete)': ['manufacturing'],
      'Logistics & Supply Chain': ['logistics']
    };

    const templateKeys = segmentToTemplateMap[industrySegmentName] || [];
    
    templateKeys.forEach(key => {
      if (INDUSTRY_TEMPLATES[key]) {
        templates.push({
          id: key,
          ...INDUSTRY_TEMPLATES[key]
        });
      }
    });

    return templates;
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    const template = availableTemplates.find(t => t.id === templateId);
    if (template) {
      // Convert template to wizard data format
      const templateData = {
        domainGroups: template.domainGroups || [],
        categories: [],
        subCategories: []
      };

      // Flatten the template structure
      template.domainGroups?.forEach((dg: any, dgIndex: number) => {
        dg.categories?.forEach((cat: any, catIndex: number) => {
          templateData.categories.push({
            id: `cat-${dgIndex}-${catIndex}`,
            name: cat.name,
            domainGroupIndex: dgIndex
          });
          
          cat.subCategories?.forEach((sub: string, subIndex: number) => {
            templateData.subCategories.push({
              id: `sub-${dgIndex}-${catIndex}-${subIndex}`,
              name: sub,
              categoryIndex: catIndex,
              domainGroupIndex: dgIndex
            });
          });
        });
      });

      onUpdate({ 
        manualData: templateData,
        selectedTemplate: templateId
      });
    }
  };

  const downloadTemplate = (templateId: string) => {
    // In real implementation, this would generate and download the template
    console.log('Downloading template:', templateId);
  };

  const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
  const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select Industry Template</h2>
        <p className="text-muted-foreground">
          Choose from pre-built domain group hierarchies for {selectedSegment?.industrySegment}
        </p>
      </div>

      {/* Industry Segment Info */}
      <Alert>
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          Templates are customized for your selected industry segment: <strong>{selectedSegment?.industrySegment}</strong>
        </AlertDescription>
      </Alert>

      {/* Available Templates */}
      {availableTemplates.length > 0 ? (
        <div className="grid gap-4">
          {availableTemplates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-colors ${
                selectedTemplate === template.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {template.name}
                  </div>
                  {selectedTemplate === template.id && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Domain Groups:</span>
                    <Badge variant="secondary">{template.domainGroups?.length || 0}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Categories:</span>
                    <Badge variant="secondary">
                      {template.domainGroups?.reduce((acc: number, dg: any) => acc + (dg.categories?.length || 0), 0) || 0}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Sub-Categories:</span>
                    <Badge variant="secondary">
                      {template.domainGroups?.reduce((acc: number, dg: any) => 
                        acc + (dg.categories?.reduce((catAcc: number, cat: any) => catAcc + (cat.subCategories?.length || 0), 0) || 0), 0) || 0}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadTemplate(template.id);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert>
          <AlertDescription>
            No pre-built templates are currently available for the selected industry segment. 
            You can use Excel upload or manual entry to create your domain group hierarchy.
          </AlertDescription>
        </Alert>
      )}

      {/* Template Preview */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Template Selected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Template "{availableTemplates.find(t => t.id === selectedTemplate)?.name}" is ready to use. 
              Click "Next" to proceed with the selected template.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TemplateSelector;
