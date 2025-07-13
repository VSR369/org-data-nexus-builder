import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, FileText, Image, ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';
import { OrganizationFormData, MasterDataItem } from '@/types/organizationRegistration';
import { openFile } from '@/utils/fileViewing';
import { toast } from 'sonner';

interface OrganizationPreviewProps {
  formData: OrganizationFormData;
  countries: MasterDataItem[];
  organizationTypes: MasterDataItem[];
  entityTypes: MasterDataItem[];
  industrySegments: MasterDataItem[];
  onEdit: () => void;
  onRegister: () => void;
  isLoading: boolean;
}

export const OrganizationPreview: React.FC<OrganizationPreviewProps> = ({
  formData,
  countries,
  organizationTypes,
  entityTypes,
  industrySegments,
  onEdit,
  onRegister,
  isLoading
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const getNameById = (items: MasterDataItem[], id: string) => {
    return items.find(item => item.id === id)?.name || 'Not selected';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileClick = async (file: File, bucket: string) => {
    toast.info('Opening file...');
    await openFile(file, bucket);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Registration Preview</h1>
        <p className="text-muted-foreground">
          Please review your information before submitting your registration
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Organization Information
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Organization Name</h4>
                <p className="text-lg font-semibold">{formData.organizationName}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Organization ID</h4>
                <p className="text-lg font-mono">Will be auto-generated</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Organization Type</h4>
                <Badge variant="secondary">{getNameById(organizationTypes, formData.organizationTypeId)}</Badge>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Entity Type</h4>
                <Badge variant="secondary">{getNameById(entityTypes, formData.entityTypeId)}</Badge>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-medium text-sm text-muted-foreground">Industry Segment</h4>
                <Badge variant="outline">{getNameById(industrySegments, formData.industrySegmentId)}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Company Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  formData.companyProfileDocument 
                    ? 'cursor-pointer hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50' 
                    : ''
                }`}
                onClick={() => formData.companyProfileDocument && handleFileClick(formData.companyProfileDocument, 'organization-documents')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium">Company Profile Document</h4>
                  {formData.companyProfileDocument && (
                    <ExternalLink className="w-4 h-4 text-blue-500 ml-auto" />
                  )}
                </div>
                {formData.companyProfileDocument ? (
                  <div>
                    <p className="text-sm font-medium">{formData.companyProfileDocument.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(formData.companyProfileDocument.size)} • Click to view
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No document uploaded</p>
                )}
              </div>

              <div 
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  formData.companyLogo 
                    ? 'cursor-pointer hover:border-purple-300 hover:shadow-md hover:bg-purple-50/50' 
                    : ''
                }`}
                onClick={() => formData.companyLogo && handleFileClick(formData.companyLogo, 'organization-logos')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Image className="w-5 h-5 text-purple-500" />
                  <h4 className="font-medium">Company Logo</h4>
                  {formData.companyLogo && (
                    <ExternalLink className="w-4 h-4 text-purple-500 ml-auto" />
                  )}
                </div>
                {formData.companyLogo ? (
                  <div>
                    <p className="text-sm font-medium">{formData.companyLogo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(formData.companyLogo.size)} • Click to view
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No logo uploaded</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Contact & Location Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.website && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Website</h4>
                  <a 
                    href={formData.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {formData.website}
                  </a>
                </div>
              )}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Country</h4>
                <p>{getNameById(countries, formData.countryId)}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-medium text-sm text-muted-foreground">Address</h4>
                <p className="whitespace-pre-wrap">{formData.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Person Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Contact Person Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Contact Person Name</h4>
                <p className="font-semibold">{formData.contactPersonName}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
                <p>{formData.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Phone Number</h4>
                <p>{formData.countryCode ? `${formData.countryCode} ` : ''}{formData.phoneNumber}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Account Security</h4>
                <p className="text-green-600">Password configured ✓</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Terms and Conditions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
                <p className="text-xs text-muted-foreground">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  . I understand that my registration will be reviewed and approved within 2-3 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={onEdit}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit
          </Button>
          <Button 
            onClick={onRegister} 
            disabled={!termsAccepted || isLoading}
            className="min-w-48"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registering Organization...
              </>
            ) : (
              'Register Organization'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};