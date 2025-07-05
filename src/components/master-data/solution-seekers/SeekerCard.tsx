import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Users, Building2, AlertCircle, Eye, UserPlus, UserCheck, UserX, RefreshCw, CheckCircle, RotateCcw } from 'lucide-react';
import type { SeekerDetails, ApprovalHandlers, ProcessingStates } from './types';
import ViewDetailsDialog from './ViewDetailsDialog';

interface SeekerCardProps {
  seeker: SeekerDetails;
  handlers: ApprovalHandlers;
  processing: ProcessingStates;
}

// Helper function to safely render values, converting objects to strings
const safeRender = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'object') {
    // If it's an object, try to get a meaningful string representation
    if (value.name) return value.name;
    if (value.title) return value.title;
    if (value.value) return value.value;
    return JSON.stringify(value);
  }
  return String(value);
};

// Helper function to get industry segment name from ID
const getIndustrySegmentDisplayName = (industrySegmentValue: any): string => {
  if (!industrySegmentValue) return '';
  
  // If it's already a string name, return it
  if (typeof industrySegmentValue === 'string' && !industrySegmentValue.startsWith('is_')) {
    return industrySegmentValue;
  }
  
  // Try to load industry segments from master data
  try {
    const savedData = localStorage.getItem('master_data_industry_segments');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data && data.industrySegments && Array.isArray(data.industrySegments)) {
        const segment = data.industrySegments.find((seg: any) => 
          seg.id === industrySegmentValue || seg.industrySegment === industrySegmentValue
        );
        if (segment) {
          return segment.industrySegment;
        }
      }
    }
  } catch (error) {
    console.error('Error loading industry segments for display:', error);
  }
  
  // Fallback: return the original value
  return String(industrySegmentValue);
};

const loadEngagementPricingDetails = (seeker: SeekerDetails) => {
  // Try to get membership/pricing data from localStorage
  const membershipKeys = [
    `membership_${seeker.userId}`,
    `membership_${seeker.organizationId}`,
    `${seeker.organizationName}_membership`,
    'selected_membership_plan',
    'completed_membership_payment'
  ];

  const pricingKeys = [
    `pricing_${seeker.userId}`,
    `selected_pricing_${seeker.organizationId}`,
    'selected_engagement_model',
    'engagement_model_selection'
  ];

  let membershipData = null;
  let pricingData = null;

  // Check for membership data
  for (const key of membershipKeys) {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.status || parsed.plan || parsed.membershipStatus || parsed.selectedPlan)) {
          membershipData = parsed;
          console.log('🎯 Found membership data for key:', key, parsed);
          break;
        }
      } catch (e) {
        // Continue checking other keys
      }
    }
  }

  // Check for pricing data
  for (const key of pricingKeys) {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.engagementModel || parsed.selectedModel || parsed.currency || parsed.pricing)) {
          pricingData = parsed;
          console.log('🎯 Found pricing data for key:', key, parsed);
          break;
        }
      } catch (e) {
        // Continue checking other keys
      }
    }
  }

  return { membershipData, pricingData };
};

const SeekerCard: React.FC<SeekerCardProps> = ({ seeker, handlers, processing }) => {
  const { membershipData, pricingData } = loadEngagementPricingDetails(seeker);
  
  console.log('🎯 Rendering seeker card:', seeker.organizationName, 'Status:', seeker.approvalStatus);
  
  const handleApprovalWithConfirmation = async (status: 'approved' | 'rejected') => {
    // Prevent double-clicks during processing
    if (processing.processingApproval === seeker.id) {
      console.log('⏳ Already processing approval for seeker:', seeker.organizationName);
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to ${status === 'approved' ? 'approve' : 'reject'} ${seeker.organizationName}?\n\nThis action will be saved and synchronized across all sessions.`
    );
    
    if (!confirmed) {
      console.log('❌ User cancelled approval action for:', seeker.organizationName);
      return;
    }

    await handlers.onApproval(seeker.id, status);
  };
  
  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          {safeRender(seeker.organizationName)}
        </CardTitle>
        <Badge variant={
          seeker.approvalStatus === 'approved' ? 'default' : 
          seeker.approvalStatus === 'rejected' ? 'destructive' : 'secondary'
        }>
          {seeker.approvalStatus}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span>{safeRender(seeker.organizationType)} • {safeRender(seeker.entityType)}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-gray-500" />
            <span>{safeRender(seeker.country)}</span>
          </div>
          <div>
            <span className="font-medium">Email:</span> {safeRender(seeker.email)}
          </div>
          <div>
            <span className="font-medium">Contact:</span> {safeRender(seeker.contactPersonName)}
          </div>
          <div>
            <span className="font-medium">Industry:</span> {getIndustrySegmentDisplayName(seeker.industrySegment)}
          </div>
          <div>
            <span className="font-medium">User ID:</span> {safeRender(seeker.userId)}
          </div>
        </div>
        
        {/* Engagement/Pricing Model Details */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
          <h4 className="font-medium text-blue-900 mb-2">Engagement & Pricing Details</h4>
          <div className="space-y-1 text-xs text-blue-800">
            {seeker.selectedPlan && (
              <div><span className="font-medium">Plan:</span> {safeRender(seeker.selectedPlan)}</div>
            )}
            {seeker.selectedEngagementModel && (
              <div><span className="font-medium">Model:</span> {safeRender(seeker.selectedEngagementModel)}</div>
            )}
            {membershipData?.selectedPlan && (
              <div><span className="font-medium">Selected Plan:</span> {safeRender(membershipData.selectedPlan)}</div>
            )}
            {membershipData?.paidAt && (
              <div><span className="font-medium">Paid At:</span> {new Date(membershipData.paidAt).toLocaleDateString()}</div>
            )}
            {pricingData?.engagementModel && (
              <div><span className="font-medium">Engagement:</span> {safeRender(pricingData.engagementModel)}</div>
            )}
            {pricingData?.currency && pricingData?.amount && (
              <div>
                <span className="font-medium">Pricing:</span> {safeRender(pricingData.currency)} {safeRender(pricingData.amount)} 
                {pricingData.frequency && ` (${safeRender(pricingData.frequency)})`}
              </div>
            )}
            {!seeker.selectedPlan && !seeker.selectedEngagementModel && !membershipData && !pricingData && (
              <div className="text-gray-500 italic">No engagement/pricing details found</div>
            )}
          </div>
        </div>
        
        {/* Action Buttons - Fixed Layout */}
        <div className="flex flex-col gap-3 mt-4 pt-3 border-t">
          {/* View Details Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </DialogTrigger>
            <ViewDetailsDialog seeker={seeker} handlers={handlers} processing={processing} />
          </Dialog>
          
          {/* Approval Buttons - Only show for pending seekers */}
          {seeker.approvalStatus === 'pending' && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => handleApprovalWithConfirmation('approved')}
                disabled={processing.processingApproval === seeker.id}
              >
                {processing.processingApproval === seeker.id ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-1" />
                )}
                {processing.processingApproval === seeker.id ? 'Processing...' : 'Approve'}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handlers.onReject(seeker)}
                disabled={processing.processingApproval === seeker.id}
              >
                <UserX className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
         
          {/* Rejected Status Actions */}
          {seeker.approvalStatus === 'rejected' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
              onClick={() => handlers.onReapprove(seeker)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reapprove
            </Button>
          )}
          
          {/* Create/Edit Admin Button - Only show for approved seekers */}
          {seeker.approvalStatus === 'approved' && (
            <Button 
              size="sm" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => handlers.onCreateAdmin(seeker)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {seeker.hasAdministrator ? 'Edit Administrator' : 'Create Administrator'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeekerCard;