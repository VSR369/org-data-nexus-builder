
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { MembershipFeeEntry, Currency, Country } from './types';

interface MembershipFeeFormProps {
  currencies: Currency[];
  countries: Country[];
  entityTypes: string[];
  organizationTypes: string[];
  membershipFees: MembershipFeeEntry[];
  onSubmit: (entry: MembershipFeeEntry) => void;
  editingEntry?: MembershipFeeEntry | null;
  onCancelEdit: () => void;
}

const MembershipFeeForm: React.FC<MembershipFeeFormProps> = ({
  currencies,
  countries,
  entityTypes,
  organizationTypes,
  membershipFees,
  onSubmit,
  editingEntry,
  onCancelEdit
}) => {
  const [currentEntry, setCurrentEntry] = useState<Partial<MembershipFeeEntry>>(editingEntry || {});
  const { toast } = useToast();

  const userCurrencies = currencies.filter(c => c.isUserCreated !== false);
  const isEditing = !!editingEntry;

  console.log('📊 MembershipFeeForm received props:', {
    countries: countries.length,
    currencies: currencies.length,
    entityTypes: entityTypes.length,
    organizationTypes: organizationTypes.length,
    countriesData: countries
  });

  // Check if currency is auto-populated for annual fee
  const isCurrencyAutoSelected = !!(currentEntry.country && currentEntry.annualCurrency);

  React.useEffect(() => {
    if (editingEntry) {
      console.log('Setting editing entry:', editingEntry);
      setCurrentEntry(editingEntry);
    } else {
      console.log('Resetting form to empty state');
      setCurrentEntry({});
    }
  }, [editingEntry]);

  const handleCountryChange = (selectedCountry: string) => {
    console.log('🌍 Country selected:', selectedCountry);
    
    // Find currency directly from the currencies prop using Supabase data
    const countryCurrency = currencies.find(currency => {
      // Direct match first
      if (currency.country === selectedCountry) return true;
      
      // Case-insensitive match
      if (currency.country?.toLowerCase() === selectedCountry.toLowerCase()) return true;
      
      return false;
    });
    
    if (countryCurrency) {
      setCurrentEntry(prev => ({
        ...prev,
        country: selectedCountry,
        annualCurrency: countryCurrency.code
      }));
      
      toast({
        title: "Currency Auto-Selected",
        description: `${countryCurrency.code} (${countryCurrency.name}) has been auto-selected for ${selectedCountry}`,
      });
    } else {
      setCurrentEntry(prev => ({
        ...prev,
        country: selectedCountry,
        annualCurrency: ''
      }));
      
      toast({
        title: "No Currency Found",
        description: `No currency mapping found for ${selectedCountry}. Please ensure currency is configured in master data.`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = {
      country: currentEntry.country,
      organizationType: currentEntry.organizationType,
      entityType: currentEntry.entityType,
      annualAmount: currentEntry.annualAmount,
      annualCurrency: currentEntry.annualCurrency
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => value === undefined || value === null || value === '')
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    const existingEntry = membershipFees.find(fee => 
      fee.country === currentEntry.country && 
      fee.organizationType === currentEntry.organizationType &&
      fee.entityType === currentEntry.entityType && 
      fee.id !== currentEntry.id
    );

    if (existingEntry && !isEditing) {
      toast({
        title: "Duplicate Configuration",
        description: "Membership fee configuration already exists for this country, organization type, and entity type combination.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    const entry = {
      ...currentEntry,
      id: currentEntry.id || `user_${Date.now()}`,
      // Set default values for quarterly and half yearly to maintain data structure
      quarterlyAmount: 0,
      quarterlyCurrency: currentEntry.annualCurrency || '',
      halfYearlyAmount: 0,
      halfYearlyCurrency: currentEntry.annualCurrency || '',
      createdAt: currentEntry.createdAt || now.split('T')[0],
      updatedAt: now,
      isUserCreated: true
    } as MembershipFeeEntry;

    onSubmit(entry);
    resetForm();
    
    toast({
      title: "Success",
      description: `Seeker membership fee ${isEditing ? 'updated' : 'created'} successfully.`,
    });
  };

  const resetForm = () => {
    setCurrentEntry({});
    onCancelEdit();
  };

  // Create unique keys for Select components to force re-render
  const formKey = isEditing ? `edit-${editingEntry?.id}` : 'add-new';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {isEditing ? 'Edit Seeker Membership Fee' : 'Add Seeker Membership Fee Configuration'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userCurrencies.length === 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-3 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <p>
                ⚠️ No user-created currencies found. Please create currencies in the Currency Configuration section first.
              </p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="country">Country *</Label>
              <Select
                key={`country-${formKey}`}
                value={currentEntry.country || ''}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
        <SelectContent className="bg-popover text-popover-foreground">
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.name}>
              {country.name} ({country.code})
            </SelectItem>
          ))}
        </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="organizationType">Organization Type *</Label>
              <Select
                key={`organizationType-${formKey}`}
                value={currentEntry.organizationType || ''}
                onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, organizationType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {organizationTypes.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  No organization types found in master data.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="entityType">Entity Type *</Label>
              <Select
                key={`entityType-${formKey}`}
                value={currentEntry.entityType || ''}
                onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, entityType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            {/* Annual Fee */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-purple-500 pb-2">Annual Membership Fee</h3>
              </div>
              <div>
                <Label htmlFor="annualCurrency">Currency *</Label>
                <Select
                  key={`annualCurrency-${formKey}`}
                  value={currentEntry.annualCurrency || ''}
                  onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, annualCurrency: value }))}
                  disabled={isCurrencyAutoSelected}
                >
                  <SelectTrigger className={isCurrencyAutoSelected ? "bg-gray-100 cursor-not-allowed" : ""}>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {userCurrencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isCurrencyAutoSelected && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Currency auto-selected based on country
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="annualAmount">Annual Amount *</Label>
                <Input
                  id="annualAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentEntry.annualAmount ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentEntry(prev => ({ 
                      ...prev, 
                      annualAmount: value === '' ? 0 : parseFloat(value) 
                    }));
                  }}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={userCurrencies.length === 0}>
              {isEditing ? 'Update' : 'Submit'} Membership Fee
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MembershipFeeForm;
