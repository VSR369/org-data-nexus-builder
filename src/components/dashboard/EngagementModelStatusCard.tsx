
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, Clock } from 'lucide-react';
import { useMembershipData } from "./hooks/useMembershipData";

const EngagementModelStatusCard: React.FC = () => {
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
            {membershipData?.selectedEngagementModel ? (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-purple-900">Current Engagement Model</h4>
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      {membershipData.status === 'active' ? 'Active' : 'Selected'}
                    </Badge>
                  </div>
                  <p className="text-purple-800 font-medium mb-2">{membershipData.selectedEngagementModel}</p>
                  
                  {membershipData.pricingDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-purple-200">
                      <div>
                        <label className="text-xs text-purple-600 uppercase tracking-wide">Pricing</label>
                        <p className="text-sm font-medium text-purple-900">
                          {membershipData.pricingDetails.currency} {membershipData.pricingDetails.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-purple-600 uppercase tracking-wide">Frequency</label>
                        <p className="text-sm font-medium text-purple-900 capitalize">
                          {membershipData.pricingDetails.paymentFrequency}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-purple-600 uppercase tracking-wide">Status</label>
                        <p className="text-sm font-medium text-purple-900 capitalize">
                          {membershipData.paymentStatus || 'Pending Setup'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {membershipData.activationDate && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        Engagement model activated on {formatDate(membershipData.activationDate)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <h4 className="font-medium text-gray-900">No Engagement Model Selected</h4>
                </div>
                <p className="text-sm text-gray-600">
                  This organization has not yet selected an engagement model for their membership.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagementModelStatusCard;
