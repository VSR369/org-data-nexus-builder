
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
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import SolutionProviderCompetencyTab from './SolutionProviderCompetencyTab';

const SelfEnrollmentForm = () => {
  const { toast } = useToast();
  const [providerType, setProviderType] = useState('');
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState('');

  console.log('SelfEnrollmentForm - selectedIndustrySegment:', selectedIndustrySegment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Solution Provider enrollment submitted successfully",
    });
  };

  const handleIndustrySegmentChange = (value: string) => {
    console.log('Industry segment changed to:', value);
    setSelectedIndustrySegment(value);
  };

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
          <Tabs defaultValue="basic-details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic-details">Basic Details & Information</TabsTrigger>
              <TabsTrigger value="competency-assessment">Competency Assessment</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-details">
              <form onSubmit={handleSubmit} className="space-y-8">
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
                          <Input id="org-name" placeholder="Enter organization name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-type">Organization Type *</Label>
                          <Select>
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
                          <Select>
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
                          <Input id="website" type="url" placeholder="https://example.com" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="reg-address">Registered Address *</Label>
                          <Textarea id="reg-address" placeholder="Enter complete registered address" />
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
                      <Input id="first-name" placeholder="Enter first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name *</Label>
                      <Input id="last-name" placeholder="Enter last name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email ID *</Label>
                      <Input id="email" type="email" placeholder="Enter email address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input id="mobile" placeholder="Enter mobile number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input id="password" type="password" placeholder="Enter password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirm password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider-country">Country *</Label>
                      <Select>
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
                      <Input id="pin-code" placeholder="Enter pin code" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea id="address" placeholder="Enter complete address" />
                    </div>
                  </div>

                  {/* Banking Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Banking Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bank-account">Bank Account Number</Label>
                        <Input id="bank-account" placeholder="Enter bank account number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input id="bank-name" placeholder="Enter bank name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input id="branch" placeholder="Enter branch name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifsc">IFSC Code / UPI ID</Label>
                        <Input id="ifsc" placeholder="Enter IFSC code or UPI ID" />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Document Upload and Web Links */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  
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
                        <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/username" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="articles">Articles/Publications</Label>
                        <Input id="articles" type="url" placeholder="https://example.com/articles" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="websites">Personal/Professional Website</Label>
                        <Input id="websites" type="url" placeholder="https://yourwebsite.com" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" className="flex-1">
                    Submit Enrollment
                  </Button>
                  <Button type="button" variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="competency-assessment">
              <SolutionProviderCompetencyTab selectedIndustrySegment={selectedIndustrySegment} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfEnrollmentForm;
