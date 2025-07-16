import React, { useState } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Import simplified data table component
import { useSystemConfigurations } from '@/hooks/useMasterDataCRUD';
import { SystemConfigurationDialog } from './SystemConfigurationDialog';

export const SystemConfigurationsManager: React.FC = () => {
  const { items: configs, loading, addItem, updateItem, deleteItem, refreshItems } = useSystemConfigurations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConfigs = configs.filter(config =>
    config.config_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingConfig(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (config: any) => {
    setEditingConfig(config);
    setIsDialogOpen(true);
  };

  const handleSave = async (configData: any) => {
    const success = editingConfig
      ? await updateItem(editingConfig.id, configData)
      : await addItem(configData);
    
    if (success) {
      setIsDialogOpen(false);
      setEditingConfig(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  const columns = [
    {
      accessorKey: 'config_key',
      header: 'Configuration Key',
    },
    {
      accessorKey: 'config_value',
      header: 'Value',
    },
    {
      accessorKey: 'data_type',
      header: 'Data Type',
      cell: ({ row }: any) => (
        <span className="px-2 py-1 rounded bg-muted text-xs">
          {row.original.data_type}
        </span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'is_system_config',
      header: 'System Config',
      cell: ({ row }: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.original.is_system_config 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.original.is_system_config ? 'System' : 'User'}
        </span>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.original.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>
          {!row.original.is_system_config && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            System Configurations
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={refreshItems}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search configurations..."
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
                  {columns.map((column, index) => (
                    <th key={index} className="p-3 text-left">{column.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="p-3 text-center">Loading...</td>
                  </tr>
                ) : filteredConfigs.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="p-3 text-center">No data found</td>
                  </tr>
                ) : (
                  filteredConfigs.map((config) => (
                    <tr key={config.id} className="border-b">
                      <td className="p-3">{config.config_key}</td>
                      <td className="p-3">{config.config_value}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded bg-muted text-xs">
                          {config.data_type}
                        </span>
                      </td>
                      <td className="p-3">{config.category}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          config.is_system_config 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {config.is_system_config ? 'System' : 'User'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          config.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {config.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(config)}
                          >
                            Edit
                          </Button>
                          {!config.is_system_config && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(config.id)}
                            >
                              Delete
                            </Button>
                          )}
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

      <SystemConfigurationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        config={editingConfig}
        onSave={handleSave}
      />
    </div>
  );
};