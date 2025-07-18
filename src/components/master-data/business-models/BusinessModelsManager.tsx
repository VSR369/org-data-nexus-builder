import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, RefreshCw, Grid, List } from 'lucide-react';
import { BusinessModelCard } from './BusinessModelCard';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';

export const BusinessModelsManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [businessModels, setBusinessModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { items: tierConfigurations, loading: tierLoading, refreshItems: refreshTiers } = useMasterDataCRUD('master_tier_configurations');
  const { items: platformFormulas, loading: formulaLoading, refreshItems: refreshFormulas } = useMasterDataCRUD('master_platform_fee_formulas');

  useEffect(() => {
    if (!tierLoading && !formulaLoading) {
      const consolidatedModels = tierConfigurations.map(tier => {
        const marketplaceGeneralFormula = platformFormulas.find(
          f => f.engagement_model_name === 'Market Place' && 
              f.engagement_model_subtype_name === 'General' && 
              f.country_id === tier.country_id
        );
        const marketplaceProgramManagedFormula = platformFormulas.find(
          f => f.engagement_model_name === 'Market Place' && 
              f.engagement_model_subtype_name === 'Program Managed' && 
              f.country_id === tier.country_id
        );
        const aggregatorFormula = platformFormulas.find(
          f => f.engagement_model_name === 'Aggregator' && f.country_id === tier.country_id
        );

        return {
          ...tier,
          marketplaceGeneralFormula: marketplaceGeneralFormula || null,
          marketplaceProgramManagedFormula: marketplaceProgramManagedFormula || null,
          aggregatorFormula: aggregatorFormula || null,
        };
      }).sort((a, b) => {
        // Map level_order to desired order: Basic (1), Standard (2), Premium (3)
        const getOrder = (level_order: number) => {
          if (level_order === 1) return 1; // Basic
          if (level_order === 2) return 2; // Standard  
          if (level_order === 3) return 3; // Premium
          return level_order || 999; // fallback
        };
        
        return getOrder(a.level_order || 0) - getOrder(b.level_order || 0);
      });

      setBusinessModels(consolidatedModels);
      setLoading(false);
    }
  }, [tierConfigurations, platformFormulas, tierLoading, formulaLoading]);

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([refreshTiers(), refreshFormulas()]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Business Models
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-8 px-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
          <p className="text-muted-foreground">
            Consolidated view of pricing tiers with Marketplace and Aggregator model details
          </p>
        </CardHeader>
      </Card>

      {/* Business Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-full">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : businessModels.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No business models found</h3>
              <p className="text-muted-foreground">Configure tier configurations to see business models.</p>
            </div>
          </div>
        ) : (
          businessModels.map((model) => (
            <BusinessModelCard key={model.id} model={model} />
          ))
        )}
      </div>
    </div>
  );
};