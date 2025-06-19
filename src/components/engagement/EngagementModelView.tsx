
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Calendar, DollarSign } from 'lucide-react';

interface EngagementSelection {
  model: string;
  duration: string;
  pricing: {
    currency: string;
    originalAmount: number;
    discountedAmount?: number;
    frequency: string;
  };
  selectedAt: string;
}

interface EngagementModelViewProps {
  selection: EngagementSelection | null;
  onSelectModel: () => void;
  onModifySelection: () => void;
}

const EngagementModelView: React.FC<EngagementModelViewProps> = ({
  selection,
  onSelectModel,
  onModifySelection
}) => {
  console.log('🔍 EngagementModelView received selection:', selection);

  if (!selection) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            Engagement Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              No engagement model selected. Choose your preferred engagement model and pricing.
            </p>
            <Button onClick={onSelectModel}>
              <Settings className="h-4 w-4 mr-2" />
              Select Engagement Model
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isDiscounted = selection.pricing.discountedAmount !== undefined;
  const effectiveAmount = isDiscounted ? selection.pricing.discountedAmount! : selection.pricing.originalAmount;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            Selected Engagement Model
          </div>
          <Button variant="outline" size="sm" onClick={onModifySelection}>
            <Settings className="h-4 w-4 mr-2" />
            Modify Selection
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Engagement Model</label>
                <p className="text-lg font-semibold">{selection.model}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Duration</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="font-medium">{selection.duration}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Pricing</label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  {isDiscounted ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600">
                        ${effectiveAmount}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${selection.pricing.originalAmount}
                      </span>
                      <Badge variant="secondary" className="text-xs">Member Price</Badge>
                    </div>
                  ) : (
                    <span className="text-lg font-bold">${effectiveAmount}</span>
                  )}
                  <span className="text-sm text-gray-500">/{selection.pricing.frequency}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Selected On</label>
                <p className="text-sm text-gray-800">
                  {new Date(selection.selectedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {isDiscounted && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Member Benefit Applied:</strong> You're saving ${selection.pricing.originalAmount - effectiveAmount} 
                per {selection.pricing.frequency} with your premium membership!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementModelView;
