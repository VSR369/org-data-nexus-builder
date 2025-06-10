
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from './types';

interface BankingDetailsSectionProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
  providerType: string;
  invalidFields?: Set<string>;
}

const BankingDetailsSection: React.FC<BankingDetailsSectionProps> = ({
  formData,
  updateFormData,
  providerType,
  invalidFields = new Set()
}) => {
  const getEntityDisplayInfo = () => {
    if (providerType === 'organization') {
      return {
        name: formData.orgName || 'Organization Name Not Set',
        type: formData.orgType || 'Organization Type Not Set',
        isOrganization: true
      };
    } else {
      const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
      return {
        name: fullName || 'Individual Name Not Set',
        type: 'Individual',
        isOrganization: false
      };
    }
  };

  const entityInfo = getEntityDisplayInfo();

  return (
    <div className="space-y-4">
      {/* Entity Information Display */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Banking Details For:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="font-medium text-base">{entityInfo.name}</p>
            <p className="text-sm text-muted-foreground">
              {entityInfo.isOrganization ? `Type: ${entityInfo.type}` : entityInfo.type}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Banking Details Form */}
      <div className="space-y-4">
        <h4 className="font-medium">Banking Details (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bank-account" className={invalidFields.has('bankAccount') ? 'text-destructive' : ''}>
              Bank Account Number
            </Label>
            <Input 
              id="bank-account" 
              placeholder="Enter bank account number"
              value={formData.bankAccount}
              onChange={(e) => updateFormData('bankAccount', e.target.value)}
              className={invalidFields.has('bankAccount') ? 'border-destructive' : ''}
            />
            {invalidFields.has('bankAccount') && (
              <p className="text-xs text-destructive">This field is required</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank-name" className={invalidFields.has('bankName') ? 'text-destructive' : ''}>
              Bank Name
            </Label>
            <Input 
              id="bank-name" 
              placeholder="Enter bank name"
              value={formData.bankName}
              onChange={(e) => updateFormData('bankName', e.target.value)}
              className={invalidFields.has('bankName') ? 'border-destructive' : ''}
            />
            {invalidFields.has('bankName') && (
              <p className="text-xs text-destructive">This field is required</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch" className={invalidFields.has('branch') ? 'text-destructive' : ''}>
              Branch
            </Label>
            <Input 
              id="branch" 
              placeholder="Enter branch name"
              value={formData.branch}
              onChange={(e) => updateFormData('branch', e.target.value)}
              className={invalidFields.has('branch') ? 'border-destructive' : ''}
            />
            {invalidFields.has('branch') && (
              <p className="text-xs text-destructive">This field is required</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ifsc" className={invalidFields.has('ifsc') ? 'text-destructive' : ''}>
              IFSC Code / UPI ID
            </Label>
            <Input 
              id="ifsc" 
              placeholder="Enter IFSC code or UPI ID"
              value={formData.ifsc}
              onChange={(e) => updateFormData('ifsc', e.target.value)}
              className={invalidFields.has('ifsc') ? 'border-destructive' : ''}
            />
            {invalidFields.has('ifsc') && (
              <p className="text-xs text-destructive">This field is required</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingDetailsSection;
