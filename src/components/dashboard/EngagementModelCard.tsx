
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, CheckCircle } from 'lucide-react';
import { EngagementModel } from '@/components/master-data/engagement-models/types';

interface EngagementModelCardProps {
  selectedEngagementModel: EngagementModel | null;
  onSelectEngagementModel: () => void;
  showLoginWarning: boolean;
}

const EngagementModelCard: React.FC<EngagementModelCardProps> = ({
  selectedEngagementModel,
  onSelectEngagementModel,
  showLoginWarning
}) => {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Handshake className="h-6 w-6 text-purple-600" />
          Engagement Model Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedEngagementModel ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Selected Engagement Model</p>
                <p className="text-lg font-semibold text-green-700">
                  {selectedEngagementModel.name}
                </p>
                <p className="text-sm text-green-600">
                  {selectedEngagementModel.description}
                </p>
              </div>
            </div>
            <Button 
              onClick={onSelectEngagementModel}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              Change Model
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Your Engagement Model</h3>
              <p className="text-gray-600">
                Choose an engagement model that defines how services are delivered and managed 
                for your organization.
              </p>
            </div>
            <Button 
              onClick={onSelectEngagementModel}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 text-lg font-semibold"
              size="lg"
              disabled={showLoginWarning}
            >
              <Handshake className="mr-2 h-5 w-5" />
              Select Model
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagementModelCard;
