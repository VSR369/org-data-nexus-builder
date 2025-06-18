import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Globe, RotateCcw } from 'lucide-react';
import { toast } from "sonner";
import { countriesDataManager } from '@/utils/sharedDataManagers';

interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

const CountryConfig = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Partial<Country>>({});

  // Load data from shared manager
  useEffect(() => {
    try {
      const sharedCountries = countriesDataManager.loadData();
      console.log('🌍 CountryConfig - Loaded countries from shared manager:', sharedCountries);
      
      if (Array.isArray(sharedCountries) && sharedCountries.length > 0) {
        setCountries(sharedCountries);
      } else {
        // Initialize with the three required countries - ensuring UAE is shown as full name
        const defaultCountries = [
          { id: '1', name: 'India', code: 'IN', region: 'Asia' },
          { id: '2', name: 'United States of America', code: 'US', region: 'North America' },
          { id: '3', name: 'United Arab Emirates', code: 'AE', region: 'Middle East' }
        ];
        setCountries(defaultCountries);
        countriesDataManager.saveData(defaultCountries);
      }
    } catch (error) {
      console.error('❌ Error loading countries:', error);
      const defaultCountries = [
        { id: '1', name: 'India', code: 'IN', region: 'Asia' },
        { id: '2', name: 'United States of America', code: 'US', region: 'North America' },
        { id: '3', name: 'United Arab Emirates', code: 'AE', region: 'Middle East' }
      ];
      setCountries(defaultCountries);
      countriesDataManager.saveData(defaultCountries);
    }
  }, []);

  // Save countries to shared manager whenever countries change
  useEffect(() => {
    if (countries.length > 0) {
      countriesDataManager.saveData(countries);
      console.log('💾 CountryConfig - Saved countries to shared manager:', countries);
    }
  }, [countries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 HandleSubmit called with:', { currentCountry, isEditing });
    
    if (!currentCountry.name || !currentCountry.code) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check for duplicate country codes (only if not editing the same country)
    const duplicateCode = countries.find(country => 
      country.code.toUpperCase() === currentCountry.code!.toUpperCase() && 
      country.id !== currentCountry.id
    );

    if (duplicateCode) {
      toast.error("A country with this code already exists.");
      return;
    }

    if (isEditing && currentCountry.id) {
      // Update existing country
      const updatedCountry: Country = {
        id: currentCountry.id,
        name: currentCountry.name,
        code: currentCountry.code.toUpperCase(),
        region: currentCountry.region || ''
      };

      setCountries(prev => prev.map(item => 
        item.id === currentCountry.id ? updatedCountry : item
      ));
      
      console.log('✅ Updated country:', updatedCountry);
      
      toast.success("Country updated successfully!");
    } else {
      // Add new country
      const newCountry: Country = {
        id: Date.now().toString(),
        name: currentCountry.name,
        code: currentCountry.code.toUpperCase(),
        region: currentCountry.region || ''
      };
      
      setCountries(prev => [...prev, newCountry]);
      
      console.log('✅ Added new country:', newCountry);
      
      toast.success("Country created successfully!");
    }

    // Reset form
    setCurrentCountry({});
    setIsEditing(false);
  };

  const handleEdit = (country: Country) => {
    console.log('✏️ Editing country:', country);
    setCurrentCountry(country);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setCountries(prev => prev.filter(item => item.id !== id));
    toast.success("Country deleted successfully!");
  };

  const resetForm = () => {
    setCurrentCountry({});
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    const defaultCountries = [
      { id: '1', name: 'India', code: 'IN', region: 'Asia' },
      { id: '2', name: 'United States of America', code: 'US', region: 'North America' },
      { id: '3', name: 'United Arab Emirates', code: 'AE', region: 'Middle East' }
    ];
    setCountries(defaultCountries);
    setCurrentCountry({});
    setIsEditing(false);
    toast.success("Countries reset to default values (India, USA, United Arab Emirates).");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {isEditing ? 'Edit Country' : 'Add New Country'}
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Country Name *</Label>
                <Input
                  id="name"
                  value={currentCountry.name || ''}
                  onChange={(e) => setCurrentCountry(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., United States"
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Country Code *</Label>
                <Input
                  id="code"
                  value={currentCountry.code || ''}
                  onChange={(e) => setCurrentCountry(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g., US"
                  maxLength={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={currentCountry.region || ''}
                  onChange={(e) => setCurrentCountry(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="e.g., North America"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {isEditing ? 'Update' : 'Add'} Country
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
          <CardTitle>Countries ({countries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {countries.map((country) => (
              <div key={country.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{country.code}</Badge>
                  <div>
                    <h3 className="font-medium">{country.name}</h3>
                    {country.region && (
                      <p className="text-sm text-muted-foreground">Region: {country.region}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(country)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(country.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountryConfig;
