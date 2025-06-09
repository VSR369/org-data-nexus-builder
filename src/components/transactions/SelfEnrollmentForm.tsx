
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SolutionProviderCompetencyTab from './SolutionProviderCompetencyTab';
import IndustrySegmentSection from './enrollment/IndustrySegmentSection';
import InstitutionDetailsSection from './enrollment/InstitutionDetailsSection';
import ProviderDetailsSection from './enrollment/ProviderDetailsSection';
import BankingDetailsSection from './enrollment/BankingDetailsSection';
import AdditionalInfoSection from './enrollment/AdditionalInfoSection';
import { FormData } from './enrollment/types';
import { validateRequiredFields } from './enrollment/utils/formValidation';

const SelfEnrollmentForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic-details');
  const [providerType, setProviderType] = useState('');
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState('');
  
  // Form state for required fields
  const [formData, setFormData] = useState<FormData>({
    // Institution fields (conditional)
    orgName: '',
    orgType: '',
    orgCountry: '',
    regAddress: '',
    
    // Provider details (required)
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    providerCountry: '',
    pinCode: '',
    address: '',
    
    // Optional fields
    website: '',
    bankAccount: '',
    bankName: '',
    branch: '',
    ifsc: '',
    linkedin: '',
    articles: '',
    websites: ''
  });

  const [competencyCompleted, setCompetencyCompleted] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  console.log('SelfEnrollmentForm - selectedIndustrySegment:', selectedIndustrySegment);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTabChange = (value: string) => {
    if (value === 'competency-assessment') {
      if (!validateRequiredFields(formData, providerType, selectedIndustrySegment)) {
        setShowValidationError(true);
        toast({
          title: "Required Fields Missing",
          description: "Please complete all required fields in Basic Details & Information before proceeding to Competency Assessment.",
          variant: "destructive"
        });
        return;
      }
      setShowValidationError(false);
    }
    setActiveTab(value);
  };

  const handleSubmitEnrollment = () => {
    if (!validateRequiredFields(formData, providerType, selectedIndustrySegment)) {
      toast({
        title: "Required Fields Missing",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!competencyCompleted) {
      toast({
        title: "Competency Assessment Required",
        description: "Please complete the Competency Assessment before submitting your enrollment.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Solution Provider enrollment submitted successfully",
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your enrollment has been saved as a draft",
    });
  };

  const handleIndustrySegmentChange = (value: string) => {
    console.log('Industry segment changed to:', value);
    setSelectedIndustrySegment(value);
  };

  const isBasicDetailsComplete = validateRequiredFields(formData, providerType, selectedIndustrySegment);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solution Provider Enrollment</CardTitle>
          <CardDescription>
            Register as a Solution Provider to showcase your expertise and connect with organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic-details">Basic Details & Information</TabsTrigger>
              <TabsTrigger 
                value="competency-assessment" 
                disabled={!isBasicDetailsComplete}
                className="data-[state=disabled]:opacity-50 data-[state=disabled]:cursor-not-allowed"
              >
                Competency Assessment
                {!isBasicDetailsComplete && <AlertCircle className="w-4 h-4 ml-2" />}
              </TabsTrigger>
            </TabsList>

            {showValidationError && !isBasicDetailsComplete && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please complete all required fields (marked with *) in Basic Details & Information to access Competency Assessment.
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="basic-details">
              <form className="space-y-8">
                <IndustrySegmentSection
                  selectedIndustrySegment={selectedIndustrySegment}
                  onIndustrySegmentChange={handleIndustrySegmentChange}
                />

                <Separator />

                {/* Solution Provider Enrollment Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Solution Provider Enrollment Details</h3>
                  
                  {/* Individual/Institution Selection */}
                  <div className="space-y-3">
                    <Label>Provider Type *</Label>
                    <RadioGroup value={providerType} onValueChange={setProviderType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual">Individual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="institution" id="institution" />
                        <Label htmlFor="institution">Institution</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Institution Details */}
                  {providerType === 'institution' && (
                    <InstitutionDetailsSection
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  )}
                </div>

                <Separator />

                <ProviderDetailsSection
                  formData={formData}
                  updateFormData={updateFormData}
                />

                <BankingDetailsSection
                  formData={formData}
                  updateFormData={updateFormData}
                />

                <Separator />

                <AdditionalInfoSection
                  formData={formData}
                  updateFormData={updateFormData}
                />

                <div className="flex gap-4 pt-6">
                  <Button 
                    type="button" 
                    onClick={handleSubmitEnrollment}
                    className="flex-1"
                    disabled={!isBasicDetailsComplete || !competencyCompleted}
                  >
                    Submit Enrollment
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleSaveDraft}
                  >
                    Save as Draft
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="competency-assessment">
              <SolutionProviderCompetencyTab 
                selectedIndustrySegment={selectedIndustrySegment}
                onCompetencyComplete={setCompetencyCompleted}
                onSubmitEnrollment={handleSubmitEnrollment}
                onSaveDraft={handleSaveDraft}
                isSubmitEnabled={isBasicDetailsComplete}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfEnrollmentForm;
