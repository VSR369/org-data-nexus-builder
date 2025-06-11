
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WizardData } from '@/types/wizardTypes';
import { IndustrySegment } from '@/types/industrySegments';
import { industrySegmentDataManager } from '../industrySegmentDataManager';

interface DomainGroupSetupProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const DomainGroupSetup: React.FC<DomainGroupSetupProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);

  // Get values from wizardData or use empty strings as defaults
  const domainGroupName = wizardData.selectedDomainGroup || '';
  const domainGroupDescription = wizardData.manualData?.domainGroupDescription || '';

  useEffect(() => {
    // Load industry segments from master data
    const loadedData = industrySegmentDataManager.loadData();
    setIndustrySegments(loadedData.industrySegments || []);
  }, []);

  useEffect(() => {
    // Validate inputs - require industry segment and domain group name
    const isValid = wizardData.selectedIndustrySegment && domainGroupName.trim().length > 0;
    console.log('DomainGroupSetup: Validation:', { 
      selectedIndustrySegment: wizardData.selectedIndustrySegment, 
      domainGroupName, 
      isValid 
    });
    
    onValidationChange(isValid);
  }, [wizardData.selectedIndustrySegment, domainGroupName, onValidationChange]);

  const handleIndustrySegmentChange = (value: string) => {
    console.log('DomainGroupSetup: Industry segment changed to:', value);
    onUpdate({ selectedIndustrySegment: value });
  };

  const handleDomainGroupNameChange = (value: string) => {
    console.log('DomainGroupSetup: Domain group name changed to:', value);
    onUpdate({ selectedDomainGroup: value });
  };

  const handleDomainGroupDescriptionChange = (value: string) => {
    console.log('DomainGroupSetup: Domain group description changed to:', value);
    onUpdate({ 
      manualData: {
        ...wizardData.manualData,
        domainGroupDescription: value,
        categories: wizardData.manualData?.categories || [],
        subCategories: wizardData.manualData?.subCategories || []
      }
    });
  };

  const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Domain Group Setup</h2>
        <p className="text-muted-foreground">
          Configure the industry segment and domain group for your hierarchy
        </p>
        {domainGroupName && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Creating Domain Group:</p>
            <p className="font-semibold text-primary">{domainGroupName}</p>
            {selectedSegment && (
              <p className="text-xs text-muted-foreground">in {selectedSegment.industrySegment}</p>
            )}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Industry Segment Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="industry-segment">Industry Segment *</Label>
            <Select value={wizardData.selectedIndustrySegment || ""} onValueChange={handleIndustrySegmentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select an industry segment" />
              </SelectTrigger>
              <SelectContent>
                {industrySegments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.industrySegment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSegment && selectedSegment.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {selectedSegment.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domain Group Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="domain-group-name">Domain Group Name *</Label>
            <Input
              id="domain-group-name"
              value={domainGroupName}
              onChange={(e) => handleDomainGroupNameChange(e.target.value)}
              placeholder="Enter domain group name"
            />
          </div>
          
          <div>
            <Label htmlFor="domain-group-description">Description (Optional)</Label>
            <Textarea
              id="domain-group-description"
              value={domainGroupDescription}
              onChange={(e) => handleDomainGroupDescriptionChange(e.target.value)}
              placeholder="Enter domain group description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupSetup;
