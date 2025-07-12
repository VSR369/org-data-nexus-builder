import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, CreditCard, Users, Percent } from "lucide-react";

interface EngagementDataConfirmationProps {
  selectedEngagementModel: string;
  selectedFrequency?: string | null;
  membershipStatus: string;
  platformFeePercentage?: number;
  paymentAmount?: number;
  paymentDate?: string;
  membershipUpgraded?: boolean;
  originalPlatformFee?: number;
  discountedPlatformFee?: number;
}

export const EngagementDataConfirmation: React.FC<EngagementDataConfirmationProps> = ({
  selectedEngagementModel,
  selectedFrequency,
  membershipStatus,
  platformFeePercentage,
  paymentAmount,
  paymentDate,
  membershipUpgraded = false,
  originalPlatformFee,
  discountedPlatformFee
}) => {
  const isMarketplaceModel = ['Market Place', 'Market Place & Aggregator', 'Aggregator'].includes(selectedEngagementModel);
  const isPaaSModel = selectedEngagementModel === 'PaaS';

  return (
    <Card className="w-full bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          Engagement Activated Successfully
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Engagement Model Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Engagement Model</p>
              <p className="text-lg font-semibold text-blue-600">{selectedEngagementModel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-lg font-semibold text-green-600">
                {isPaaSModel ? 'Payment Completed' : 'Activated'}
              </p>
            </div>
          </div>
        </div>

        {/* Model-Specific Information */}
        {isMarketplaceModel && platformFeePercentage !== undefined && (
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-sm font-medium">Platform Fee</p>
              <p className="text-lg font-semibold text-purple-600">{platformFeePercentage}%</p>
            </div>
          </div>
        )}

        {isPaaSModel && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedFrequency && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Payment Frequency</p>
                  <p className="text-lg font-semibold text-orange-600 capitalize">{selectedFrequency}</p>
                </div>
              </div>
            )}

            {paymentAmount && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Amount Paid</p>
                  <p className="text-lg font-semibold text-red-600">₹{paymentAmount.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {paymentDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <div>
              <p className="text-sm font-medium">Payment Date</p>
              <p className="text-lg font-semibold text-gray-600">
                {new Date(paymentDate).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        )}

        {/* Membership Upgrade Summary */}
        {membershipUpgraded && originalPlatformFee && discountedPlatformFee && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-3">Membership Upgrade Benefits</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Original Platform Fee:</span>
                <span className="font-medium line-through text-red-500">{originalPlatformFee}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Discounted Platform Fee:</span>
                <span className="font-medium text-green-600">{discountedPlatformFee}%</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">You Save:</span>
                <span className="font-bold text-green-600">
                  {(originalPlatformFee - discountedPlatformFee).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Membership Status */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-600" />
          <div>
            <p className="text-sm font-medium">Membership Status</p>
            <p className="text-lg font-semibold text-indigo-600">
              {membershipStatus === 'member_paid' ? 'Annual Member' : 'Non-Member'}
            </p>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-green-800 font-medium text-center">
            🎉 Your {selectedEngagementModel} engagement is now active and ready to use!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};