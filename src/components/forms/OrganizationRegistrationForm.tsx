import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Building, Mail, Phone, User, Globe, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrganizationFormData {
  organizationName: string;
  organizationType: string;
  country: string;
  registeredAddress: string;
  websiteUrl: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  contactEmail: string;
  contactMobile: string;
}

const organizationTypes = [
  'Large Enterprise',
  'Start-up',
  'MSME',
  'Academic Institution',
  'Research Institution',
  'Non-Profit Organization / NGO',
  'Government Department / PSU',
  'Industry Association / Consortium',
  'Freelancer / Individual Consultant',
  'Think Tank / Policy Institute'
];

const countries = [
  'India',
  'USA',
  'Germany',
  'Canada',
  'Kenya',
  'Singapore',
  'UK',
  'Australia',
  'Japan',
  'France'
];

const sampleOrganizations = [
  {
    organizationName: 'NovaGrid Technologies',
    organizationType: 'Large Enterprise',
    country: 'India',
    registeredAddress: '201, Hi-Tech City, Hyderabad, Telangana',
    websiteUrl: 'https://novagridtech.com',
    contactPersonName: 'Meena Rao',
    contactPersonDesignation: 'Head of Partnerships',
    contactEmail: 'meena@novagridtech.com',
    contactMobile: '+91-9000000011'
  },
  {
    organizationName: 'AgileByte Innovations',
    organizationType: 'Start-up',
    country: 'USA',
    registeredAddress: '405 Maple Dr, Austin, TX',
    websiteUrl: 'https://agilebyte.io',
    contactPersonName: 'Jon Walters',
    contactPersonDesignation: 'CEO',
    contactEmail: 'jon@agilebyte.io',
    contactMobile: '+1-512-777-9001'
  },
  {
    organizationName: 'BioCore Labs Pvt. Ltd.',
    organizationType: 'MSME',
    country: 'India',
    registeredAddress: '18/3, Biotech Park, Pune',
    websiteUrl: 'https://biocorelabs.in',
    contactPersonName: 'Dr. Nisha Kumar',
    contactPersonDesignation: 'Founder',
    contactEmail: 'nisha@biocorelabs.in',
    contactMobile: '+91-9821212345'
  },
  {
    organizationName: 'Institute of Advanced Computing',
    organizationType: 'Academic Institution',
    country: 'Germany',
    registeredAddress: 'Campus Mitte, Munich',
    websiteUrl: 'https://iac.edu.de',
    contactPersonName: 'Prof. Klaus Weber',
    contactPersonDesignation: 'Dean',
    contactEmail: 'klaus@iac.edu.de',
    contactMobile: '+49-89-1234567'
  },
  {
    organizationName: 'Quantum Materials Research Centre',
    organizationType: 'Research Institution',
    country: 'Canada',
    registeredAddress: '77 Discovery Ave, Toronto',
    websiteUrl: 'https://qmrcentre.ca',
    contactPersonName: 'Dr. Linda Wu',
    contactPersonDesignation: 'Director',
    contactEmail: 'linda@qmrcentre.ca',
    contactMobile: '+1-416-990-1122'
  },
  {
    organizationName: 'GreenHope Foundation',
    organizationType: 'Non-Profit Organization / NGO',
    country: 'Kenya',
    registeredAddress: '12 Liberty St, Nairobi',
    websiteUrl: 'https://greenhope.org.ke',
    contactPersonName: 'Josephine Otieno',
    contactPersonDesignation: 'Program Manager',
    contactEmail: 'josephine@greenhope.org.ke',
    contactMobile: '+254-720-556678'
  },
  {
    organizationName: 'Digital Transformation Cell, Ministry of Education',
    organizationType: 'Government Department / PSU',
    country: 'India',
    registeredAddress: 'Shastri Bhawan, New Delhi',
    websiteUrl: 'https://digitaledu.gov.in',
    contactPersonName: 'Ramesh Naik',
    contactPersonDesignation: 'Joint Secretary',
    contactEmail: 'rnaik@digitaledu.gov.in',
    contactMobile: '+91-9810012345'
  },
  {
    organizationName: 'Federation of AI Startups',
    organizationType: 'Industry Association / Consortium',
    country: 'Singapore',
    registeredAddress: 'Tech Tower, Marina Bay',
    websiteUrl: 'https://aisg.org',
    contactPersonName: 'Lee Ming',
    contactPersonDesignation: 'Convenor',
    contactEmail: 'lee@aisg.org',
    contactMobile: '+65-8123-4567'
  },
  {
    organizationName: 'Ravi Deshmukh Advisory',
    organizationType: 'Freelancer / Individual Consultant',
    country: 'India',
    registeredAddress: '301 Skyline Towers, Nagpur',
    websiteUrl: '',
    contactPersonName: 'Ravi Deshmukh',
    contactPersonDesignation: 'Digital Consultant',
    contactEmail: 'ravi.consult@gmail.com',
    contactMobile: '+91-9898989898'
  },
  {
    organizationName: 'FuturePolicy Institute',
    organizationType: 'Think Tank / Policy Institute',
    country: 'UK',
    registeredAddress: '22 Parliament St, London',
    websiteUrl: 'https://futurepolicy.org',
    contactPersonName: 'Sarah MacGregor',
    contactPersonDesignation: 'Policy Fellow',
    contactEmail: 'sarah@futurepolicy.org',
    contactMobile: '+44-20-7788-4400'
  }
];

const OrganizationRegistrationForm = () => {
  const { toast } = useToast();
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<OrganizationFormData>({
    organizationName: '',
    organizationType: '',
    country: '',
    registeredAddress: '',
    websiteUrl: '',
    contactPersonName: '',
    contactPersonDesignation: '',
    contactEmail: '',
    contactMobile: ''
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Starting organization registration process...');
    
    // Basic validation
    const requiredFields = [
      'organizationName',
      'organizationType',
      'country',
      'registeredAddress',
      'contactPersonName',
      'contactPersonDesignation',
      'contactEmail',
      'contactMobile'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof OrganizationFormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      console.log('❌ Missing required fields:', missingFields);
      return;
    }

    if (!password || password.length < 6) {
      toast({
        title: "Password Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📝 Preparing registration data...');
      
      // Generate organization ID
      const organizationId = `ORG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare additional data for profile creation
      const additionalData = {
        organizationName: formData.organizationName,
        organizationId: organizationId,
        organizationType: formData.organizationType,
        entityType: 'Private Limited Company', // Default entity type
        contactPersonName: formData.contactPersonName,
        country: formData.country,
        countryCode: formData.contactMobile.split('-')[0] || '+1',
        address: formData.registeredAddress,
        website: formData.websiteUrl,
        phoneNumber: formData.contactMobile
      };

      console.log('🔐 Attempting to create account with email:', formData.contactEmail);
      console.log('📊 Additional profile data prepared');

      const { error } = await signUp(formData.contactEmail, password, additionalData);

      if (error) {
        console.error('❌ Registration failed:', error);
        
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          toast({
            title: "Registration Error",
            description: "This email is already registered. Please sign in instead or use a different email.",
            variant: "destructive"
          });
        } else if (error.message.includes('Invalid email')) {
          toast({
            title: "Registration Error",
            description: "Please enter a valid email address.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Registration Error",
            description: `Registration failed: ${error.message}`,
            variant: "destructive"
          });
        }
      } else {
        console.log('✅ Registration successful!');
        toast({
          title: "Registration Successful!",
          description: "Your organization has been registered successfully. You can now sign in.",
        });
        
        // Clear form
        setFormData({
          organizationName: '',
          organizationType: '',
          country: '',
          registeredAddress: '',
          websiteUrl: '',
          contactPersonName: '',
          contactPersonDesignation: '',
          contactEmail: '',
          contactMobile: ''
        });
        setPassword('');
        setConfirmPassword('');
        
        // Navigate to auth page for sign in
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Unexpected registration error:', error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred during registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillSampleData = (sampleOrg: typeof sampleOrganizations[0]) => {
    setFormData(sampleOrg);
    toast({
      title: "Sample Data Loaded",
      description: `Loaded data for ${sampleOrg.organizationName}`
    });
  };

  const clearForm = () => {
    setFormData({
      organizationName: '',
      organizationType: '',
      country: '',
      registeredAddress: '',
      websiteUrl: '',
      contactPersonName: '',
      contactPersonDesignation: '',
      contactEmail: '',
      contactMobile: ''
    });
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Organization Registration Form
          </CardTitle>
          <CardDescription>
            Register your organization for Solution Seeking or Solution Providing services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Organization Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="Enter organization name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationType">Organization Type *</Label>
                  <Select
                    value={formData.organizationType}
                    onValueChange={(value) => handleInputChange('organizationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Official Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="https://example.com"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredAddress">Registered Address *</Label>
                <Textarea
                  id="registeredAddress"
                  value={formData.registeredAddress}
                  onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
                  placeholder="Enter complete registered address"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Primary Contact Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                      placeholder="Enter contact person name"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPersonDesignation">Designation / Role *</Label>
                  <Input
                    id="contactPersonDesignation"
                    value={formData.contactPersonDesignation}
                    onChange={(e) => handleInputChange('contactPersonDesignation', e.target.value)}
                    placeholder="Enter designation or role"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email ID *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="contact@organization.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactMobile">Contact Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactMobile"
                      type="tel"
                      value={formData.contactMobile}
                      onChange={(e) => handleInputChange('contactMobile', e.target.value)}
                      placeholder="+1-xxx-xxx-xxxx"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Security</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 6 characters)"
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Registering Organization...
                  </>
                ) : (
                  'Register Organization'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={clearForm} disabled={isSubmitting}>
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sample Data Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Organizations</CardTitle>
          <CardDescription>
            Click on any organization below to populate the form with sample data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleOrganizations.map((org, index) => (
              <div
                key={index}
                onClick={() => fillSampleData(org)}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <h4 className="font-semibold text-sm">{org.organizationName}</h4>
                <p className="text-xs text-muted-foreground">{org.organizationType}</p>
                <p className="text-xs text-muted-foreground">{org.country}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationRegistrationForm;
