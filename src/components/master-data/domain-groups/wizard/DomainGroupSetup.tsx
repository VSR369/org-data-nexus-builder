
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, FolderTree } from 'lucide-react';
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
        
        {/* Enhanced Visual Summary */}
        {(selectedSegment || domainGroupName) && (
          <div className="mt-6 p-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl">
            <div className="space-y-3">
              {/* Industry Segment - Large Font */}
              {selectedSegment && (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary mb-1">{selectedSegment.industrySegment}</p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                      Industry Segment
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* Domain Group Name - Underneath */}
              {domainGroupName && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center">
                    <FolderTree className="w-3 h-3 text-secondary-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-secondary-foreground">{domainGroupName}</p>
                    <Badge variant="outline" className="text-xs">
                      Domain Group
                    </Badge>
                  </div>
                </div>
              )}
            </div>
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
