import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, UserPlus, RefreshCw, RotateCcw } from 'lucide-react';
import type { SeekerDetails, ApprovalHandlers, ProcessingStates } from './types';

interface ViewDetailsDialogProps {
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

const ViewDetailsDialog: React.FC<ViewDetailsDialogProps> = ({ seeker, handlers, processing }) => {
  const { membershipData, pricingData } = loadEngagementPricingDetails(seeker);
  
  console.log('👁️ ViewDetailsDialog rendering for seeker:', seeker.organizationName, 'Approval Status:', seeker.approvalStatus);
  
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
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {seeker.organizationName} - Detailed View
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Organization Details</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Name:</span> {safeRender(seeker.organizationName)}</div>
              <div><span className="font-medium">Type:</span> {safeRender(seeker.organizationType)}</div>
              <div><span className="font-medium">Entity:</span> {safeRender(seeker.entityType)}</div>
              <div><span className="font-medium">Country:</span> {safeRender(seeker.country)}</div>
              <div><span className="font-medium">Industry:</span> {getIndustrySegmentDisplayName(seeker.industrySegment)}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Contact Person:</span> {safeRender(seeker.contactPersonName)}</div>
              <div><span className="font-medium">Email:</span> {safeRender(seeker.email)}</div>
              <div><span className="font-medium">User ID:</span> {safeRender(seeker.userId)}</div>
              <div><span className="font-medium">Org ID:</span> {safeRender(seeker.organizationId)}</div>
            </div>
          </div>
        </div>

        {/* Registration Information */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Registration Details</h4>
          <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
            <div><span className="font-medium">Registered:</span> {new Date(seeker.registrationTimestamp).toLocaleString()}</div>
            <div><span className="font-medium">Last Login:</span> {seeker.lastLoginTimestamp ? new Date(seeker.lastLoginTimestamp).toLocaleString() : 'Never'}</div>
            <div><span className="font-medium">Version:</span> {seeker.version}</div>
          </div>
        </div>

        {/* Membership & Pricing Details */}
        {(membershipData || pricingData) && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Engagement & Pricing</h4>
            <div className="bg-blue-50 p-3 rounded text-sm space-y-2">
              {membershipData && (
                <div className="space-y-1">
                  <div><span className="font-medium">Membership Status:</span> {safeRender(membershipData.status)}</div>
                  {membershipData.selectedPlan && <div><span className="font-medium">Plan:</span> {safeRender(membershipData.selectedPlan)}</div>}
                  {membershipData.paidAt && <div><span className="font-medium">Paid At:</span> {new Date(membershipData.paidAt).toLocaleDateString()}</div>}
                </div>
              )}
              {pricingData && (
                <div className="space-y-1">
                  {pricingData.engagementModel && <div><span className="font-medium">Engagement Model:</span> {safeRender(pricingData.engagementModel)}</div>}
                  {pricingData.currency && pricingData.amount && (
                    <div><span className="font-medium">Pricing:</span> {safeRender(pricingData.currency)} {safeRender(pricingData.amount)}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Approval Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Approval Status:</span>
            <Badge variant={
              seeker.approvalStatus === 'approved' ? 'default' : 
              seeker.approvalStatus === 'rejected' ? 'destructive' : 'secondary'
            }>
              {seeker.approvalStatus}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            {seeker.approvalStatus === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => handleApprovalWithConfirmation('approved')}
                  disabled={processing.processingApproval === seeker.id}
                >
                  {processing.processingApproval === seeker.id ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <UserCheck className="h-4 w-4 mr-1" />
                  )}
                  {processing.processingApproval === seeker.id ? 'Processing...' : 'Approve'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => handlers.onReject(seeker)}
                  disabled={processing.processingApproval === seeker.id}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {seeker.approvalStatus === 'rejected' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-orange-600 border-orange-600 hover:bg-orange-50"
                onClick={() => handlers.onReapprove(seeker)}
                disabled={processing.processingApproval === seeker.id}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reapprove
              </Button>
            )}
            
            {seeker.approvalStatus === 'approved' && (
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handlers.onCreateAdmin(seeker)}
                disabled={processing.processingAdmin === seeker.id}
              >
                {processing.processingAdmin === seeker.id ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-1" />
                )}
                {processing.processingAdmin === seeker.id ? 'Processing...' : (seeker.hasAdministrator ? 'Edit Administrator' : 'Create Administrator')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ViewDetailsDialog;