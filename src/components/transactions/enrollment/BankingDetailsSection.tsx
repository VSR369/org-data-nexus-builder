
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData } from './types';

interface BankingDetailsSectionProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
}

const BankingDetailsSection: React.FC<BankingDetailsSectionProps> = ({
  formData,
  updateFormData
}) => {
  return (
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
  );
};

export default BankingDetailsSection;
