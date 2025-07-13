import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Globe, DollarSign, Percent, Calendar, Target } from 'lucide-react';

interface PricingConfigurationStatsProps {
  configurations: any[];
}

export const PricingConfigurationStats: React.FC<PricingConfigurationStatsProps> = ({
  configurations
}) => {
  const stats = React.useMemo(() => {
    const total = configurations.length;
    const active = configurations.filter(c => c.is_active).length;
    const expired = configurations.filter(c => {
      const now = new Date();
      return c.effective_to && new Date(c.effective_to) < now;
    }).length;
    
    const expiringSoon = configurations.filter(c => {
      if (!c.effective_to) return false;
      const now = new Date();
      const expiry = new Date(c.effective_to);
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return expiry > now && expiry <= sevenDaysFromNow;
    }).length;

    const byEngagementModel = configurations.reduce((acc, config) => {
      const model = config.engagement_model || 'Unknown';
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCountry = configurations.reduce((acc, config) => {
      const country = config.country_name || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byOrganizationType = configurations.reduce((acc, config) => {
      const orgType = config.organization_type || 'Unknown';
      acc[orgType] = (acc[orgType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const withDiscount = configurations.filter(c => 
      c.membership_discount_percentage && c.membership_discount_percentage > 0
    ).length;

    const averageDiscount = configurations
      .filter(c => c.membership_discount_percentage > 0)
      .reduce((sum, c) => sum + (c.membership_discount_percentage || 0), 0) / 
      (configurations.filter(c => c.membership_discount_percentage > 0).length || 1);

    const percentageBasedConfigs = configurations.filter(c => c.is_percentage).length;
    const currencyBasedConfigs = total - percentageBasedConfigs;

    return {
      total,
      active,
      expired,
      expiringSoon,
      byEngagementModel,
      byCountry,
      byOrganizationType,
      withDiscount,
      averageDiscount,
      percentageBasedConfigs,
      currencyBasedConfigs
    };
  }, [configurations]);

  const StatCard = ({ title, value, icon: Icon, description, color = "default" }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    description?: string;
    color?: string;
  }): React.ReactElement => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color !== 'default' ? `text-${color}-500` : 'text-muted-foreground'}`} />
        </div>
      </CardContent>
    </Card>
  );

  const TopList = ({ title, data, icon: Icon }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(data)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([key, count]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium">{key}</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(count as number) / stats.total * 100} 
                    className="w-16 h-2" 
                  />
                  <Badge variant="outline" className="text-xs">
                    {count as number}
                  </Badge>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Configurations"
          value={stats.total}
          icon={BarChart3}
          description="All pricing configurations"
        />
        <StatCard
          title="Active Configurations"
          value={stats.active}
          icon={TrendingUp}
          description={`${((stats.active / stats.total) * 100).toFixed(1)}% of total`}
          color="green"
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          icon={Calendar}
          description="Within 7 days"
          color="yellow"
        />
        <StatCard
          title="Expired"
          value={stats.expired}
          icon={Target}
          description="Past effective date"
          color="red"
        />
      </div>

      {/* Pricing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="With Member Discount"
          value={stats.withDiscount}
          icon={Percent}
          description={`${((stats.withDiscount / stats.total) * 100).toFixed(1)}% of total`}
        />
        <StatCard
          title="Average Discount"
          value={`${stats.averageDiscount.toFixed(1)}%`}
          icon={TrendingUp}
          description="For configurations with discount"
        />
        <StatCard
          title="Percentage-Based"
          value={stats.percentageBasedConfigs}
          icon={Percent}
          description="Using percentage pricing"
        />
        <StatCard
          title="Currency-Based"
          value={stats.currencyBasedConfigs}
          icon={DollarSign}
          description="Using fixed amount pricing"
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopList
          title="By Engagement Model"
          data={stats.byEngagementModel}
          icon={Target}
        />
        <TopList
          title="By Country"
          data={stats.byCountry}
          icon={Globe}
        />
        <TopList
          title="By Organization Type"
          data={stats.byOrganizationType}
          icon={Users}
        />
      </div>

      {/* Configuration Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Configuration Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active</span>
                <span className="text-sm text-muted-foreground">{stats.active}</span>
              </div>
              <Progress value={(stats.active / stats.total) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Expiring Soon</span>
                <span className="text-sm text-muted-foreground">{stats.expiringSoon}</span>
              </div>
              <Progress 
                value={(stats.expiringSoon / stats.total) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Expired</span>
                <span className="text-sm text-muted-foreground">{stats.expired}</span>
              </div>
              <Progress 
                value={(stats.expired / stats.total) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">With Discounts</span>
                <span className="text-sm text-muted-foreground">{stats.withDiscount}</span>
              </div>
              <Progress 
                value={(stats.withDiscount / stats.total) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};