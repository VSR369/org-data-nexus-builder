import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Globe, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { countriesDataManager } from '@/utils/sharedDataManagers';

interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

const defaultCountries: Country[] = [
  { id: '1', name: 'India', code: 'IN', region: 'Asia' },
  { id: '2', name: 'United States of America', code: 'US', region: 'North America' },
  { id: '3', name: 'United Arab Emirates', code: 'AE', region: 'Middle East' },
];

const CountryConfig = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Partial<Country>>({});
  const { toast } = useToast();

  // Helper functions to get country codes and regions
  const getCountryCode = (countryName: string): string => {
    const codeMap: { [key: string]: string } = {
      'India': 'IN',
      'United States': 'US',
      'United States of America': 'US',
      'United Arab Emirates': 'AE',
      'United Kingdom': 'GB',
      'Germany': 'DE',
      'France': 'FR',
      'Japan': 'JP',
      'Australia': 'AU',
      'China': 'CN',
      'Brazil': 'BR',
      'Canada': 'CA',
      'Mexico': 'MX',
      'Netherlands': 'NL',
      'Sweden': 'SE',
      'Switzerland': 'CH',
      'Singapore': 'SG'
    };
    return codeMap[countryName] || countryName.substring(0, 2).toUpperCase();
  };

  const getCountryRegion = (countryName: string): string => {
    const regionMap: { [key: string]: string } = {
      'India': 'Asia',
      'United States': 'North America',
      'United States of America': 'North America',
      'United Arab Emirates': 'Middle East',
      'United Kingdom': 'Europe',
      'Germany': 'Europe',
      'France': 'Europe',
      'Japan': 'Asia',
      'Australia': 'Oceania',
      'China': 'Asia',
      'Brazil': 'South America',
      'Canada': 'North America',
      'Mexico': 'North America',
      'Netherlands': 'Europe',
      'Sweden': 'Europe',
      'Switzerland': 'Europe',
      'Singapore': 'Asia'
    };
    return regionMap[countryName] || 'Unknown';
  };

  // Load and convert data from shared manager
  useEffect(() => {
    try {
      const sharedCountries = countriesDataManager.loadData();
      console.log('Loaded shared countries:', sharedCountries);
      
      // Since countriesDataManager always returns string[], convert to Country objects
      if (Array.isArray(sharedCountries) && sharedCountries.length > 0) {
        // Convert string array to Country objects
        const convertedCountries = sharedCountries.map((countryName, index) => ({
          id: (index + 1).toString(),
          name: countryName,
          code: getCountryCode(countryName),
          region: getCountryRegion(countryName)
        }));
        setCountries(convertedCountries);
      } else {
        // Use default countries if no data
        setCountries(defaultCountries);
        // Save default countries to shared manager as string array
        const countryNames = defaultCountries.map(c => c.name);
        countriesDataManager.saveData(countryNames);
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries(defaultCountries);
    }
  }, []);

  // Save countries to shared manager whenever countries change
  useEffect(() => {
    if (countries.length > 0) {
      const countryNames = countries.map(country => country.name);
      countriesDataManager.saveData(countryNames);
      console.log('Saved countries to shared manager:', countryNames);
    }
  }, [countries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCountry.name || !currentCountry.code) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && currentCountry.id) {
      setCountries(prev => prev.map(item => 
        item.id === currentCountry.id ? { ...currentCountry as Country } : item
      ));
      toast({
        title: "Success",
        description: "Country updated successfully.",
      });
    } else {
      const newCountry = {
        ...currentCountry,
        id: Date.now().toString(),
      } as Country;
      setCountries(prev => [...prev, newCountry]);
      toast({
        title: "Success",
        description: "Country created successfully.",
      });
    }

    setCurrentCountry({});
    setIsEditing(false);
  };

  const handleEdit = (country: Country) => {
    setCurrentCountry(country);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setCountries(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Country deleted successfully.",
    });
  };

  const resetForm = () => {
    setCurrentCountry({});
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    setCountries(defaultCountries);
    const countryNames = defaultCountries.map(c => c.name);
    countriesDataManager.saveData(countryNames);
    toast({
      title: "Success",
      description: "Countries reset to default values.",
    });
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
                />
              </div>
              <div>
                <Label htmlFor="code">Country Code *</Label>
                <Input
                  id="code"
                  value={currentCountry.code || ''}
                  onChange={(e) => setCurrentCountry(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g., US"
                  maxLength={2}
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
          <CardTitle>Existing Countries ({countries.length})</CardTitle>
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
