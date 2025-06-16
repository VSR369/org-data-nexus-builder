import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PricingConfig } from '@/types/pricing';

interface DiscountSectionProps {
  currentConfig: Partial<PricingConfig>;
  setCurrentConfig: React.Dispatch<React.SetStateAction<Partial<PricingConfig>>>;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({
  currentConfig,
  setCurrentConfig
}) => {
  const handleInputChange = (field: string, value: string) => {
    const numericValue = parseFloat(value);
    setCurrentConfig(prev => ({ 
      ...prev, 
      [field]: isNaN(numericValue) ? undefined : numericValue 
    }));
  };

  if (currentConfig.membershipStatus !== 'active') {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="discountPercentage">Member Discount (%) *</Label>
        <Input
          id="discountPercentage"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={currentConfig.discountPercentage !== undefined ? currentConfig.discountPercentage.toString() : ''}
          onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default DiscountSection;
