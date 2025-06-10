
import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import IndustrySegmentSection from './IndustrySegmentSection';
import ProviderDetailsSection from './ProviderDetailsSection';
import InstitutionDetailsSection from './InstitutionDetailsSection';
import BankingDetailsSection from './BankingDetailsSection';
import { FormData } from './types';

interface IndustrySegment {
  id: string;
  industrySegment: string;
  description: string;
}

interface BasicInformationTabProps {
  selectedIndustrySegments: string[];
  onAddIndustrySegment: (value: string) => void;
  onRemoveIndustrySegment: (value: string) => void;
  providerType: string;
  onProviderTypeChange: (value: string) => void;
  formData: FormData;
  onFormDataUpdate: (field: string, value: string | string[]) => void;
  invalidFields?: Set<string>;
}

const BasicInformationTab: React.FC<BasicInformationTabProps> = ({
  selectedIndustrySegments,
  onAddIndustrySegment,
  onRemoveIndustrySegment,
  providerType,
  onProviderTypeChange,
  formData,
  onFormDataUpdate,
  invalidFields = new Set()
}) => {
  const { toast } = useToast();
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);

  // Load industry segments from master data
  useEffect(() => {
    const loadIndustrySegments = () => {
      try {
        const savedData = localStorage.getItem('master_data_industry_segments');
        if (savedData) {
          const data = JSON.parse(savedData);
          
          // Handle the correct data structure with industrySegments property
          if (data && data.industrySegments && Array.isArray(data.industrySegments)) {
            console.log('Loaded industry segments from master data:', data.industrySegments);
            setIndustrySegments(data.industrySegments);
          } else {
            console.log('Invalid industry segments data structure');
            setIndustrySegments([]);
          }
        } else {
          console.log('No industry segments found in master data');
          setIndustrySegments([]);
        }
      } catch (error) {
        console.error('Error loading industry segments:', error);
        setIndustrySegments([]);
      }
    };

    loadIndustrySegments();
  }, []);

  const handleProviderRoleChange = (role: string, checked: boolean) => {
    const currentRoles = formData.providerRoles || [];
    
    if (role === 'both') {
      // If "Both" is selected, set both roles or clear all
      if (checked) {
        onFormDataUpdate('providerRoles', ['solution-provider', 'solution-assessor']);
      } else {
        onFormDataUpdate('providerRoles', []);
      }
    } else {
      // Handle individual role selection
      let newRoles;
      if (checked) {
        newRoles = [...currentRoles.filter(r => r !== 'both'), role];
      } else {
        newRoles = currentRoles.filter(r => r !== role && r !== 'both');
      }
      
      // If both individual roles are selected, also check "both"
      if (newRoles.includes('solution-provider') && newRoles.includes('solution-assessor')) {
        newRoles = ['solution-provider', 'solution-assessor', 'both'];
      }
      
      onFormDataUpdate('providerRoles', newRoles);
    }
  };

  const handleAddIndustrySegment = (segmentId: string) => {
    if (!selectedIndustrySegments.includes(segmentId)) {
      onAddIndustrySegment(segmentId);
    }
  };

  const getIndustrySegmentName = (segmentId: string) => {
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.industrySegment : segmentId;
  };

  const availableSegments = industrySegments.filter(
    segment => !selectedIndustrySegments.includes(segment.id)
  );

  const currentRoles = formData.providerRoles || [];
  const isBothSelected = currentRoles.includes('both') || 
    (currentRoles.includes('solution-provider') && currentRoles.includes('solution-assessor'));

  return (
    <div className="space-y-6">
      {/* Provider Role Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provider Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="solution-provider"
                checked={currentRoles.includes('solution-provider')}
                onCheckedChange={(checked) => 
                  handleProviderRoleChange('solution-provider', checked as boolean)
                }
                className={invalidFields.has('providerRoles') ? 'border-destructive' : ''}
              />
              <Label htmlFor="solution-provider" className="font-normal">
                Solution Provider
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="solution-assessor"
                checked={currentRoles.includes('solution-assessor')}
                onCheckedChange={(checked) => 
                  handleProviderRoleChange('solution-assessor', checked as boolean)
                }
                className={invalidFields.has('providerRoles') ? 'border-destructive' : ''}
              />
              <Label htmlFor="solution-assessor" className="font-normal">
                Solution Assessor
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="both-roles"
                checked={isBothSelected}
                onCheckedChange={(checked) => 
                  handleProviderRoleChange('both', checked as boolean)
                }
                className={invalidFields.has('providerRoles') ? 'border-destructive' : ''}
              />
              <Label htmlFor="both-roles" className="font-normal">
                Both
              </Label>
            </div>
          </div>
          
          {invalidFields.has('providerRoles') && (
            <p className="text-sm text-destructive mt-2">Please select at least one provider role</p>
          )}
        </CardContent>
      </Card>

      {/* Industry Segment Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Industry Segments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {industrySegments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">
                No industry segments found. Please configure industry segments in Master Data first.
              </p>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="segment-select">Select Industry Segment</Label>
                <Select onValueChange={handleAddIndustrySegment}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select industry segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{segment.industrySegment}</span>
                          {segment.description && (
                            <span className="text-xs text-muted-foreground">{segment.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedIndustrySegments.length > 0 && (
                <div>
                  <Label>Selected Industry Segments:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedIndustrySegments.map((segmentId) => (
                      <Badge key={segmentId} variant="secondary" className="flex items-center gap-1">
                        {getIndustrySegmentName(segmentId)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => onRemoveIndustrySegment(segmentId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {invalidFields.has('industrySegments') && (
            <p className="text-sm text-destructive">Please select at least one industry segment</p>
          )}
        </CardContent>
      </Card>

      <IndustrySegmentSection
        selectedIndustrySegments={selectedIndustrySegments}
        onAddIndustrySegment={onAddIndustrySegment}
        onRemoveIndustrySegment={onRemoveIndustrySegment}
        providerType={providerType}
        onProviderTypeChange={onProviderTypeChange}
        invalidFields={invalidFields}
        providerRoles={formData.providerRoles}
      />

      <ProviderDetailsSection
        formData={formData}
        updateFormData={onFormDataUpdate}
        invalidFields={invalidFields}
      />

      {providerType === 'organization' && (
        <InstitutionDetailsSection
          formData={formData}
          updateFormData={onFormDataUpdate}
          providerType={providerType}
          invalidFields={invalidFields}
        />
      )}

      <BankingDetailsSection
        formData={formData}
        updateFormData={onFormDataUpdate}
        providerType={providerType}
        invalidFields={invalidFields}
      />
    </div>
  );
};

export default BasicInformationTab;
