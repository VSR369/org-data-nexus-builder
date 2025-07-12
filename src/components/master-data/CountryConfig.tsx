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

  // Load data from local storage
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const countriesData = countriesDataManager.loadData();
      console.log("Countries from local storage:", countriesData);
      setCountries(countriesData || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      const defaultCountries = [];
      setCountries(defaultCountries);
    }
  };

  const saveCountriesData = async (country: Country) => {
    try {
      const currentCountries = countriesDataManager.loadData() || [];
      const newCountry = { ...country, id: Date.now().toString() };
      currentCountries.push(newCountry);
      countriesDataManager.saveData(currentCountries);
      console.log('💾 CountryConfig - Saved country to local storage:', newCountry);
    } catch (error) {
      console.error('❌ Error saving country to local storage:', error);
    }
  };

  const updateCountriesData = async (country: Country) => {
    try {
      const currentCountries = countriesDataManager.loadData() || [];
      const updatedCountries = currentCountries.map(c => c.id === country.id ? country : c);
      countriesDataManager.saveData(updatedCountries);
      console.log('💾 CountryConfig - Updated country in local storage:', country);
      await fetchCountries();
    } catch (error) {
      console.error('❌ Error updating country in local storage:', error);
    }
  };

  // Save countries to API whenever countries change
  // useEffect(() => {
  //   if (countries.length > 0) {
  //     saveCountriesData(countries);
  //   }
  // }, [countries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 HandleSubmit called with:', { currentCountry, isEditing });
    
    if (!currentCountry.name || !currentCountry.code) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check for duplicate country codes (only if not editing the same country)
    const duplicateCode = countries.length > 0 && countries.find(country => 
      country.code.toUpperCase() === currentCountry.code!.toUpperCase() && 
      country.id !== currentCountry.id
    );

    console.log("Duplicate code check", duplicateCode);
    
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
      
      console.log("Update country data", updatedCountry, updatedCountry.id);

      await updateCountriesData(updatedCountry);

      console.log('✅ Updated country:', updatedCountry);
      
      toast.success("Country updated successfully!");
    } else {
      // Add new country
      const newCountry: Country = {
        id: Date.now().toString(),
        name: currentCountry.name!,
        code: currentCountry.code!.toUpperCase(),
        region: currentCountry.region || ''
      };
      
      setCountries(prev => [...prev, newCountry]);
      await saveCountriesData(newCountry);
      
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

  const handleDelete = async (id: string) => {
    try {
      const currentCountries = countriesDataManager.loadData() || [];
      const updatedCountries = currentCountries.filter(c => c.id !== id);
      countriesDataManager.saveData(updatedCountries);
      setCountries(updatedCountries);
      toast.success("Country deleted successfully!");
    } catch (error) {
      console.error('Error deleting country:', error);
      toast.error("Failed to delete country");
    }
  };

  const resetForm = () => {
    setCurrentCountry({});
    setIsEditing(false);
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
            {countries.length > 0 && countries.map((country) => (
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
