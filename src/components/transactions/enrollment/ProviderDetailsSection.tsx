
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from './types';

interface ProviderDetailsSectionProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
  invalidFields?: Set<string>;
}

const ProviderDetailsSection: React.FC<ProviderDetailsSectionProps> = ({
  formData,
  updateFormData,
  invalidFields = new Set()
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Contributor Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name *</Label>
          <Input 
            id="first-name" 
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            className={invalidFields.has('firstName') ? 'border-destructive' : ''}
          />
          {invalidFields.has('firstName') && (
            <p className="text-sm text-destructive">First Name is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name *</Label>
          <Input 
            id="last-name" 
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            className={invalidFields.has('lastName') ? 'border-destructive' : ''}
          />
          {invalidFields.has('lastName') && (
            <p className="text-sm text-destructive">Last Name is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email ID *</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={invalidFields.has('email') ? 'border-destructive' : ''}
          />
          {invalidFields.has('email') && (
            <p className="text-sm text-destructive">Email is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input 
            id="mobile" 
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={(e) => updateFormData('mobile', e.target.value)}
            className={invalidFields.has('mobile') ? 'border-destructive' : ''}
          />
          {invalidFields.has('mobile') && (
            <p className="text-sm text-destructive">Mobile Number is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-id">User ID *</Label>
          <Input 
            id="user-id" 
            placeholder="Enter user ID"
            value={formData.userId}
            onChange={(e) => updateFormData('userId', e.target.value)}
            className={invalidFields.has('userId') ? 'border-destructive' : ''}
          />
          {invalidFields.has('userId') && (
            <p className="text-sm text-destructive">User ID is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            className={invalidFields.has('password') ? 'border-destructive' : ''}
          />
          {invalidFields.has('password') && (
            <p className="text-sm text-destructive">Password is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password *</Label>
          <Input 
            id="confirm-password" 
            type="password" 
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            className={invalidFields.has('confirmPassword') ? 'border-destructive' : ''}
          />
          {invalidFields.has('confirmPassword') && (
            <p className="text-sm text-destructive">
              {formData.password !== formData.confirmPassword && formData.password && formData.confirmPassword 
                ? 'Password confirmation must match' 
                : 'Confirm Password is required'
              }
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="provider-country">Country *</Label>
          <Select value={formData.providerCountry} onValueChange={(value) => updateFormData('providerCountry', value)}>
            <SelectTrigger className={invalidFields.has('providerCountry') ? 'border-destructive' : ''}>
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
          {invalidFields.has('providerCountry') && (
            <p className="text-sm text-destructive">Country is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="pin-code">Pin Code *</Label>
          <Input 
            id="pin-code" 
            placeholder="Enter pin code"
            value={formData.pinCode}
            onChange={(e) => updateFormData('pinCode', e.target.value)}
            className={invalidFields.has('pinCode') ? 'border-destructive' : ''}
          />
          {invalidFields.has('pinCode') && (
            <p className="text-sm text-destructive">Pin Code is required</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea 
            id="address" 
            placeholder="Enter complete address"
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailsSection;
