import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Users, Building2, AlertCircle, Eye, UserPlus, UserCheck, UserX, RefreshCw, CheckCircle, RotateCcw, Lock, CreditCard, DollarSign } from 'lucide-react';
import type { SeekerDetails, ApprovalHandlers, ProcessingStates } from './types';
import ViewDetailsDialog from './ViewDetailsDialog';
import { EngagementValidator } from '@/utils/engagementValidator';
import { loadEngagementPricingDetails } from './utils/viewDetailsHelpers';
import { debugAllPaymentData } from '@/utils/debugPaymentData';

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

const SeekerCard: React.FC<SeekerCardProps> = ({ seeker, handlers, processing }) => {
  // Enhanced debugging with comprehensive payment data analysis
  React.useEffect(() => {
    console.log(`🎯 SeekerCard: Analyzing payment data for ${seeker.organizationName}`);
    
    // Run comprehensive debugging for all organizations
    debugAllPaymentData();
    
    // Run specific analysis for this organization
    const { analyzeOrganizationPaymentData } = require('@/utils/debugPaymentData');
    analyzeOrganizationPaymentData(seeker.organizationName, seeker.organizationId || seeker.userId);
  }, [seeker.organizationName, seeker.organizationId, seeker.userId]);
  
  // Use the enhanced data loading from viewDetailsHelpers
  const { membershipData, pricingData, adminExists } = loadEngagementPricingDetails(seeker);
  
  // Debug: Log the loaded data for this seeker
  console.log(`💳 SeekerCard: Loading payment data for ${seeker.organizationName}:`, {
    membershipData,
    pricingData,
    hasData: !!(membershipData?.paymentStatus || pricingData?.paymentStatus),
    membershipStatus: membershipData?.paymentStatus,
    pricingStatus: pricingData?.paymentStatus
  });
  
  // Validate engagement details for this seeker
  const engagementValidation = EngagementValidator.validateSeekerEngagement(
    seeker.id, 
    seeker.organizationId, 
    seeker.organizationName
  );
  
  console.log('🎯 Rendering seeker card:', seeker.organizationName, 'Status:', seeker.approvalStatus, 'Engagement Valid:', engagementValidation.isValid);
  
  const handleApprovalWithConfirmation = async (status: 'approved' | 'rejected') => {
    // Check engagement validation first
    if (!engagementValidation.isValid) {
      alert(EngagementValidator.getValidationMessage(engagementValidation));
      return;
    }

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
        
        {/* Enhanced Membership & Engagement Payment Details - ALWAYS SHOW */}
        <div className="mt-4 space-y-3">
          {/* Comprehensive Debug Info */}
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-xs text-yellow-800 space-y-1">
              <div className="font-semibold">🔍 DEBUG ANALYSIS</div>
              <div><strong>Organization:</strong> {seeker.organizationName} ({seeker.organizationId || seeker.userId})</div>
              <div><strong>Data Sources:</strong> Membership: {membershipData?.dataSource || 'none'} | Engagement: {pricingData?.dataSource || 'none'}</div>
              <div><strong>Payment Status:</strong> 
                Member: {membershipData?.paymentStatus === 'paid' ? '✅ PAID' : '❌ UNPAID'} | 
                Engagement: {pricingData?.paymentStatus === 'paid' ? '✅ PAID' : '❌ UNPAID'}
              </div>
              {pricingData?.engagementModel && (
                <div><strong>Engagement Selected:</strong> {pricingData.engagementModel} ({pricingData.selectedFrequency || 'no frequency'})</div>
              )}
            </div>
          </div>
          
          {/* Membership Details */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-green-900">Membership Status</h4>
            </div>
            <div className="space-y-1 text-xs text-green-800">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant={membershipData?.paymentStatus === 'paid' ? 'default' : 'destructive'} className="text-xs">
                  {membershipData?.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                </Badge>
              </div>
              {membershipData?.paymentStatus === 'paid' && membershipData?.paymentAmount > 0 && (
                <div><span className="font-medium">Amount:</span> {membershipData.paymentCurrency} {membershipData.paymentAmount}</div>
              )}
              {membershipData?.paidAt && (
                <div><span className="font-medium">Paid On:</span> {new Date(membershipData.paidAt).toLocaleDateString()}</div>
              )}
              {membershipData?.type && (
                <div><span className="font-medium">Plan:</span> {safeRender(membershipData.type)}</div>
              )}
              {!membershipData && (
                <div className="text-gray-500 italic">No membership data found</div>
              )}
            </div>
          </div>

          {/* Engagement Model Details */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Engagement Model</h4>
            </div>
            <div className="space-y-1 text-xs text-blue-800">
              {pricingData?.engagementModel && (
                <div><span className="font-medium">Model:</span> {safeRender(pricingData.engagementModel)}</div>
              )}
              {pricingData?.selectedFrequency && (
                <div><span className="font-medium">Frequency:</span> {safeRender(pricingData.selectedFrequency)}</div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-medium">Payment:</span>
                <Badge variant={pricingData?.paymentStatus === 'paid' ? 'default' : 'destructive'} className="text-xs">
                  {pricingData?.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                </Badge>
              </div>
              {pricingData?.paymentStatus === 'paid' && pricingData?.paymentAmount > 0 && (
                <div><span className="font-medium">Amount:</span> {pricingData.paymentCurrency} {pricingData.paymentAmount}</div>
              )}
              {pricingData?.paidAt && (
                <div><span className="font-medium">Paid On:</span> {new Date(pricingData.paidAt).toLocaleDateString()}</div>
              )}
              {!pricingData?.engagementModel && (
                <div className="text-red-500 italic">No engagement model selected</div>
              )}
            </div>
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
            <>
              {/* Engagement Validation Warning */}
              {!engagementValidation.isValid && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-800 mb-2">
                    <Lock className="h-4 w-4" />
                    <span className="font-medium text-sm">Engagement Details Required</span>
                  </div>
                  <p className="text-xs text-amber-700 mb-2">
                    {EngagementValidator.getValidationMessage(engagementValidation)}
                  </p>
                  {engagementValidation.missingDetails.length > 0 && (
                    <div className="text-xs text-amber-700">
                      <strong>Missing:</strong> {engagementValidation.missingDetails.join(', ')}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`flex-1 ${
                    engagementValidation.isValid 
                      ? 'text-green-600 border-green-600 hover:bg-green-50' 
                      : 'text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => handleApprovalWithConfirmation('approved')}
                  disabled={processing.processingApproval === seeker.id || !engagementValidation.isValid}
                >
                  {processing.processingApproval === seeker.id ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : engagementValidation.isValid ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <Lock className="h-4 w-4 mr-1" />
                  )}
                  {processing.processingApproval === seeker.id ? 'Processing...' : 'Approve'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`flex-1 ${
                    engagementValidation.isValid 
                      ? 'text-red-600 border-red-600 hover:bg-red-50' 
                      : 'text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => {
                    if (!engagementValidation.isValid) {
                      alert(EngagementValidator.getValidationMessage(engagementValidation));
                      return;
                    }
                    handlers.onReject(seeker);
                  }}
                  disabled={processing.processingApproval === seeker.id || !engagementValidation.isValid}
                >
                  {engagementValidation.isValid ? (
                    <UserX className="h-4 w-4 mr-1" />
                  ) : (
                    <Lock className="h-4 w-4 mr-1" />
                  )}
                  Reject
                </Button>
              </div>
            </>
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