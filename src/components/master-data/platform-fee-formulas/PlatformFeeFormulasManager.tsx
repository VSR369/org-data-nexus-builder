import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { StructuredFormulaDialog } from './StructuredFormulaDialog';

export const PlatformFeeFormulasManager: React.FC = () => {
  const [isStructuredDialogOpen, setIsStructuredDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
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
        </div>
      );
    }
    
    return <span className="text-muted-foreground text-sm">No configuration</span>;
  };

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

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={formulas}
            loading={loading}
          />
        </CardContent>
      </Card>

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