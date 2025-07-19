
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';

const CurrenciesManager: React.FC = () => {
  const { items: currencies, loading, addItem, updateItem, deleteItem, refreshItems } = useMasterDataCRUD('master_currencies');
  const [newCurrency, setNewCurrency] = useState({ name: '', code: '', symbol: '', country: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', code: '', symbol: '', country: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (newCurrency.name.trim()) {
      const success = await addItem(newCurrency);
      if (success) {
        setNewCurrency({ name: '', code: '', symbol: '', country: '' });
        setIsAdding(false);
      }
    }
  };

  const handleEdit = (currency: any) => {
    setEditingId(currency.id);
    setEditingValue({ 
      name: currency.name, 
      code: currency.code || '', 
      symbol: currency.symbol || '',
      country: currency.country || ''
    });
  };

  const handleSaveEdit = async () => {
    if (editingId && editingValue.name.trim()) {
      const success = await updateItem(editingId, editingValue);
      if (success) {
        setEditingId(null);
        setEditingValue({ name: '', code: '', symbol: '', country: '' });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this currency?')) {
      await deleteItem(id);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          <h2 className="text-2xl font-bold">Currencies Manager</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Currency
          </Button>
        </div>
      </div>

      {isAdding && (
        <div className="grid grid-cols-4 gap-2 mb-4 p-3 border rounded-lg bg-muted">
          <Input
            value={newCurrency.name}
            onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
            placeholder="Currency name"
          />
          <Input
            value={newCurrency.code}
            onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value })}
            placeholder="Code (USD)"
          />
          <Input
            value={newCurrency.symbol}
            onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
            placeholder="Symbol ($)"
          />
          <Input
            value={newCurrency.country}
            onChange={(e) => setNewCurrency({ ...newCurrency, country: e.target.value })}
            placeholder="Country"
          />
          <div className="col-span-4 flex gap-2">
            <Button onClick={handleAdd} size="sm" disabled={loading}>
              <Check className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsAdding(false)} size="sm" variant="outline">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-center py-8">Loading...</p>
      ) : currencies.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No currencies configured.
        </p>
      ) : (
        <div className="space-y-2">
          {currencies.map((currency) => (
            <div key={currency.id} className="flex items-center justify-between p-3 border rounded-lg">
              {editingId === currency.id ? (
                <div className="grid grid-cols-4 gap-2 flex-1 mr-4">
                  <Input
                    value={editingValue.name}
                    onChange={(e) => setEditingValue({ ...editingValue, name: e.target.value })}
                    placeholder="Name"
                  />
                  <Input
                    value={editingValue.code}
                    onChange={(e) => setEditingValue({ ...editingValue, code: e.target.value })}
                    placeholder="Code"
                  />
                  <Input
                    value={editingValue.symbol}
                    onChange={(e) => setEditingValue({ ...editingValue, symbol: e.target.value })}
                    placeholder="Symbol"
                  />
                  <Input
                    value={editingValue.country}
                    onChange={(e) => setEditingValue({ ...editingValue, country: e.target.value })}
                    placeholder="Country"
                  />
                  <div className="col-span-4 flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm" variant="outline" disabled={loading}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{currency.name}</span>
                    <span className="text-sm text-muted-foreground font-mono">
                      {currency.code} {currency.symbol}
                    </span>
                    {currency.country && (
                      <span className="text-sm text-muted-foreground">({currency.country})</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleEdit(currency)} 
                      size="sm" 
                      variant="outline"
                      disabled={loading}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => handleDelete(currency.id!)} 
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

export default CurrenciesManager;
