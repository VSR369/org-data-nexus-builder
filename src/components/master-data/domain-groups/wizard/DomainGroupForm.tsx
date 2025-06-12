
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndustrySegment } from '@/types/industrySegments';
import { WizardData } from '@/types/wizardTypes';

interface DomainGroupFormProps {
  wizardData: WizardData;
  industrySegments: IndustrySegment[];
  onUpdate: (updates: Partial<WizardData>) => void;
}

const DomainGroupForm: React.FC<DomainGroupFormProps> = ({
  wizardData,
  industrySegments,
  onUpdate
}) => {
  const domainGroupName = wizardData.selectedDomainGroup || '';
  const domainGroupDescription = wizardData.manualData?.domainGroupDescription || '';

  const handleIndustrySegmentChange = (value: string) => {
    console.log('DomainGroupForm: Industry segment changed to:', value);
    onUpdate({ selectedIndustrySegment: value });
  };

  const handleDomainGroupNameChange = (value: string) => {
    console.log('DomainGroupForm: Domain group name changed to:', value);
    onUpdate({ selectedDomainGroup: value });
  };

  const handleDomainGroupDescriptionChange = (value: string) => {
    console.log('DomainGroupForm: Domain group description changed to:', value);
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
    <>
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
    </>
  );
};

export default DomainGroupForm;
