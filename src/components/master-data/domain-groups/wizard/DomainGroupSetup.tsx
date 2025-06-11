
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { WizardData } from '@/types/wizardTypes';
import { industrySegmentDataManager } from '../industrySegmentDataManager';

interface DomainGroupSetupProps {
  wizardData: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

const DomainGroupSetup: React.FC<DomainGroupSetupProps> = ({
  wizardData,
  onUpdate,
  onValidationChange
}) => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<IndustrySegment | null>(null);
  const [domainGroupName, setDomainGroupName] = useState('');
  const [domainGroupDescription, setDomainGroupDescription] = useState('');

  useEffect(() => {
    // Load industry segments from master data
    const loadIndustrySegments = () => {
      try {
        const segments = industrySegmentDataManager.loadData();
        console.log('Loaded industry segments for wizard:', segments);
        setIndustrySegments(segments.industrySegments || []);
      } catch (error) {
        console.error('Error loading industry segments:', error);
        setIndustrySegments([]);
      }
    };

    loadIndustrySegments();
  }, []);

  useEffect(() => {
    const isValid = !!(
      wizardData.selectedIndustrySegment && 
      domainGroupName.trim()
    );
    onValidationChange(isValid);
  }, [wizardData.selectedIndustrySegment, domainGroupName, onValidationChange]);

  const handleIndustrySegmentChange = (segmentId: string) => {
    const segment = industrySegments.find(s => s.id === segmentId);
    setSelectedSegment(segment || null);
    onUpdate({ selectedIndustrySegment: segmentId });
  };

  const handleDomainGroupNameChange = (value: string) => {
    setDomainGroupName(value);
    onUpdate({ 
      selectedDomainGroup: value,
      manualData: {
        ...wizardData.manualData,
        domainGroups: [{
          name: value,
          description: domainGroupDescription
        }]
      }
    });
  };

  const handleDescriptionChange = (value: string) => {
    setDomainGroupDescription(value);
    onUpdate({
      manualData: {
        ...wizardData.manualData,
        domainGroups: [{
          name: domainGroupName,
          description: value
        }]
      }
    });
  };

  if (industrySegments.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No industry segments found in master data. Please configure industry segments first before creating domain groups.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Domain Group Setup</h2>
        <p className="text-muted-foreground">
          Configure the industry segment and domain group details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Industry Segment & Domain Group</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Industry Segment Selection */}
          <div className="space-y-2">
            <Label htmlFor="industry-segment">Industry Segment *</Label>
            <Select 
              value={wizardData.selectedIndustrySegment} 
              onValueChange={handleIndustrySegmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an industry segment" />
              </SelectTrigger>
              <SelectContent>
                {industrySegments
                  .filter(segment => segment.isActive)
                  .map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      <div className="flex flex-col">
                        <span>{segment.name}</span>
                        {segment.code && (
                          <span className="text-xs text-muted-foreground">
                            Code: {segment.code}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {selectedSegment?.description && (
              <p className="text-xs text-muted-foreground">
                {selectedSegment.description}
              </p>
            )}
          </div>

          {/* Domain Group Name */}
          <div className="space-y-2">
            <Label htmlFor="domain-group-name">Domain Group Name *</Label>
            <Input
              id="domain-group-name"
              placeholder="Enter domain group name"
              value={domainGroupName}
              onChange={(e) => handleDomainGroupNameChange(e.target.value)}
            />
          </div>

          {/* Domain Group Description */}
          <div className="space-y-2">
            <Label htmlFor="domain-group-description">Domain Group Description</Label>
            <Textarea
              id="domain-group-description"
              placeholder="Enter domain group description (optional)"
              value={domainGroupDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={3}
            />
          </div>

          {/* Data Source Specific Instructions */}
          {wizardData.dataSource === 'excel' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                When uploading Excel files, make sure the "Industry Segment" column matches exactly: 
                <strong> {selectedSegment?.name}</strong>
              </AlertDescription>
            </Alert>
          )}

          {wizardData.dataSource === 'template' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Templates will be filtered to show only those available for: 
                <strong> {selectedSegment?.name}</strong>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {wizardData.selectedIndustrySegment && domainGroupName && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Configuration Summary</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Industry Segment:</span>{' '}
                <span className="font-medium">{selectedSegment?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Domain Group:</span>{' '}
                <span className="font-medium">{domainGroupName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Data Source:</span>{' '}
                <span className="font-medium capitalize">{wizardData.dataSource}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DomainGroupSetup;
