import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileText, Shield } from 'lucide-react';

interface TermsAndConditionsCardProps {
  membershipTermsAccepted: boolean;
  engagementTermsAccepted: boolean;
  onMembershipTermsChange: (accepted: boolean) => void;
  onEngagementTermsChange: (accepted: boolean) => void;
  selectedMembershipStatus: 'active' | 'inactive' | null;
  selectedEngagementModel: string | null;
  showMembershipTerms: boolean;
  showEngagementTerms: boolean;
}

export const TermsAndConditionsCard: React.FC<TermsAndConditionsCardProps> = ({
  membershipTermsAccepted,
  engagementTermsAccepted,
  onMembershipTermsChange,
  onEngagementTermsChange,
  selectedMembershipStatus,
  selectedEngagementModel,
  showMembershipTerms,
  showEngagementTerms
}) => {
  if (!showMembershipTerms && !showEngagementTerms) {
    return null;
  }

  const getMembershipTermsContent = () => {
    return `
MEMBERSHIP TERMS AND CONDITIONS

1. MEMBERSHIP BENEFITS
   - Access to platform features and services
   - Priority customer support
   - Exclusive discounts on platform fees
   - Advanced analytics and reporting tools

2. PAYMENT TERMS
   - Annual membership fees are due upon activation
   - Fees are non-refundable once processed
   - Automatic renewal unless cancelled 30 days prior

3. MEMBER RESPONSIBILITIES
   - Maintain accurate profile information
   - Comply with platform usage policies
   - Use services in accordance with terms

4. TERMINATION
   - Either party may terminate with 30 days notice
   - No refund for unused portion of membership period
   - Access continues until membership period expires

By accepting these terms, you agree to the membership conditions outlined above.
    `;
  };

  const getEngagementModelTermsContent = (model: string) => {
    const baseTerms = `
ENGAGEMENT MODEL TERMS AND CONDITIONS

Selected Model: ${model}

1. SERVICE SCOPE
   - Access to platform features specific to ${model}
   - Support for integration and implementation
   - Performance monitoring and reporting

2. PAYMENT STRUCTURE
`;

    switch (model) {
      case 'Market Place':
      case 'Aggregator':
      case 'Market Place & Aggregator':
        return baseTerms + `
   - Platform fees charged as percentage of solution fees
   - Fees deducted automatically from transactions
   - Monthly billing cycle for percentage-based fees

3. MARKETPLACE SPECIFIC TERMS
   - Compliance with marketplace policies
   - Quality standards for solutions
   - Customer dispute resolution procedures
        `;
      
      case 'Platform as a Service':
        return baseTerms + `
   - Fixed recurring fees based on selected frequency
   - Payment due at beginning of billing cycle
   - Service suspension for non-payment after 7 days

3. PLATFORM SERVICE TERMS
   - Service level agreements apply
   - API usage limits and fair use policy
   - Technical support included during business hours
        `;
      
      default:
        return baseTerms + `
   - Terms vary based on selected engagement model
   - Payment structure as displayed in pricing
   - Service delivery as per model specifications
        `;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Terms and Conditions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please review and accept the applicable terms
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Membership Terms */}
        {showMembershipTerms && selectedMembershipStatus === 'active' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Membership Terms & Conditions</h4>
            </div>
            
            <ScrollArea className="h-48 w-full border rounded-md p-4">
              <pre className="text-xs whitespace-pre-wrap font-mono">
                {getMembershipTermsContent()}
              </pre>
            </ScrollArea>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="membership-terms"
                checked={membershipTermsAccepted}
                onCheckedChange={onMembershipTermsChange}
              />
              <label 
                htmlFor="membership-terms" 
                className="text-sm font-medium leading-relaxed cursor-pointer"
              >
                I accept the Membership Terms and Conditions
                <span className="text-destructive ml-1">*</span>
              </label>
            </div>
          </div>
        )}

        {/* Separator */}
        {showMembershipTerms && showEngagementTerms && selectedMembershipStatus === 'active' && (
          <Separator />
        )}

        {/* Engagement Model Terms */}
        {showEngagementTerms && selectedEngagementModel && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Engagement Model Terms & Conditions</h4>
            </div>
            
            <ScrollArea className="h-48 w-full border rounded-md p-4">
              <pre className="text-xs whitespace-pre-wrap font-mono">
                {getEngagementModelTermsContent(selectedEngagementModel)}
              </pre>
            </ScrollArea>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="engagement-terms"
                checked={engagementTermsAccepted}
                onCheckedChange={onEngagementTermsChange}
              />
              <label 
                htmlFor="engagement-terms" 
                className="text-sm font-medium leading-relaxed cursor-pointer"
              >
                I accept the Engagement Model Terms and Conditions
                <span className="text-destructive ml-1">*</span>
              </label>
            </div>
          </div>
        )}

        {/* Required Fields Notice */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <span className="text-destructive">*</span> Required fields must be accepted before proceeding
          </p>
        </div>
      </CardContent>
    </Card>
  );
};