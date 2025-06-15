import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, Users, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager, GlobalCacheManager } from '@/utils/dataManager';
import { countriesDataManager } from '@/utils/sharedDataManagers';
import { MasterDataSeeder } from '@/utils/masterDataSeeder';

interface MembershipFeeEntry {
  id: string;
  country: string;
  entityType: string;
  quarterlyAmount: number;
  quarterlyCurrency: string;
  halfYearlyAmount: number;
  halfYearlyCurrency: string;
  annualAmount: number;
  annualCurrency: string;
  createdAt: string;
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  country: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

// Default data structure
const defaultMembershipFees: MembershipFeeEntry[] = [];

// Data managers for currencies and entity types
const currencyDataManager = new DataManager<Currency[]>({
  key: 'master_data_currencies',
  defaultData: [],
  version: 1
});

const entityTypeDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: [],
  version: 1
});

const membershipFeeDataManager = new DataManager<MembershipFeeEntry[]>({
  key: 'master_data_seeker_membership_fees',
  defaultData: defaultMembershipFees,
  version: 1
});

GlobalCacheManager.registerKey('master_data_seeker_membership_fees');

const SeekerMembershipFeeConfig = () => {
  const [membershipFees, setMembershipFees] = useState<MembershipFeeEntry[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<MembershipFeeEntry>>({});
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    // Seed master data first to ensure dependencies exist
    MasterDataSeeder.seedAllMasterData();
    
    const loadedFees = membershipFeeDataManager.loadData();
    const loadedCurrencies = currencyDataManager.loadData();
    const loadedCountries = countriesDataManager.loadData();
    const loadedEntityTypes = entityTypeDataManager.loadData();
    
    console.log('🔍 SeekerMembershipFeeConfig - Loaded countries from master data:', loadedCountries);
    console.log('🔍 SeekerMembershipFeeConfig - Loaded currencies from master data:', loadedCurrencies);
    console.log('🔍 SeekerMembershipFeeConfig - Loaded entity types from master data:', loadedEntityTypes);
    console.log('🔍 SeekerMembershipFeeConfig - Loaded membership fees:', loadedFees);
    
    setMembershipFees(loadedFees);
    setCurrencies(loadedCurrencies);
    setCountries(loadedCountries);
    setEntityTypes(loadedEntityTypes);
  }, []);

  // Save data whenever membershipFees change with validation
  useEffect(() => {
    if (membershipFees.length >= 0) {
      console.log('💾 Saving membership fees:', membershipFees);
      const saveResult = membershipFeeDataManager.saveData(membershipFees);
      console.log('💾 Save result:', saveResult);
      
      // Verify the save worked
      const verification = localStorage.getItem('master_data_seeker_membership_fees');
      console.log('✅ Verification - saved data:', verification);
    }
  }, [membershipFees]);

  // Enhanced currency finding with better logging
  const findCurrencyByCountry = (selectedCountry: string): Currency | undefined => {
    console.log('🔍 Looking for currency for country:', selectedCountry);
    console.log('🔍 Available currencies:', currencies);
    
    // Use the master data seeder's enhanced logic
    const currency = MasterDataSeeder.getCurrencyByCountry(selectedCountry);
    
    if (currency) {
      console.log('✅ Found currency:', currency);
      return currency;
    }
    
    console.log('❌ No currency found for country:', selectedCountry);
    return undefined;
  };

  // Auto-populate currency when country is selected
  const handleCountryChange = (selectedCountry: string) => {
    console.log('🌍 Country selected:', selectedCountry);
    
    // Find the currency for the selected country from master data
    const countryCurrency = findCurrencyByCountry(selectedCountry);
    
    if (countryCurrency) {
      setCurrentEntry(prev => ({
        ...prev,
        country: selectedCountry,
        quarterlyCurrency: countryCurrency.code,
        halfYearlyCurrency: countryCurrency.code,
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
        quarterlyCurrency: '',
        halfYearlyCurrency: '',
        annualCurrency: ''
      }));
      
      toast({
        title: "No Currency Found",
        description: `No currency mapping found for ${selectedCountry}. Please select currencies manually.`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 === MEMBERSHIP FEE SUBMISSION START ===');
    console.log('📝 Current entry:', currentEntry);
    
    // Enhanced validation
    const requiredFields = {
      country: currentEntry.country,
      entityType: currentEntry.entityType,
      quarterlyAmount: currentEntry.quarterlyAmount,
      quarterlyCurrency: currentEntry.quarterlyCurrency,
      halfYearlyAmount: currentEntry.halfYearlyAmount,
      halfYearlyCurrency: currentEntry.halfYearlyCurrency,
      annualAmount: currentEntry.annualAmount,
      annualCurrency: currentEntry.annualCurrency
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => value === undefined || value === null || value === '')
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    const existingEntry = membershipFees.find(fee => 
      fee.country === currentEntry.country && 
      fee.entityType === currentEntry.entityType && 
      fee.id !== currentEntry.id
    );

    if (existingEntry && !isEditing) {
      console.log('❌ Duplicate entry found:', existingEntry);
      toast({
        title: "Duplicate Configuration",
        description: "Membership fee configuration already exists for this country and entity type combination.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && currentEntry.id) {
        console.log('✏️ Updating existing entry:', currentEntry.id);
        setMembershipFees(prev => {
          const updated = prev.map(item => 
            item.id === currentEntry.id ? { ...currentEntry as MembershipFeeEntry } : item
          );
          console.log('✏️ Updated membership fees:', updated);
          return updated;
        });
        toast({
          title: "Success",
          description: "Seeker membership fee updated successfully.",
        });
      } else {
        const newEntry = {
          ...currentEntry,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
        } as MembershipFeeEntry;
        
        console.log('➕ Adding new entry:', newEntry);
        setMembershipFees(prev => {
          const updated = [...prev, newEntry];
          console.log('➕ New membership fees:', updated);
          return updated;
        });
        toast({
          title: "Success",
          description: "Seeker membership fee created successfully.",
        });
      }

      resetForm();
      console.log('✅ === MEMBERSHIP FEE SUBMISSION SUCCESS ===');
    } catch (error) {
      console.error('❌ Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to save membership fee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (entry: MembershipFeeEntry) => {
    setCurrentEntry(entry);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setMembershipFees(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Seeker membership fee deleted successfully.",
    });
  };

  const resetForm = () => {
    setCurrentEntry({});
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    const defaultData = membershipFeeDataManager.resetToDefault();
    setMembershipFees(defaultData);
    toast({
      title: "Success",
      description: "Seeker membership fees reset to default values.",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    const currencyData = currencies.find(c => c.code === currency);
    const symbol = currencyData?.symbol || currency;
    return `${symbol} ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {isEditing ? 'Edit Seeker Membership Fee' : 'Add Seeker Membership Fee Configuration'}
            </CardTitle>
            <Button
              onClick={handleResetToDefault}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={currentEntry.country}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.name}>
                        {country.name} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="entityType">Entity Type *</Label>
                <Select
                  value={currentEntry.entityType}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quarterly Fee */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Quarterly Fee</h3>
                <div>
                  <Label htmlFor="quarterlyCurrency">Currency *</Label>
                  <Select
                    value={currentEntry.quarterlyCurrency}
                    onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, quarterlyCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quarterlyAmount">Amount *</Label>
                  <Input
                    id="quarterlyAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentEntry.quarterlyAmount ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCurrentEntry(prev => ({ 
                        ...prev, 
                        quarterlyAmount: value === '' ? 0 : parseFloat(value) 
                      }));
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Half Yearly Fee */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Half Yearly Fee</h3>
                <div>
                  <Label htmlFor="halfYearlyCurrency">Currency *</Label>
                  <Select
                    value={currentEntry.halfYearlyCurrency}
                    onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, halfYearlyCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="halfYearlyAmount">Amount *</Label>
                  <Input
                    id="halfYearlyAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentEntry.halfYearlyAmount ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCurrentEntry(prev => ({ 
                        ...prev, 
                        halfYearlyAmount: value === '' ? 0 : parseFloat(value) 
                      }));
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Annual Fee */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Annual Fee</h3>
                <div>
                  <Label htmlFor="annualCurrency">Currency *</Label>
                  <Select
                    value={currentEntry.annualCurrency}
                    onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, annualCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="annualAmount">Amount *</Label>
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
              <Button type="submit">
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

      <Card>
        <CardHeader>
          <CardTitle>Existing Seeker Membership Fee Configurations ({membershipFees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {membershipFees.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No membership fee configurations found. Add one above to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Quarterly</TableHead>
                    <TableHead>Half Yearly</TableHead>
                    <TableHead>Annual</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membershipFees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell>
                        <Badge variant="outline">{fee.country}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{fee.entityType}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(fee.quarterlyAmount, fee.quarterlyCurrency)}</TableCell>
                      <TableCell>{formatCurrency(fee.halfYearlyAmount, fee.halfYearlyCurrency)}</TableCell>
                      <TableCell>{formatCurrency(fee.annualAmount, fee.annualCurrency)}</TableCell>
                      <TableCell>{fee.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(fee)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(fee.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeekerMembershipFeeConfig;
