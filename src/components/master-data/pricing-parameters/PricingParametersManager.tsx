import React, { useState } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePricingParameters } from '@/hooks/useMasterDataCRUD';
import { PricingParameterDialog } from './PricingParameterDialog';

export const PricingParametersManager: React.FC = () => {
  const { items: parameters, loading, addItem, updateItem, deleteItem, refreshItems } = usePricingParameters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParameter, setEditingParameter] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParameters = parameters.filter(param =>
    param.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.organization_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingParameter(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (parameter: any) => {
    setEditingParameter(parameter);
    setIsDialogOpen(true);
  };

  const handleSave = async (parameterData: any) => {
    const success = editingParameter
      ? await updateItem(editingParameter.id, parameterData)
      : await addItem(parameterData);
    
    if (success) {
      setIsDialogOpen(false);
      setEditingParameter(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Pricing Parameters (Country/Currency Fees)
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={refreshItems}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Parameter
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search parameters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Country</th>
                  <th className="p-3 text-left">Organization Type</th>
                  <th className="p-3 text-left">Entity Type</th>
                  <th className="p-3 text-left">Fee Component</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Currency</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-3 text-center">Loading...</td>
                  </tr>
                ) : filteredParameters.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-3 text-center">No parameters found</td>
                  </tr>
                ) : (
                  filteredParameters.map((param) => (
                    <tr key={param.id} className="border-b">
                      <td className="p-3">{param.country}</td>
                      <td className="p-3">{param.organization_type}</td>
                      <td className="p-3">{param.entity_type}</td>
                      <td className="p-3">{param.fee_component}</td>
                      <td className="p-3">{param.amount}</td>
                      <td className="p-3">{param.currency}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          param.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {param.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(param)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(param.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PricingParameterDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        parameter={editingParameter}
        onSave={handleSave}
      />
    </div>
  );
};