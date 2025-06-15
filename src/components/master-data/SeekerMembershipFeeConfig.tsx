import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Users, AlertTriangle, Database } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager, GlobalCacheManager } from '@/utils/dataManager';
import { countriesDataManager } from '@/utils/sharedDataManagers';
import { MasterDataSeeder } from '@/utils/masterDataSeeder';
import { MasterDataPersistenceManager } from '@/utils/masterDataPersistenceManager';

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
  updatedAt: string;
  isUserCreated: boolean;
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  country: string;
  isUserCreated: boolean;
}

interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

const membershipFeeConfig = {
  key: 'master_data_seeker_membership_fees',
  version: 2,
  preserveUserData: true
};

const SeekerMembershipFeeConfig = () => {
  const [membershipFees, setMembershipFees] = useState<MembershipFeeEntry[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<MembershipFeeEntry>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [dataHealth, setDataHealth] = useState<any>(null);
  const { toast } = useToast();

  // Function to check data health
  const checkDataHealth = () => {
    const currencyHealth = MasterDataPersistenceManager.validateDataIntegrity(
      { key: 'master_data_currencies', version: 2, preserveUserData: true }
    );
    const membershipHealth = MasterDataPersistenceManager.validateDataIntegrity<MembershipFeeEntry[]>(membershipFeeConfig);
    
    return {
      currencies: currencyHealth,
      membershipFees: membershipHealth
    };
  };

  // Function to reload all master data
  const reloadMasterData = () => {
    console.log('🔄 Reloading master data with persistence priority...');
    
    // Load master data - this will prioritize user data
    const loadedCurrencies = MasterDataSeeder.getCurrencies();
    const loadedCountries = countriesDataManager.loadData();
    const loadedEntityTypes = MasterDataSeeder.getEntityTypes();
    
    // Load membership fees with persistence
    const loadedFees = MasterDataPersistenceManager.loadUserData<MembershipFeeEntry[]>(membershipFeeConfig) || [];
    
    console.log('🔍 SeekerMembershipFeeConfig - User currencies:', loadedCurrencies.length);
    console.log('🔍 SeekerMembershipFeeConfig - Countries:', loadedCountries.length);
    console.log('🔍 SeekerMembershipFeeConfig - Entity types:', loadedEntityTypes.length);
    console.log('🔍 SeekerMembershipFeeConfig - User membership fees:', loadedFees.length);
    
    setMembershipFees(loadedFees);
    setCurrencies(loadedCurrencies);
    setCountries(loadedCountries);
    setEntityTypes(loadedEntityTypes);
    
    // Update health status
    setDataHealth(checkDataHealth());
    
    return { loadedCurrencies, loadedCountries, loadedEntityTypes, loadedFees };
  };

  // Load data on component mount
  useEffect(() => {
    reloadMasterData();
  }, []);

  // Save membership fees whenever they change
  useEffect(() => {
    if (membershipFees.length > 0) {
      console.log('💾 Saving membership fees as user data:', membershipFees.length);
      MasterDataPersistenceManager.saveUserData(membershipFeeConfig, membershipFees);
      
      // Update health status
      setDataHealth(checkDataHealth());
    }
  }, [membershipFees]);

  // Auto-populate currency when country is selected
  const handleCountryChange = (selectedCountry: string) => {
    console.log('🌍 Country selected:', selectedCountry);
    console.log('🔍 Available user currencies for lookup:', currencies.length);
    
    // Find the currency for the selected country from user data
    const countryCurrency = MasterDataSeeder.getCurrencyByCountry(selectedCountry);
    
    if (countryCurrency) {
      console.log('✅ Found user currency for country:', countryCurrency);
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
      console.log('❌ No user currency found for country');
      
      setCurrentEntry(prev => ({
        ...prev,
        country: selectedCountry,
        quarterlyCurrency: '',
        halfYearlyCurrency: '',
        annualCurrency: ''
      }));
      
      toast({
        title: "No Currency Found",
        description: `No currency mapping found for ${selectedCountry}. Please create the currency in Currency Configuration first.`,
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
      const now = new Date().toISOString();
      
      if (isEditing && currentEntry.id) {
        console.log('✏️ Updating existing entry:', currentEntry.id);
        const updatedEntry = {
          ...currentEntry,
          updatedAt: now,
          isUserCreated: true
        } as MembershipFeeEntry;
        
        setMembershipFees(prev => {
          const updated = prev.map(item => 
            item.id === currentEntry.id ? updatedEntry : item
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
          id: `user_${Date.now()}`,
          createdAt: now.split('T')[0],
          updatedAt: now,
          isUserCreated: true
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

  const formatCurrency = (amount: number, currency: string) => {
    const currencyData = currencies.find(c => c.code === currency);
    const symbol = currencyData?.symbol || currency;
    return `${symbol} ${amount.toLocaleString()}`;
  };

  // Filter to show only user-created currencies
  const userCurrencies = currencies.filter(c => c.isUserCreated !== false);

  return (
    <div className="space-y-6">
      {/* Data Health Status */}
      {dataHealth && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Data Health Status</p>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${dataHealth.currencies.hasUserData ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  Currencies: {dataHealth.currencies.hasUserData ? 'User Data Found' : 'Using Fallback'}
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ml-4 ${dataHealth.membershipFees.hasUserData ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                  Membership Fees: {dataHealth.membershipFees.hasUserData ? 'User Data Found' : 'No User Data'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                      {userCurrencies.map((currency) => (
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
                      {userCurrencies.map((currency) => (
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
                      {userCurrencies.map((currency) => (
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

      {/* Existing Configurations */}
      <Card>
        <CardHeader>
          <CardTitle>User-Created Membership Fee Configurations ({membershipFees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {membershipFees.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No user-created membership fee configurations found. Add one above to get started.
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
                      <TableCell>
                        <div className="text-sm">
                          <div>{fee.createdAt}</div>
                          {fee.isUserCreated && (
                            <Badge variant="outline" className="text-xs mt-1">User Created</Badge>
                          )}
                        </div>
                      </TableCell>
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
