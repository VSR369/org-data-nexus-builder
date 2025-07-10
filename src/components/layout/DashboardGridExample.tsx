
import React from 'react';
import ResponsiveDashboardWrapper from './ResponsiveDashboardWrapper';
import ResponsiveCard from './ResponsiveCard';
import { useDashboardResponsive } from '@/hooks/useDashboardResponsive';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Settings } from 'lucide-react';

const DashboardGridExample: React.FC = () => {
  const { recommendedLayout, isMobile } = useDashboardResponsive();

  // Sample data for demonstration
  const dashboardItems = [
    { id: 1, title: 'Analytics', subtitle: 'View performance metrics', content: 'Sample analytics content' },
    { id: 2, title: 'Reports', subtitle: 'Generate reports', content: 'Sample reports content' },
    { id: 3, title: 'Settings', subtitle: 'Configure system', content: 'Sample settings content' },
    { id: 4, title: 'Users', subtitle: 'Manage users', content: 'Sample users content' },
  ];

  return (
    <ResponsiveDashboardWrapper
      layout={recommendedLayout}
      minItemWidth={300}
      gap="md"
      padding="lg"
      showBackground={true}
      maxHeight="calc(100vh - 200px)"
    >
      {dashboardItems.map((item) => (
        <ResponsiveCard
          key={item.id}
          title={item.title}
          subtitle={item.subtitle}
          hoverable={true}
          scrollable={true}
          headerContent={
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
                {!isMobile && <span className="ml-1">Refresh</span>}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
                {!isMobile && <span className="ml-1">Settings</span>}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p>{item.content}</p>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </ResponsiveCard>
      ))}
    </ResponsiveDashboardWrapper>
  );
};

export default DashboardGridExample;
