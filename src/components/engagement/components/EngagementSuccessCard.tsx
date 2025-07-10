
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { isPaaSModel } from '@/utils/membershipPricingUtils';

interface EngagementSuccessCardProps {
  selectedEngagementModel: string;
}

export const EngagementSuccessCard: React.FC<EngagementSuccessCardProps> = ({
  selectedEngagementModel
}) => {
  const isPaaS = isPaaSModel(selectedEngagementModel);

  return (
    <Card className="w-full border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700 text-2xl font-semibold leading-none tracking-tight whitespace-nowrap">
          <CheckCircle className="w-5 h-5" />
          {isPaaS ? 'Engagement Payment Completed' : 'Engagement Activated'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <p className="text-green-700 font-medium">
            {isPaaS 
              ? 'Your engagement payment has been processed successfully!' 
              : 'Your engagement has been activated successfully!'
            }
          </p>
          <Badge variant="outline" className="mt-2 border-green-600 text-green-700">
            {selectedEngagementModel} - Active
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
