
import React from 'react';
import { Globe } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';

const CountriesManager: React.FC = () => {
  const { items: countries, loading, addItem, updateItem, deleteItem, refreshItems } = useMasterDataCRUD('master_countries');
  const [newCountry, setNewCountry] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', code: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (newCountry.name.trim()) {
      const success = await addItem(newCountry);
      if (success) {
        setNewCountry({ name: '', code: '' });
        setIsAdding(false);
      }
    }
  };

  const handleEdit = (country: any) => {
    setEditingId(country.id);
    setEditingValue({ name: country.name, code: country.code || '' });
  };

  const handleSaveEdit = async () => {
    if (editingId && editingValue.name.trim()) {
      const success = await updateItem(editingId, editingValue);
      if (success) {
        setEditingId(null);
        setEditingValue({ name: '', code: '' });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      await deleteItem(id);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <h2 className="text-2xl font-bold">Countries Manager</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Country
          </Button>
        </div>
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
          <Button onClick={handleAdd} size="sm" disabled={loading}>
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
          No countries configured.
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
                      onClick={() => handleDelete(country.id!)} 
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
    </div>
  );
};

export default CountriesManager;
