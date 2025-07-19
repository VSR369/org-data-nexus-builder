import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Check, X, RefreshCw, Plus, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Country {
  id?: string;
  name: string;
  code?: string;
  region?: string;
  created_at?: string;
  updated_at?: string;
  is_user_created?: boolean;
}

const CountryConfigSupabase: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCountry, setNewCountry] = useState({ name: '', code: '', region: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', code: '', region: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const loadCountries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_countries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Countries loaded from Supabase:', data);
      setCountries(data || []);
    } catch (error) {
      console.error('Error loading countries:', error);
      toast({
        title: "Error",
        description: "Failed to load countries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCountries();
  }, []);

  const handleAddCountry = async () => {
    if (!newCountry.name.trim() || !newCountry.code.trim()) {
      toast({
        title: "Error",
        description: "Country name and code are required",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate country codes
    const duplicateCode = countries.find(country => 
      country.code?.toUpperCase() === newCountry.code.trim().toUpperCase()
    );

    if (duplicateCode) {
      toast({
        title: "Error",
        description: "A country with this code already exists",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_countries')
        .insert([{ 
          name: newCountry.name.trim(),
          code: newCountry.code.trim().toUpperCase(),
          is_user_created: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Country created in Supabase:', data);
      setCountries(prev => [...prev, data]);
      setNewCountry({ name: '', code: '', region: '' });
      setIsAdding(false);
      toast({
        title: "Success",
        description: `${newCountry.name} added successfully`,
      });
    } catch (error) {
      console.error('Error adding country:', error);
      toast({
        title: "Error",
        description: "Failed to add country",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCountry = (id: string, country: Country) => {
    setEditingId(id);
    setEditingValue({ 
      name: country.name,
      code: country.code || '',
      region: country.region || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingValue.name.trim() || !editingValue.code.trim()) {
      toast({
        title: "Error",
        description: "Country name and code are required",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate country codes (excluding current country)
    const duplicateCode = countries.find(country => 
      country.code?.toUpperCase() === editingValue.code.trim().toUpperCase() &&
      country.id !== editingId
    );

    if (duplicateCode) {
      toast({
        title: "Error",
        description: "A country with this code already exists",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_countries')
        .update({ 
          name: editingValue.name.trim(),
          code: editingValue.code.trim().toUpperCase()
        })
        .eq('id', editingId)
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Country updated in Supabase:', data);
      setCountries(prev => prev.map(country => country.id === editingId ? data : country));
      setEditingId(null);
      setEditingValue({ name: '', code: '', region: '' });
      toast({
        title: "Success",
        description: "Country updated successfully",
      });
    } catch (error) {
      console.error('Error updating country:', error);
      toast({
        title: "Error",
        description: "Failed to update country",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCountry = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_countries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Country deleted from Supabase');
      setCountries(prev => prev.filter(country => country.id !== id));
      toast({
        title: "Success",
        description: "Country deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting country:', error);
      toast({
        title: "Error",
        description: "Failed to delete country",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue({ name: '', code: '', region: '' });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewCountry({ name: '', code: '', region: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Countries Configuration
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={loadCountries} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Country
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="new-name">Country Name *</Label>
                  <Input
                    id="new-name"
                    value={newCountry.name}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., United States"
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="new-code">Country Code *</Label>
                  <Input
                    id="new-code"
                    value={newCountry.code}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g., US"
                    maxLength={3}
                  />
                </div>
                <div>
                  <Label htmlFor="new-region">Region</Label>
                  <Input
                    id="new-region"
                    value={newCountry.region}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, region: e.target.value }))}
                    placeholder="e.g., North America"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCountry} size="sm" disabled={loading}>
                  <Check className="h-4 w-4 mr-2" />
                  Add Country
                </Button>
                <Button onClick={handleCancelAdd} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : countries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No countries configured. Add some countries to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {countries.map((country) => (
                <div key={country.id} className="p-3 border rounded-lg">
                  {editingId === country.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          value={editingValue.name}
                          onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Country name"
                          autoFocus
                        />
                        <Input
                          value={editingValue.code}
                          onChange={(e) => setEditingValue(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                          placeholder="Country code"
                          maxLength={3}
                        />
                        <Input
                          value={editingValue.region}
                          onChange={(e) => setEditingValue(prev => ({ ...prev, region: e.target.value }))}
                          placeholder="Region"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm" variant="outline" disabled={loading}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{country.code}</Badge>
                        <div>
                          <h4 className="font-medium">{country.name}</h4>
                          {country.region && (
                            <p className="text-sm text-muted-foreground">Region: {country.region}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEditCountry(country.id!, country)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteCountry(country.id!)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CountryConfigSupabase;