
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Country {
  id: string;
  name: string;
  code?: string;
}

const CountryConfigSupabase: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCountry, setNewCountry] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', code: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const fetchCountries = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching countries from Supabase...');
      
      const { data, error } = await supabase
        .from('master_countries')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Error fetching countries:', error);
        throw error;
      }

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

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleAddCountry = async () => {
    if (!newCountry.name.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_countries')
        .insert([{ 
          name: newCountry.name.trim(),
          code: newCountry.code.trim() || null
        }])
        .select()
        .single();

      if (error) throw error;

      setCountries(prev => [...prev, data]);
      setNewCountry({ name: '', code: '' });
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

  const handleEdit = (country: Country) => {
    setEditingId(country.id);
    setEditingValue({ name: country.name, code: country.code || '' });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingValue.name.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_countries')
        .update({ 
          name: editingValue.name.trim(),
          code: editingValue.code.trim() || null
        })
        .eq('id', editingId)
        .select()
        .single();

      if (error) throw error;

      setCountries(prev => prev.map(country => 
        country.id === editingId ? data : country
      ));
      setEditingId(null);
      setEditingValue({ name: '', code: '' });
      
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this country?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_countries')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Countries Configuration (Supabase)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={fetchCountries} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Country
            </Button>
          </div>

          {isAdding && (
            <div className="flex items-center gap-2 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newCountry.name}
                onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                placeholder="Country name"
                className="flex-1"
              />
              <Input
                value={newCountry.code}
                onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value })}
                placeholder="Code (e.g., US)"
                className="w-32"
              />
              <Button onClick={handleAddCountry} size="sm" disabled={loading}>
                <Check className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsAdding(false)} size="sm" variant="outline">
                <X className="h-4 w-4" />
              </Button>
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
                <div key={country.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingId === country.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue({ ...editingValue, name: e.target.value })}
                        className="flex-1"
                      />
                      <Input
                        value={editingValue.code}
                        onChange={(e) => setEditingValue({ ...editingValue, code: e.target.value })}
                        className="w-32"
                        placeholder="Code"
                      />
                      <Button onClick={handleSaveEdit} size="sm" variant="outline" disabled={loading}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => setEditingId(null)} size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{country.name}</span>
                        {country.code && (
                          <span className="text-sm text-muted-foreground font-mono">({country.code})</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEdit(country)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(country.id)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
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
