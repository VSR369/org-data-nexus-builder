
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PricingTiersManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pricing Tiers Manager</h2>
        <p className="text-muted-foreground">Manage pricing tiers and subscription levels</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Pricing Tiers management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTiersManager;
