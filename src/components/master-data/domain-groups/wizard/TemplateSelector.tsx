
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, CheckCircle, Info } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { createLifeSciencesHierarchyData } from '../lifeSciencesHierarchyData';
import { industrySegmentDataManager } from '../industrySegmentDataManager';

interface TemplateSelectorProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  industrySegments: string[];
  domainGroupsCount: number;
  categoriesCount: number;
  subCategoriesCount: number;
  loadData: () => any;
}

const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: 'life-sciences',
    name: 'Life Sciences & Pharmaceuticals',
    description: 'Comprehensive hierarchy covering drug development, clinical research, regulatory affairs, and manufacturing',
    industrySegments: ['Life Sciences', 'Pharmaceuticals', 'Healthcare'],
    domainGroupsCount: 4,
    categoriesCount: 13,
    subCategoriesCount: 52,
    loadData: createLifeSciencesHierarchyData
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  const [selectedSegmentName, setSelectedSegmentName] = useState<string>('');

  useEffect(() => {
    // Get selected industry segment name
    const industrySegments = industrySegmentDataManager.loadData().industrySegments || [];
    const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);
    setSelectedSegmentName(selectedSegment?.name || '');

    // Filter templates based on selected industry segment
    if (selectedSegment) {
      const compatibleTemplates = AVAILABLE_TEMPLATES.filter(template =>
        template.industrySegments.some(segmentName => 
          segmentName.toLowerCase().includes(selectedSegment.name.toLowerCase()) ||
          selectedSegment.name.toLowerCase().includes(segmentName.toLowerCase())
        )
      );
      setAvailableTemplates(compatibleTemplates);
    } else {
      setAvailableTemplates([]);
    }
  }, [wizardData.selectedIndustrySegment]);

  useEffect(() => {
    onValidationChange(!!selectedTemplate);
  }, [selectedTemplate, onValidationChange]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      try {
        const templateData = template.loadData();
        
        // Convert template data to wizard format
        const manualData = {
          domainGroups: templateData.newDomainGroups || [],
          categories: templateData.newCategories || [],
          subCategories: templateData.newSubCategories || []
        };
        
        onUpdate({ 
          manualData,
          selectedDomainGroup: templateData.newDomainGroups?.[0]?.name || ''
        });
      } catch (error) {
        console.error('Error loading template data:', error);
      }
    }
  };

  if (availableTemplates.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No templates are available for the selected industry segment: <strong>{selectedSegmentName}</strong>.
          Please use Manual Entry or Excel Upload instead.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Templates are filtered for your selected industry segment: <strong>{selectedSegmentName}</strong>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4">
        {availableTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all ${
              selectedTemplate === template.id 
                ? 'border-primary bg-primary/5 shadow-md' 
                : 'hover:shadow-md hover:border-primary/50'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">{template.domainGroupsCount}</div>
                  <div className="text-xs text-muted-foreground">Domain Groups</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{template.categoriesCount}</div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{template.subCategoriesCount}</div>
                  <div className="text-xs text-muted-foreground">Sub-Categories</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {template.industrySegments.map((segment) => (
                  <Badge key={segment} variant="secondary" className="text-xs">
                    {segment}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Template Selected</h3>
                <p className="text-sm text-green-700">
                  The {AVAILABLE_TEMPLATES.find(t => t.id === selectedTemplate)?.name} template 
                  has been loaded and is ready for review in the next step.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TemplateSelector;
