
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Upload, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const SelfEnrollmentForm = () => {
  const { toast } = useToast();
  const [providerType, setProviderType] = useState('');
  const [competencies, setCompetencies] = useState([{
    group: '',
    category: '',
    subCategory: '',
    capability: ''
  }]);

  const handleAddCompetency = () => {
    setCompetencies([...competencies, {
      group: '',
      category: '',
      subCategory: '',
      capability: ''
    }]);
  };

  const handleRemoveCompetency = (index: number) => {
    setCompetencies(competencies.filter((_, i) => i !== index));
  };

  const handleCompetencyChange = (index: number, field: string, value: string) => {
    const updated = [...competencies];
    updated[index] = { ...updated[index], [field]: value };
    setCompetencies(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Solution Provider enrollment submitted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Self Enrollment - Solution Provider</CardTitle>
          <CardDescription>
            Register as a Solution Provider to showcase your expertise and connect with organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Industry Segment */}
            <div className="space-y-2">
              <Label htmlFor="industry-segment">Industry Segment *</Label>
              <Select>
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

            {/* Competency Assessment */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Solution Provider Competency Assessment Parameters</h3>
                <Button type="button" onClick={handleAddCompetency} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Competency
                </Button>
              </div>

              {competencies.map((competency, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Competency {index + 1}</h4>
                    {competencies.length > 1 && (
                      <Button 
                        type="button" 
                        onClick={() => handleRemoveCompetency(index)}
                        variant="destructive" 
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Competency Group *</Label>
                      <Select value={competency.group} onValueChange={(value) => handleCompetencyChange(index, 'group', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select competency group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="business">Business Process</SelectItem>
                          <SelectItem value="finance">Finance & Accounting</SelectItem>
                          <SelectItem value="marketing">Marketing & Sales</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Competency Category *</Label>
                      <Select value={competency.category} onValueChange={(value) => handleCompetencyChange(index, 'category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select competency category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="software-dev">Software Development</SelectItem>
                          <SelectItem value="data-analytics">Data Analytics</SelectItem>
                          <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                          <SelectItem value="ai-ml">AI/ML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Competency Sub-Category *</Label>
                      <Select value={competency.subCategory} onValueChange={(value) => handleCompetencyChange(index, 'subCategory', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select competency sub-category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web-dev">Web Development</SelectItem>
                          <SelectItem value="mobile-dev">Mobile Development</SelectItem>
                          <SelectItem value="backend-dev">Backend Development</SelectItem>
                          <SelectItem value="frontend-dev">Frontend Development</SelectItem>
                          <SelectItem value="full-stack">Full Stack Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Capability Level *</Label>
                      <Select value={competency.capability} onValueChange={(value) => handleCompetencyChange(index, 'capability', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select capability level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="guru">Guru</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfEnrollmentForm;
