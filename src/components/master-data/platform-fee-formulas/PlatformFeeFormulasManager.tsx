import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, Upload, Download, Grid, List } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { StructuredFormulaDialog } from './StructuredFormulaDialog';

export const PlatformFeeFormulasManager: React.FC = () => {
  const [isStructuredDialogOpen, setIsStructuredDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  const {
    items: formulas,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  } = useMasterDataCRUD('master_platform_fee_formulas');

  const handleAddNew = () => {
    setEditingItem(null);
    setIsStructuredDialogOpen(true);
  };

  const handleEdit = (formula: any) => {
    setEditingItem(formula);
    setIsStructuredDialogOpen(true);
  };

  const handleSave = async (formulaData: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, formulaData);
      } else {
        await addItem(formulaData);
      }
      setIsStructuredDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save platform fee formula:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this platform fee formula?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Failed to delete platform fee formula:', error);
      }
    }
  };

  // Helper function to generate configuration summary
  const getConfigurationSummary = (row: any) => {
    const engagementModel = row.engagement_model_name || 'Unknown Model';
    const subtype = row.engagement_model_subtype_name;
    return subtype ? `${engagementModel} (${subtype})` : engagementModel;
  };

  // Helper function to generate dynamic formula expression
  const getFormulaExpression = (row: any) => {
    const engagementModel = row.engagement_model_name;
    
    if (engagementModel === 'Aggregator') {
      return `Platform Fee = ${row.platform_usage_fee_percentage || 0}% of transaction value`;
    } else if (engagementModel === 'Market Place') {
      const parts = [];
      if (row.platform_usage_fee_percentage > 0) {
        parts.push(`Platform: ${row.platform_usage_fee_percentage}%`);
      }
      if (row.base_management_fee > 0) {
        parts.push(`Management: ${row.currency_symbol}${row.base_management_fee} × complexity`);
      }
      if (row.base_consulting_fee > 0) {
        parts.push(`Consulting: ${row.currency_symbol}${row.base_consulting_fee} × complexity`);
      }
      return parts.join(' + ');
    }
    
    return row.formula_expression || 'No formula defined';
  };

  // Helper function to get relevant configuration for engagement model
  const getRelevantConfiguration = (row: any) => {
    const engagementModel = row.engagement_model_name;
    
    if (engagementModel === 'Aggregator') {
      return (
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            Platform Usage: {row.platform_usage_fee_percentage || 0}%
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Membership Discount: {row.membership_discount_percentage || 0}%
          </Badge>
        </div>
      );
    } else if (engagementModel === 'Market Place') {
      return (
        <div className="flex flex-wrap gap-1">
          {row.platform_usage_fee_percentage > 0 && (
            <Badge variant="outline" className="text-xs">
              Platform: {row.platform_usage_fee_percentage}%
            </Badge>
          )}
          {row.base_management_fee > 0 && (
            <Badge variant="outline" className="text-xs">
              Management: {row.currency_symbol}{row.base_management_fee}
            </Badge>
          )}
          {row.base_consulting_fee > 0 && (
            <Badge variant="outline" className="text-xs">
              Consulting: {row.currency_symbol}{row.base_consulting_fee}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            Membership Discount: {row.membership_discount_percentage || 0}%
          </Badge>
        </div>
      );
    }
    
    return <span className="text-muted-foreground text-sm">No configuration</span>;
  };

  // Formula Card Component
  const FormulaCard = ({ formula }: { formula: any }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {getConfigurationSummary(formula)}
            </CardTitle>
            <div className="mt-1">
              <Badge variant={formula.is_active ? 'default' : 'secondary'}>
                {formula.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Engagement Model */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-1">Engagement Model</h4>
          <div>
            <span className="font-medium text-base">
              {formula.engagement_model_name || 'Unknown Model'}
            </span>
            {formula.engagement_model_subtype_name && (
              <div className="font-medium text-sm text-primary">
                {formula.engagement_model_subtype_name}
              </div>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-1">Country</h4>
          <div>
            <span className="font-medium">
              {formula.country_name || 'Unknown Country'}
            </span>
            <div className="text-xs text-muted-foreground">
              {formula.currency_name} ({formula.currency_symbol})
            </div>
          </div>
        </div>

        {/* Formula Expression */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Formula Expression</h4>
          <code className="bg-muted px-3 py-2 rounded text-sm block">
            {getFormulaExpression(formula)}
          </code>
        </div>

        {/* Configuration */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Configuration</h4>
          {getRelevantConfiguration(formula)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(formula)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(formula.id)}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const columns = [
    {
      accessorKey: 'configuration_summary',
      header: 'Configuration Summary',
      cell: ({ row }: any) => (
        <div className="font-medium">
          {getConfigurationSummary(row.original)}
        </div>
      ),
    },
    {
      accessorKey: 'engagement_model_name',
      header: 'Engagement Model',
      cell: ({ row }: any) => (
        <div>
          <span className="font-medium text-base">
            {row.original.engagement_model_name || 'Unknown Model'}
          </span>
          {row.original.engagement_model_subtype_name && (
            <div className="font-medium text-sm text-primary">
              {row.original.engagement_model_subtype_name}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'country_name',
      header: 'Country',
      cell: ({ row }: any) => (
        <div>
          <span className="font-medium">
            {row.original.country_name || 'Unknown Country'}
          </span>
          <div className="text-xs text-muted-foreground">
            {row.original.currency_name} ({row.original.currency_symbol})
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'formula_expression',
      header: 'Formula Expression',
      cell: ({ row }: any) => (
        <div className="max-w-xs">
          <code className="bg-muted px-2 py-1 rounded text-sm">
            {getFormulaExpression(row.original)}
          </code>
        </div>
      ),
    },
    {
      accessorKey: 'configuration',
      header: 'Configuration',
      cell: ({ row }: any) => getRelevantConfiguration(row.original),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>
          {row.getValue('is_active') ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Platform Fee Formulas
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Configure dynamic formulas for calculating platform fees based on variables
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4 mr-2" />
                  Table View
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="h-8 px-3"
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Card View
                </Button>
              </div>
              
              <div className="w-px h-6 bg-border" />
              
              <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
                <Calculator className="h-4 w-4 mr-2" />
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
                Add Formula
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Data Display */}
      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={formulas}
              loading={loading}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-full">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-16 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : formulas.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No formulas found</h3>
                <p className="text-muted-foreground mb-4">Get started by creating your first platform fee formula.</p>
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Formula
                </Button>
              </div>
            </div>
          ) : (
            formulas.map((formula) => (
              <FormulaCard key={formula.id} formula={formula} />
            ))
          )}
        </div>
      )}

      {/* Dialogs */}
      <StructuredFormulaDialog
        open={isStructuredDialogOpen}
        onOpenChange={setIsStructuredDialogOpen}
        formula={editingItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};