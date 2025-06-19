import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Building2, AlertCircle, CheckCircle, RefreshCw, Download, Eye, UserPlus, UserCheck, UserX, RotateCcw } from 'lucide-react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { useToast } from "@/hooks/use-toast";
import type { UserRecord } from '@/services/types';
import AdminCreationDialog from './AdminCreationDialog';
import RejectionDialog from './RejectionDialog';

interface SeekerDetails extends UserRecord {
  approvalStatus: 'pending' | 'approved' | 'rejected';
  membershipStatus?: 'active' | 'inactive' | 'not-member';
  hasAdministrator?: boolean;
  administratorId?: string;
}

const SolutionSeekersValidation: React.FC = () => {
  const [seekers, setSeekers] = useState<SeekerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<SeekerDetails | null>(null);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [currentSeekerForAdmin, setCurrentSeekerForAdmin] = useState<SeekerDetails | null>(null);
  const [currentSeekerForRejection, setCurrentSeekerForRejection] = useState<SeekerDetails | null>(null);
  const [existingAdmin, setExistingAdmin] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadSeekers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Loading solution seekers...');
        await unifiedUserStorageService.initialize();
        const allUsers = await unifiedUserStorageService.getAllUsers();
        
        console.log('👥 All users retrieved:', allUsers.length);
        console.log('👥 Users data:', allUsers);
        
        // Enhanced filtering for solution seekers
        const solutionSeekers = allUsers.filter(user => {
          console.log('🔍 Checking user:', {
            userId: user.userId,
            entityType: user.entityType,
            organizationType: user.organizationType,
            organizationName: user.organizationName
          });
          
          // Check for solution-seeker entityType (with variations)
          const isSolutionSeeker = user.entityType?.toLowerCase().includes('solution') ||
                                 user.entityType?.toLowerCase().includes('seeker') ||
                                 user.entityType === 'solution-seeker' ||
                                 user.entityType === 'Solution Seeker';
          
          // Also check if organizationType indicates seeker
          const isOrgSeeker = user.organizationType?.toLowerCase().includes('seeker');
          
          console.log('🎯 Is solution seeker?', isSolutionSeeker || isOrgSeeker);
          
          return isSolutionSeeker || isOrgSeeker;
        }) as SeekerDetails[];
        
        console.log('✅ Solution seekers found:', solutionSeekers.length);
        console.log('📋 Solution seekers data:', solutionSeekers);
        
        // Check for existing administrators and update seeker records
        const existingAdmins = JSON.parse(localStorage.getItem('created_administrators') || '[]');
        const seekersWithAdminStatus = solutionSeekers.map(seeker => {
          const hasAdmin = existingAdmins.some((admin: any) => admin.sourceSeekerId === seeker.id);
          const adminRecord = existingAdmins.find((admin: any) => admin.sourceSeekerId === seeker.id);
          return {
            ...seeker,
            approvalStatus: 'pending' as const,
            hasAdministrator: hasAdmin,
            administratorId: adminRecord?.id
          };
        });
        
        // If no solution seekers found, show all users for debugging
        if (seekersWithAdminStatus.length === 0 && allUsers.length > 0) {
          console.log('⚠️ No solution seekers found, showing all users for analysis');
          setSeekers(allUsers.map(user => ({
            ...user,
            approvalStatus: 'pending' as const,
            hasAdministrator: false
          })));
        } else {
          setSeekers(seekersWithAdminStatus);
        }
        
      } catch (err: any) {
        console.error('❌ Error loading solution seekers:', err);
        setError(err.message || 'Failed to load solution seekers.');
      } finally {
        setLoading(false);
      }
    };

    loadSeekers();
  }, []);

  const handleApproval = async (seekerId: string, status: 'approved' | 'rejected', reason?: string, documents?: File[]) => {
    try {
      const updatedSeekers = seekers.map(seeker => 
        seeker.id === seekerId 
          ? { ...seeker, approvalStatus: status }
          : seeker
      );
      setSeekers(updatedSeekers);
      
      // Save approval/rejection status to localStorage for persistence
      const statusData = {
        seekerId,
        status,
        reason: reason || '',
        processedAt: new Date().toISOString(),
        processedBy: 'admin', // Could be dynamic based on current user
        documents: documents ? documents.map(file => ({ name: file.name, size: file.size, type: file.type })) : []
      };
      
      const existingStatuses = JSON.parse(localStorage.getItem('seeker_approvals') || '[]');
      const updatedStatuses = existingStatuses.filter((s: any) => s.seekerId !== seekerId);
      updatedStatuses.push(statusData);
      localStorage.setItem('seeker_approvals', JSON.stringify(updatedStatuses));
      
      // Store documents separately if provided
      if (documents && documents.length > 0) {
        const documentData = {
          seekerId,
          documents: await Promise.all(documents.map(async (file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            data: await file.arrayBuffer(),
            uploadedAt: new Date().toISOString()
          })))
        };
        
        const existingDocs = JSON.parse(localStorage.getItem('seeker_documents') || '[]');
        const updatedDocs = existingDocs.filter((doc: any) => doc.seekerId !== seekerId);
        updatedDocs.push(documentData);
        localStorage.setItem('seeker_documents', JSON.stringify(updatedDocs));
      }
      
      if (!reason) {
        toast({
          title: status === 'approved' ? "Seeker Approved" : "Seeker Rejected",
          description: `${seekers.find(s => s.id === seekerId)?.organizationName} has been ${status}.`,
          variant: status === 'approved' ? "default" : "destructive"
        });
      }
      
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast({
        title: "Error",
        description: "Failed to update approval status.",
        variant: "destructive"
      });
    }
  };

  const handleRejectClick = (seeker: SeekerDetails) => {
    setCurrentSeekerForRejection(seeker);
    setRejectionDialogOpen(true);
  };

  const handleReapproveClick = (seeker: SeekerDetails) => {
    setCurrentSeekerForRejection(seeker);
    setRejectionDialogOpen(true);
  };

  const handleCreateAdministrator = async (seeker: SeekerDetails) => {
    setCurrentSeekerForAdmin(seeker);
    
    // Check if administrator already exists for this seeker
    const existingAdmins = JSON.parse(localStorage.getItem('created_administrators') || '[]');
    const existingAdmin = existingAdmins.find((admin: any) => admin.sourceSeekerId === seeker.id);
    
    if (existingAdmin) {
      console.log('Found existing administrator:', existingAdmin);
      setExistingAdmin(existingAdmin);
    } else {
      setExistingAdmin(null);
    }
    
    setAdminDialogOpen(true);
  };

  const handleAdminCreated = async (adminData: any) => {
    try {
      // Update the seeker's status to show admin was created
      const updatedSeekers = seekers.map(seeker => 
        seeker.id === currentSeekerForAdmin?.id 
          ? { ...seeker, hasAdministrator: true, administratorId: adminData.id }
          : seeker
      );
      setSeekers(updatedSeekers);
      
      toast({
        title: existingAdmin ? "Administrator Updated" : "Administrator Created",
        description: `Administrator ${adminData.adminName} has been successfully ${existingAdmin ? 'updated' : 'created'}.`,
      });
      
    } catch (error) {
      console.error('Error updating seeker after admin creation:', error);
    }
  };

  // Load approval statuses from localStorage
  useEffect(() => {
    const loadApprovalStatuses = () => {
      try {
        const approvals = JSON.parse(localStorage.getItem('seeker_approvals') || '[]');
        setSeekers(prevSeekers => 
          prevSeekers.map(seeker => {
            const approval = approvals.find((a: any) => a.seekerId === seeker.id);
            return approval 
              ? { ...seeker, approvalStatus: approval.status }
              : seeker;
          })
        );
      } catch (error) {
        console.error('Error loading approval statuses:', error);
      }
    };

    if (seekers.length > 0) {
      loadApprovalStatuses();
    }
  }, [seekers.length]);

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(seekers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "solution_seekers_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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

  const handleRefresh = () => {
    setSeekers([]);
    setError(null);
    // Trigger reload
    const loadSeekers = async () => {
      setLoading(true);
      try {
        await unifiedUserStorageService.initialize();
        const allUsers = await unifiedUserStorageService.getAllUsers();
        const solutionSeekers = allUsers.filter(user => 
          user.entityType?.toLowerCase().includes('solution') ||
          user.entityType?.toLowerCase().includes('seeker') ||
          user.organizationType?.toLowerCase().includes('seeker')
        ) as SeekerDetails[];
        
        setSeekers(solutionSeekers.map(seeker => ({
          ...seeker,
          approvalStatus: 'pending' as const
        })));
      } catch (err: any) {
        setError(err.message || 'Failed to load solution seekers.');
      } finally {
        setLoading(false);
      }
    };
    loadSeekers();
  };

  const ViewDetailsDialog = ({ seeker }: { seeker: SeekerDetails }) => {
    const { membershipData, pricingData } = loadEngagementPricingDetails(seeker);
    
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
                <div><span className="font-medium">Industry:</span> {safeRender(seeker.industrySegment)}</div>
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
                    onClick={() => handleApproval(seeker.id, 'approved')}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleRejectClick(seeker)}
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
                  onClick={() => handleReapproveClick(seeker)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reapprove
                </Button>
              )}
              
              {seeker.approvalStatus === 'approved' && (
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleCreateAdministrator(seeker)}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Create Admin
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading solution seekers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error loading data</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <Button onClick={handleRefresh} className="mt-3" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Solution Seekers Validation</h1>
          <p className="text-gray-600 mt-1">
            Found {seekers.length} solution seeker{seekers.length !== 1 ? 's' : ''} in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleDownloadData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Data
          </Button>
        </div>
      </div>

      {seekers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No solution seekers found</h3>
          <p className="text-gray-500 mb-4">
            No users with entity type 'solution-seeker' or organization type containing 'seeker' were found in the system.
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seekers.map(seeker => {
            const { membershipData, pricingData } = loadEngagementPricingDetails(seeker);
            
            return (
              <Card key={seeker.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
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
                      <span className="font-medium">Industry:</span> {safeRender(seeker.industrySegment)}
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
                      <ViewDetailsDialog seeker={seeker} />
                    </Dialog>
                    
                    {/* Approval Buttons */}
                    {seeker.approvalStatus === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleApproval(seeker.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleRejectClick(seeker)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    {/* Create Admin Button */}
                    {seeker.approvalStatus === 'approved' && (
                      <Button 
                        size="sm" 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleCreateAdministrator(seeker)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {seeker.hasAdministrator ? 'Edit Administrator' : 'Create Administrator'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Administrator Creation Dialog */}
      {currentSeekerForAdmin && (
        <AdminCreationDialog
          open={adminDialogOpen}
          onOpenChange={setAdminDialogOpen}
          seeker={currentSeekerForAdmin}
          onAdminCreated={handleAdminCreated}
          existingAdmin={existingAdmin}
        />
      )}

      {/* Rejection Dialog */}
      {currentSeekerForRejection && (
        <RejectionDialog
          open={rejectionDialogOpen}
          onOpenChange={setRejectionDialogOpen}
          seeker={currentSeekerForRejection}
          onStatusChange={handleApproval}
        />
      )}
    </div>
  );
};

export default SolutionSeekersValidation;
