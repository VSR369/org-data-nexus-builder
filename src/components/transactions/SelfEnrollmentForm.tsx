
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SolutionProviderCompetencyTab from './SolutionProviderCompetencyTab';

const SelfEnrollmentForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic-details');
  const [providerType, setProviderType] = useState('');
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState('');
  
  // Form state for required fields
  const [formData, setFormData] = useState({
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

  const validateRequiredFields = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'mobile', 'password', 'confirmPassword',
      'providerCountry', 'pinCode', 'address'
    ];

    // Add institution fields if provider type is institution
    if (providerType === 'institution') {
      requiredFields.push('orgName', 'orgType', 'orgCountry', 'regAddress');
    }

    // Check if industry segment and provider type are selected
    if (!selectedIndustrySegment || !providerType) {
      return false;
    }

    // Check all required fields
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return false;
      }
    }

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      return false;
    }

    return true;
  };

  const handleTabChange = (value: string) => {
    if (value === 'competency-assessment') {
      if (!validateRequiredFields()) {
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

  const handleSubmitEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRequiredFields()) {
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

  const isBasicDetailsComplete = validateRequiredFields();

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
                {/* Industry Segment */}
                <div className="space-y-2">
                  <Label htmlFor="industry-segment">Industry Segment *</Label>
                  <Select value={selectedIndustrySegment} onValueChange={handleIndustrySegmentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Industry Segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bfsi">Banking, Financial Services & Insurance (BFSI)</SelectItem>
                      <SelectItem value="retail">Retail & E-Commerce</SelectItem>
                      <SelectItem value="healthcare">Healthcare & Life Sciences</SelectItem>
                      <SelectItem value="it">Information Technology & Software Services</SelectItem>
                      <SelectItem value="telecom">Telecommunications</SelectItem>
                      <SelectItem value="education">Education & EdTech</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="logistics">Logistics & Supply Chain</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedIndustrySegment && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedIndustrySegment}
                    </p>
                  )}
                </div>

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
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                      <h4 className="font-medium">Institution Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="org-name">Organization Name *</Label>
                          <Input 
                            id="org-name" 
                            placeholder="Enter organization name"
                            value={formData.orgName}
                            onChange={(e) => updateFormData('orgName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-type">Organization Type *</Label>
                          <Select value={formData.orgType} onValueChange={(value) => updateFormData('orgType', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="corporation">Corporation</SelectItem>
                              <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                              <SelectItem value="ngo">NGO</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-country">Country *</Label>
                          <Select value={formData.orgCountry} onValueChange={(value) => updateFormData('orgCountry', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in">India</SelectItem>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="au">Australia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Official Website URL</Label>
                          <Input 
                            id="website" 
                            type="url" 
                            placeholder="https://example.com"
                            value={formData.website}
                            onChange={(e) => updateFormData('website', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="reg-address">Registered Address *</Label>
                          <Textarea 
                            id="reg-address" 
                            placeholder="Enter complete registered address"
                            value={formData.regAddress}
                            onChange={(e) => updateFormData('regAddress', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Solution Provider Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Solution Provider Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name *</Label>
                      <Input 
                        id="first-name" 
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name *</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email ID *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input 
                        id="mobile" 
                        placeholder="Enter mobile number"
                        value={formData.mobile}
                        onChange={(e) => updateFormData('mobile', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider-country">Country *</Label>
                      <Select value={formData.providerCountry} onValueChange={(value) => updateFormData('providerCountry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pin-code">Pin Code *</Label>
                      <Input 
                        id="pin-code" 
                        placeholder="Enter pin code"
                        value={formData.pinCode}
                        onChange={(e) => updateFormData('pinCode', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea 
                        id="address" 
                        placeholder="Enter complete address"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Banking Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Banking Details (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bank-account">Bank Account Number</Label>
                        <Input 
                          id="bank-account" 
                          placeholder="Enter bank account number"
                          value={formData.bankAccount}
                          onChange={(e) => updateFormData('bankAccount', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input 
                          id="bank-name" 
                          placeholder="Enter bank name"
                          value={formData.bankName}
                          onChange={(e) => updateFormData('bankName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input 
                          id="branch" 
                          placeholder="Enter branch name"
                          value={formData.branch}
                          onChange={(e) => updateFormData('branch', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifsc">IFSC Code / UPI ID</Label>
                        <Input 
                          id="ifsc" 
                          placeholder="Enter IFSC code or UPI ID"
                          value={formData.ifsc}
                          onChange={(e) => updateFormData('ifsc', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Document Upload and Web Links */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Additional Information (Optional)</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-upload">Upload Detailed Profile (Document)</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop your profile document
                        </p>
                        <Input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input 
                          id="linkedin" 
                          type="url" 
                          placeholder="https://linkedin.com/in/username"
                          value={formData.linkedin}
                          onChange={(e) => updateFormData('linkedin', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="articles">Articles/Publications</Label>
                        <Input 
                          id="articles" 
                          type="url" 
                          placeholder="https://example.com/articles"
                          value={formData.articles}
                          onChange={(e) => updateFormData('articles', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="websites">Personal/Professional Website</Label>
                        <Input 
                          id="websites" 
                          type="url" 
                          placeholder="https://yourwebsite.com"
                          value={formData.websites}
                          onChange={(e) => updateFormData('websites', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

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
