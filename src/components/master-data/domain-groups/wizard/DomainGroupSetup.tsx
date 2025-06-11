
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
  const [domainGroupName, setDomainGroupName] = useState('');
  const [domainGroupDescription, setDomainGroupDescription] = useState('');

  useEffect(() => {
    // Load industry segments from master data
    const loadedData = industrySegmentDataManager.loadData();
    setIndustrySegments(loadedData.industrySegments || []);
  }, []);

  // Auto-populate from Excel data if available
  useEffect(() => {
    if (wizardData.dataSource === 'excel' && wizardData.excelData?.data.length > 0) {
      const firstRow = wizardData.excelData.data[0];
      console.log('DomainGroupSetup: Auto-populating from Excel data:', firstRow);
      
      // Find matching industry segment
      const matchingSegment = industrySegments.find(
        segment => segment.industrySegment === firstRow.industrySegment
      );
      
      if (matchingSegment) {
        onUpdate({ selectedIndustrySegment: matchingSegment.id });
      }
      
      if (firstRow.domainGroup) {
        setDomainGroupName(firstRow.domainGroup);
        onUpdate({ selectedDomainGroup: firstRow.domainGroup });
      }
      
      if (firstRow.domainGroupDescription) {
        setDomainGroupDescription(firstRow.domainGroupDescription);
      }
    }
  }, [wizardData.excelData, industrySegments, wizardData.dataSource, onUpdate]);

  useEffect(() => {
    // Validate step based on data source
    let isValid = false;
    
    if (wizardData.dataSource === 'excel' && wizardData.excelData?.data.length > 0) {
      // For Excel uploads, validate if we have the required data in Excel
      const hasIndustrySegment = wizardData.excelData.data.some(row => row.industrySegment);
      const hasDomainGroup = wizardData.excelData.data.some(row => row.domainGroup);
      isValid = hasIndustrySegment && hasDomainGroup;
      console.log('DomainGroupSetup: Excel validation:', { hasIndustrySegment, hasDomainGroup, isValid });
    } else {
      // For manual entry, validate manual inputs
      isValid = wizardData.selectedIndustrySegment && domainGroupName.trim().length > 0;
      console.log('DomainGroupSetup: Manual validation:', { selectedIndustrySegment: wizardData.selectedIndustrySegment, domainGroupName, isValid });
    }
    
    onValidationChange(isValid);
  }, [wizardData.selectedIndustrySegment, domainGroupName, wizardData.dataSource, wizardData.excelData, onValidationChange]);

  const handleIndustrySegmentChange = (value: string) => {
    onUpdate({ selectedIndustrySegment: value });
  };

  const handleDomainGroupNameChange = (value: string) => {
    setDomainGroupName(value);
    onUpdate({ selectedDomainGroup: value });
  };

  const selectedSegment = industrySegments.find(s => s.id === wizardData.selectedIndustrySegment);

  // Show different UI for Excel uploads
  if (wizardData.dataSource === 'excel' && wizardData.excelData?.data.length > 0) {
    const firstRow = wizardData.excelData.data[0];
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Domain Group Setup</h2>
          <p className="text-muted-foreground">
            Configuration extracted from your Excel file
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Excel Data Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Industry Segment</Label>
                <p className="text-sm font-medium">{firstRow.industrySegment}</p>
              </div>
              <div>
                <Label>Domain Group</Label>
                <p className="text-sm font-medium">{firstRow.domainGroup}</p>
              </div>
            </div>
            {firstRow.domainGroupDescription && (
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">{firstRow.domainGroupDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show manual form for non-Excel uploads
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Domain Group Setup</h2>
        <p className="text-muted-foreground">
          Configure the industry segment and domain group for your hierarchy
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Industry Segment Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="industry-segment">Industry Segment *</Label>
            <Select onValueChange={handleIndustrySegmentChange} value={wizardData.selectedIndustrySegment}>
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
              onChange={(e) => setDomainGroupDescription(e.target.value)}
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
