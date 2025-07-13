import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Plus, Upload, Download, BarChart3, Settings } from 'lucide-react';
import { PricingConfigurationFilters } from './PricingConfigurationFilters';
import { PricingConfigurationGrid } from './PricingConfigurationGrid';
import { PricingConfigurationStats } from './PricingConfigurationStats';
import { PricingConfigurationDialog } from './PricingConfigurationDialog';
import { usePricingConfiguration } from '../../../hooks/usePricingConfiguration';

const EngagementPricingManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('configurations');
  
  const {
    configurations,
    loading,
    filters,
    setFilters,
    masterData,
    loadConfigurations,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration
  } = usePricingConfiguration();

  const handleAddNew = () => {
    setEditingConfig(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (config: any) => {
    setEditingConfig(config);
    setIsDialogOpen(true);
  };

  const handleSave = async (configData: any) => {
    try {
      if (editingConfig) {
        await updateConfiguration(editingConfig.id, configData);
      } else {
        await createConfiguration(configData);
      }
      setIsDialogOpen(false);
      setEditingConfig(null);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this pricing configuration?')) {
      try {
        await deleteConfiguration(id);
      } catch (error) {
        console.error('Failed to delete configuration:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Engagement Pricing Configuration
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Configure pricing models for different engagement types and organizational contexts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={loadConfigurations} variant="outline" size="sm" disabled={loading}>
                <Settings className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleAddNew} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="configurations" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configurations" className="space-y-4">
          {/* Filters */}
          <PricingConfigurationFilters
            filters={filters}
            onFiltersChange={setFilters}
            masterData={masterData}
            loading={loading}
          />

          {/* Configuration Grid */}
          <PricingConfigurationGrid
            configurations={configurations}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={(config) => {
              setEditingConfig({ ...config, id: null });
              setIsDialogOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <PricingConfigurationStats configurations={configurations} />
        </TabsContent>
      </Tabs>

      {/* Configuration Dialog */}
      <PricingConfigurationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        configuration={editingConfig}
        masterData={masterData}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};

export default EngagementPricingManager;