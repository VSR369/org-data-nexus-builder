import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  CreditCard, 
  Target, 
  TrendingUp, 
  Settings, 
  Headphones, 
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { TierConfigurationDialog } from './TierConfigurationDialog';

interface TierConfigurationCardProps {
  item: any;
  onRefresh: () => void;
}

export const TierConfigurationCard: React.FC<TierConfigurationCardProps> = ({ item, onRefresh }) => {
  const formatCurrency = (amount: number) => {
    const currency = item.currency_symbol || '$';
    return `${currency}${amount?.toFixed(2) || '0.00'}`;
  };

  const getStatusVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />;
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {item.pricing_tier_name}
          </CardTitle>
          <Badge variant={getStatusVariant(item.is_active)} className="flex items-center gap-1">
            {getStatusIcon(item.is_active)}
            {item.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{item.country_name}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CreditCard className="w-4 h-4 text-primary" />
            Pricing Details
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Monthly Limit</span>
              <div className="font-medium">
                {item.monthly_challenge_limit ? `${item.monthly_challenge_limit} challenges` : 'Unlimited'}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Solutions/Challenge</span>
              <div className="font-medium">{item.solutions_per_challenge}</div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Fixed Charge</span>
              <div className="font-medium">{formatCurrency(item.fixed_charge_per_challenge)}</div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Overage Allowed</span>
              <Badge variant={item.allows_overage ? 'default' : 'secondary'} className="text-xs">
                {item.allows_overage ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Target className="w-4 h-4 text-primary" />
            Features & Services
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {item.analytics_access_name && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Analytics:</span>
                <span className="font-medium">{item.analytics_access_name}</span>
              </div>
            )}
            {item.onboarding_type_name && (
              <div className="flex items-center gap-2">
                <Settings className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Onboarding:</span>
                <span className="font-medium">{item.onboarding_type_name}</span>
              </div>
            )}
            {item.support_type_name && (
              <div className="flex items-center gap-2">
                <Headphones className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Support:</span>
                <span className="font-medium">{item.support_type_name}</span>
              </div>
            )}
            {item.workflow_template_name && (
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Workflow:</span>
                <span className="font-medium">{item.workflow_template_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t">
          <TierConfigurationDialog
            mode="edit"
            item={item}
            onSuccess={onRefresh}
          >
            <Button variant="outline" size="sm" className="gap-1 min-h-[36px]">
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </TierConfigurationDialog>
          <TierConfigurationDialog
            mode="delete"
            item={item}
            onSuccess={onRefresh}
          >
            <Button variant="destructive" size="sm" className="gap-1 min-h-[36px]">
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </TierConfigurationDialog>
        </div>
      </CardContent>
    </Card>
  );
};