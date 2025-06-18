
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle, Clock, Plus } from 'lucide-react';
import { useMembershipData } from "./hooks/useMembershipData";

interface EngagementModelStatusCardProps {
  onSelectEngagementModel?: () => void;
}

const EngagementModelStatusCard: React.FC<EngagementModelStatusCardProps> = ({
  onSelectEngagementModel
}) => {
  const { membershipData, loading } = useMembershipData();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Target className="h-6 w-6 text-purple-600" />
          Engagement Model Status & Pricing
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Loading engagement model details...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {membershipData?.hasActualSelection && membershipData?.selectedEngagementModel ? (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-purple-900">Selected Engagement Model</h4>
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmed
                    </Badge>
                  </div>
                  <p className="text-purple-800 font-medium mb-2">{membershipData.selectedEngagementModel}</p>
                  
                  {membershipData.pricingDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-purple-200">
                      <div>
                        <label className="text-xs text-purple-600 uppercase tracking-wide">Currency</label>
                        <p className="text-sm font-medium text-purple-900">
                          {membershipData.pricingDetails.currency}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-purple-600 uppercase tracking-wide">Amount</label>
                        <p className="text-sm font-medium text-purple-900">
                          {membershipData.pricingDetails.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-purple-600 uppercase tracking-wide">Frequency</label>
                        <p className="text-sm font-medium text-purple-900 capitalize">
                          {membershipData.pricingDetails.paymentFrequency}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-yellow-900">No Engagement Model Selected</h4>
                      <p className="text-sm text-yellow-800">
                        Choose an engagement model to define how you'll work with solution providers
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={onSelectEngagementModel}
                    variant="outline"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Select Model
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagementModelStatusCard;
