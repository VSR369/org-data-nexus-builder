
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import IndustrySegmentSection from './IndustrySegmentSection';
import InstitutionDetailsSection from './InstitutionDetailsSection';
import ProviderDetailsSection from './ProviderDetailsSection';
import BankingDetailsSection from './BankingDetailsSection';
import AdditionalInfoSection from './AdditionalInfoSection';
import CompetencyEvaluationTab from './CompetencyEvaluationTab';
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

  const handleInstitutionTabClick = () => {
    if (providerType === 'individual') {
      toast({
        title: "Institution Details Not Available",
        description: "You have chosen as an individual solution provider. Institution details are only available for organizations.",
        variant: "default"
      });
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

  const isInstitutionTabDisabled = providerType === 'individual';

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
          <TabsTrigger value="provider-details">Provider Details</TabsTrigger>
          <TabsTrigger 
            value="institution-details" 
            disabled={isInstitutionTabDisabled}
            onClick={handleInstitutionTabClick}
            className={isInstitutionTabDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Institution Details
          </TabsTrigger>
          <TabsTrigger value="banking-details">Banking Details</TabsTrigger>
          <TabsTrigger value="competency-evaluation">Competency Evaluation</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="mt-6">
          <div className="space-y-6">
            {/* Provider Role Selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Role</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select your role(s) on the platform
                </p>
              </div>
              
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
                <p className="text-sm text-destructive">Please select at least one provider role</p>
              )}
            </div>

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
          </div>
        </TabsContent>

        <TabsContent value="provider-details" className="mt-6">
          <ProviderDetailsSection
            formData={formData}
            updateFormData={onFormDataUpdate}
            invalidFields={invalidFields}
          />
        </TabsContent>

        <TabsContent value="institution-details" className="mt-6">
          <InstitutionDetailsSection
            formData={formData}
            updateFormData={onFormDataUpdate}
            providerType={providerType}
            invalidFields={invalidFields}
          />
        </TabsContent>

        <TabsContent value="banking-details" className="mt-6">
          <BankingDetailsSection
            formData={formData}
            updateFormData={onFormDataUpdate}
            providerType={providerType}
            invalidFields={invalidFields}
          />
        </TabsContent>

        <TabsContent value="competency-evaluation" className="mt-6">
          <CompetencyEvaluationTab
            selectedIndustrySegments={selectedIndustrySegments}
            formData={formData}
            onFormDataUpdate={onFormDataUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BasicInformationTab;
