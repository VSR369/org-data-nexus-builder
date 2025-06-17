import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Inbox, Users, Calendar, Building, MapPin, Phone, Mail, Globe, FileText, X, Eye, Download, CheckCircle, UserPlus, XCircle } from 'lucide-react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { UserRecord } from '@/services/types';
import { useToast } from "@/hooks/use-toast";

interface SeekerDetails extends UserRecord {
  membershipStatus?: 'active' | 'inactive';
  engagementModel?: any;
  pricingPlan?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  adminDetails?: SeekerAdminDetails;
  declineReason?: string;
  declinedAt?: string;
}

interface SeekerAdminDetails {
  name: string;
  contactNumber: string;
  email: string;
  userId: string;
  password: string;
  createdAt: string;
}

const SolutionSeekersValidation: React.FC = () => {
  const [seekers, setSeekers] = useState<SeekerDetails[]>([]);
  const [selectedSeeker, setSelectedSeeker] = useState<SeekerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [seekerToApprove, setSeekerToApprove] = useState<SeekerDetails | null>(null);
  const [seekerToDecline, setSeekerToDecline] = useState<SeekerDetails | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [adminDetails, setAdminDetails] = useState<SeekerAdminDetails>({
    name: '',
    contactNumber: '',
    email: '',
    userId: '',
    password: '',
    createdAt: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSeekers();
  }, []);

  const loadSeekers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading all registered solution seekers...');
      
      // Ensure service is initialized first
      await unifiedUserStorageService.initialize();
      
      const allUsers = await unifiedUserStorageService.getAllUsers();
      console.log('📊 Retrieved users:', allUsers.length);
      
      // Filter for the specific seekers mentioned (GE and VSR369) and others
      const filteredSeekers = allUsers.filter(user => 
        user.organizationName?.toLowerCase().includes('ge') || 
        user.userId?.toLowerCase().includes('vsr369') ||
        user.organizationName?.toLowerCase().includes('vsr369') ||
        user.userId?.toLowerCase().includes('ge')
      );
      
      console.log('🎯 Found matching seekers:', filteredSeekers.length);
      
      // Enhance user data with membership and engagement model information
      const enhancedSeekers = allUsers.map(user => {
        const seekerDetails: SeekerDetails = { ...user, approvalStatus: 'pending' };
        
        // Check membership status
        try {
          const membershipData = localStorage.getItem('completed_membership_payment');
          if (membershipData) {
            const parsedMembership = JSON.parse(membershipData);
            if (parsedMembership.userId === user.userId) {
              seekerDetails.membershipStatus = parsedMembership.membershipStatus || 'inactive';
            }
          }
        } catch (error) {
          console.error('Error loading membership data:', error);
        }
        
        // Check engagement model selection
        try {
          const engagementData = localStorage.getItem('engagement_model_selection');
          if (engagementData) {
            const parsedEngagement = JSON.parse(engagementData);
            if (parsedEngagement.userId === user.userId) {
              seekerDetails.engagementModel = parsedEngagement.engagementModel;
              seekerDetails.pricingPlan = parsedEngagement.pricingPlan;
            }
          }
        } catch (error) {
          console.error('Error loading engagement model data:', error);
        }
        
        return seekerDetails;
      });
      
      setSeekers(enhancedSeekers);
      console.log('✅ Loaded and enhanced seekers data:', enhancedSeekers.length);
      
      // Log specific seekers found
      const geSeeker = enhancedSeekers.find(s => 
        s.organizationName?.toLowerCase().includes('ge') || s.userId?.toLowerCase().includes('ge')
      );
      const vsrSeeker = enhancedSeekers.find(s => 
        s.organizationName?.toLowerCase().includes('vsr369') || s.userId?.toLowerCase().includes('vsr369')
      );
      
      if (geSeeker) {
        console.log('✅ Found GE seeker:', geSeeker.organizationName, geSeeker.userId);
      }
      if (vsrSeeker) {
        console.log('✅ Found VSR369 seeker:', vsrSeeker.organizationName, vsrSeeker.userId);
      }
      
    } catch (error) {
      console.error('❌ Error loading seekers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSeeker = (seeker: SeekerDetails) => {
    console.log('🔄 Initiating approval for seeker:', seeker.userId);
    setSeekerToApprove(seeker);
    setAdminDetails({
      name: '',
      contactNumber: '',
      email: '',
      userId: `${seeker.userId}_admin`,
      password: '',
      createdAt: ''
    });
    setShowApprovalDialog(true);
  };

  const handleDeclineSeeker = (seeker: SeekerDetails) => {
    console.log('🔄 Initiating decline for seeker:', seeker.userId);
    setSeekerToDecline(seeker);
    setDeclineReason('');
    setShowDeclineDialog(true);
  };

  const handleDeclineSubmit = async () => {
    if (!seekerToDecline) return;

    // Validate required field
    if (!declineReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for declining.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('💾 Saving decline details for seeker:', seekerToDecline.userId);
      
      // Create decline record
      const declineData = {
        seekerUserId: seekerToDecline.userId,
        organizationName: seekerToDecline.organizationName,
        approvalStatus: 'rejected',
        declineReason: declineReason.trim(),
        declinedAt: new Date().toISOString()
      };

      // Save decline details to localStorage
      const declineKey = `seeker_decline_${seekerToDecline.userId}`;
      localStorage.setItem(declineKey, JSON.stringify(declineData));
      
      // Also save to a master approvals list
      const existingApprovals = JSON.parse(localStorage.getItem('seeker_approvals') || '[]');
      existingApprovals.push(declineData);
      localStorage.setItem('seeker_approvals', JSON.stringify(existingApprovals));

      // Update the seeker's approval status in our local state
      setSeekers(prevSeekers => 
        prevSeekers.map(s => 
          s.userId === seekerToDecline.userId 
            ? { 
                ...s, 
                approvalStatus: 'rejected', 
                declineReason: declineReason.trim(),
                declinedAt: new Date().toISOString()
              }
            : s
        )
      );

      console.log('✅ Decline details saved successfully');
      
      toast({
        title: "Seeker Declined",
        description: `${seekerToDecline.organizationName} has been declined successfully.`,
        variant: "destructive",
      });

      // Close the dialog and reset state
      setShowDeclineDialog(false);
      setSeekerToDecline(null);
      setDeclineReason('');

    } catch (error) {
      console.error('❌ Error saving decline details:', error);
      toast({
        title: "Error",
        description: "Failed to save decline details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAdminDetailsSubmit = async () => {
    if (!seekerToApprove) return;

    // Validate required fields
    if (!adminDetails.name || !adminDetails.contactNumber || !adminDetails.email || !adminDetails.userId || !adminDetails.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('💾 Saving admin details for seeker:', seekerToApprove.userId);
      
      // Create admin details with timestamp
      const completeAdminDetails: SeekerAdminDetails = {
        ...adminDetails,
        createdAt: new Date().toISOString()
      };

      // Save admin details to localStorage (you can modify this to use IndexedDB if needed)
      const approvalKey = `seeker_approval_${seekerToApprove.userId}`;
      const approvalData = {
        seekerUserId: seekerToApprove.userId,
        organizationName: seekerToApprove.organizationName,
        approvalStatus: 'approved',
        adminDetails: completeAdminDetails,
        approvedAt: new Date().toISOString()
      };

      localStorage.setItem(approvalKey, JSON.stringify(approvalData));
      
      // Also save to a master approvals list
      const existingApprovals = JSON.parse(localStorage.getItem('seeker_approvals') || '[]');
      existingApprovals.push(approvalData);
      localStorage.setItem('seeker_approvals', JSON.stringify(existingApprovals));

      // Update the seeker's approval status in our local state
      setSeekers(prevSeekers => 
        prevSeekers.map(s => 
          s.userId === seekerToApprove.userId 
            ? { ...s, approvalStatus: 'approved', adminDetails: completeAdminDetails }
            : s
        )
      );

      console.log('✅ Admin details saved successfully');
      
      toast({
        title: "Approval Successful",
        description: `${seekerToApprove.organizationName} has been approved and admin details created.`,
      });

      // Close the dialog and reset state
      setShowApprovalDialog(false);
      setSeekerToApprove(null);
      setAdminDetails({
        name: '',
        contactNumber: '',
        email: '',
        userId: '',
        password: '',
        createdAt: ''
      });

    } catch (error) {
      console.error('❌ Error saving admin details:', error);
      toast({
        title: "Error",
        description: "Failed to save admin details. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load existing approvals when component mounts
  useEffect(() => {
    const loadApprovals = () => {
      try {
        const existingApprovals = JSON.parse(localStorage.getItem('seeker_approvals') || '[]');
        console.log('📋 Loaded existing approvals:', existingApprovals.length);
        
        // Update seekers with approval status
        setSeekers(prevSeekers => 
          prevSeekers.map(seeker => {
            const approval = existingApprovals.find((a: any) => a.seekerUserId === seeker.userId);
            if (approval) {
              return {
                ...seeker,
                approvalStatus: approval.approvalStatus,
                adminDetails: approval.adminDetails,
                declineReason: approval.declineReason,
                declinedAt: approval.declinedAt
              };
            }
            return { ...seeker, approvalStatus: 'pending' };
          })
        );
      } catch (error) {
        console.error('❌ Error loading approvals:', error);
      }
    };

    if (seekers.length > 0) {
      loadApprovals();
    }
  }, [seekers.length]);

  const handleSeekerDoubleClick = (seeker: SeekerDetails) => {
    console.log('📋 Opening details for seeker:', seeker.userId);
    setSelectedSeeker(seeker);
    setShowDetails(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getEntityTypeBadgeVariant = (entityType: string) => {
    switch (entityType?.toLowerCase()) {
      case 'private limited company':
      case 'corporation':
        return 'default';
      case 'partnership':
      case 'sole proprietorship':
        return 'secondary';
      case 'non-profit organization':
      case 'society':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p>Loading solution seekers...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Inbox className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl font-bold">Solution Seekers Validation</CardTitle>
              <p className="text-blue-100">
                Review and validate registered solution seeking organizations
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{seekers.length}</p>
                <p className="text-sm text-muted-foreground">Total Seekers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {seekers.filter(s => ['private limited company', 'corporation', 'partnership'].includes(s.entityType?.toLowerCase() || '')).length}
                </p>
                <p className="text-sm text-muted-foreground">Commercial</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {seekers.filter(s => ['non-profit organization', 'society'].includes(s.entityType?.toLowerCase() || '')).length}
                </p>
                <p className="text-sm text-muted-foreground">Non-Commercial</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {seekers.filter(s => s.membershipStatus === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {seekers.filter(s => s.approvalStatus === 'approved').length}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {seekers.filter(s => s.approvalStatus === 'rejected').length}
                </p>
                <p className="text-sm text-muted-foreground">Declined</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seekers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Registered Solution Seekers
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Double-click on any seeker to view detailed registration information. Click "Approve" or "Decline" to manage seeker status.
          </p>
        </CardHeader>
        
        <CardContent>
          {seekers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Solution Seekers Found</h3>
              <p className="text-gray-600">No solution seekers have registered yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seekers.map((seeker) => (
                    <TableRow 
                      key={seeker.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onDoubleClick={() => handleSeekerDoubleClick(seeker)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{seeker.organizationName}</p>
                          <p className="text-sm text-muted-foreground">{seeker.organizationType}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{seeker.userId}</TableCell>
                      <TableCell>
                        <Badge variant={getEntityTypeBadgeVariant(seeker.entityType)}>
                          {seeker.entityType}
                        </Badge>
                      </TableCell>
                      <TableCell>{seeker.country}</TableCell>
                      <TableCell>{seeker.industrySegment}</TableCell>
                      <TableCell>
                        <Badge variant={seeker.membershipStatus === 'active' ? 'default' : 'secondary'}>
                          {seeker.membershipStatus === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={seeker.approvalStatus === 'approved' ? 'default' : seeker.approvalStatus === 'rejected' ? 'destructive' : 'secondary'}>
                          {seeker.approvalStatus === 'approved' ? 'Approved' : seeker.approvalStatus === 'rejected' ? 'Declined' : 'Pending Approval'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(seeker.registrationTimestamp || seeker.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSeekerDoubleClick(seeker);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {seeker.approvalStatus === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveSeeker(seeker);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeclineSeeker(seeker);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Building className="h-6 w-6" />
              Solution Seeker Details
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDetails(false)}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedSeeker && (
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Organization Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Organization Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
                      <p className="font-semibold">{selectedSeeker.organizationName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Organization ID</label>
                      <p className="font-mono">{selectedSeeker.organizationId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Organization Type</label>
                      <p>{selectedSeeker.organizationType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                      <Badge variant={getEntityTypeBadgeVariant(selectedSeeker.entityType)}>
                        {selectedSeeker.entityType}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Industry Segment</label>
                      <p>{selectedSeeker.industrySegment}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Country</label>
                      <p>{selectedSeeker.country}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                      <p className="font-semibold">{selectedSeeker.contactPersonName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p>{selectedSeeker.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User ID</label>
                      <p className="font-mono">{selectedSeeker.userId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                      <p>{formatDate(selectedSeeker.registrationTimestamp || selectedSeeker.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Membership Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Membership & Engagement Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Membership Status</label>
                        <div className="mt-1">
                          <Badge variant={selectedSeeker.membershipStatus === 'active' ? 'default' : 'secondary'}>
                            {selectedSeeker.membershipStatus === 'active' ? 'Active Member' : 'Not a Member'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Engagement Model</label>
                        <p>{selectedSeeker.engagementModel?.name || 'Not Selected'}</p>
                      </div>
                    </div>
                    
                    {selectedSeeker.engagementModel && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Engagement Model Description</label>
                        <p className="text-sm mt-1">{selectedSeeker.engagementModel.description}</p>
                      </div>
                    )}
                    
                    {selectedSeeker.pricingPlan && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Selected Pricing Plan</label>
                        <Badge variant="outline" className="ml-2">
                          {selectedSeeker.pricingPlan.charAt(0).toUpperCase() + selectedSeeker.pricingPlan.slice(1)}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Approval Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Approval Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                        <div className="mt-1">
                          <Badge variant={selectedSeeker.approvalStatus === 'approved' ? 'default' : selectedSeeker.approvalStatus === 'rejected' ? 'destructive' : 'secondary'}>
                            {selectedSeeker.approvalStatus === 'approved' ? 'Approved' : selectedSeeker.approvalStatus === 'rejected' ? 'Declined' : 'Pending Approval'}
                          </Badge>
                        </div>
                      </div>
                      {selectedSeeker.approvalStatus === 'approved' && selectedSeeker.adminDetails && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Admin Created</label>
                          <p>{formatDate(selectedSeeker.adminDetails.createdAt)}</p>
                        </div>
                      )}
                      {selectedSeeker.approvalStatus === 'rejected' && selectedSeeker.declinedAt && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Declined Date</label>
                          <p>{formatDate(selectedSeeker.declinedAt)}</p>
                        </div>
                      )}
                    </div>

                    {selectedSeeker.approvalStatus === 'approved' && selectedSeeker.adminDetails && (
                      <div className="border rounded-lg p-4 bg-green-50">
                        <h4 className="font-medium text-green-800 mb-3">Admin Details</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-green-700">Name:</span>
                            <p>{selectedSeeker.adminDetails.name}</p>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">Contact:</span>
                            <p>{selectedSeeker.adminDetails.contactNumber}</p>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">Email:</span>
                            <p>{selectedSeeker.adminDetails.email}</p>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">User ID:</span>
                            <p className="font-mono">{selectedSeeker.adminDetails.userId}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedSeeker.approvalStatus === 'rejected' && selectedSeeker.declineReason && (
                      <div className="border rounded-lg p-4 bg-red-50">
                        <h4 className="font-medium text-red-800 mb-3">Decline Details</h4>
                        <div className="text-sm">
                          <span className="font-medium text-red-700">Reason:</span>
                          <p className="mt-1">{selectedSeeker.declineReason}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* System Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Record Version</label>
                      <p>{selectedSeeker.version}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                      <p>{formatDate(selectedSeeker.updatedAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create Seeker Admin
            </AlertDialogTitle>
            <AlertDialogDescription>
              Create admin access for {seekerToApprove?.organizationName}. Please fill in all the required details.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">Name *</Label>
              <Input
                id="adminName"
                value={adminDetails.name}
                onChange={(e) => setAdminDetails(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter admin name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminContact">Contact Number *</Label>
              <Input
                id="adminContact"
                value={adminDetails.contactNumber}
                onChange={(e) => setAdminDetails(prev => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="Enter contact number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email ID *</Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminDetails.email}
                onChange={(e) => setAdminDetails(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminUserId">User ID *</Label>
              <Input
                id="adminUserId"
                value={adminDetails.userId}
                onChange={(e) => setAdminDetails(prev => ({ ...prev, userId: e.target.value }))}
                placeholder="Enter user ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminPassword">Password *</Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminDetails.password}
                onChange={(e) => setAdminDetails(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAdminDetailsSubmit}>
              Submit & Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Dialog */}
      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Decline Seeker
            </AlertDialogTitle>
            <AlertDialogDescription>
              Decline access for {seekerToDecline?.organizationName}. Please provide a reason for declining.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="declineReason">Reason for Decline *</Label>
              <Textarea
                id="declineReason"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Enter reason for declining this seeker..."
                rows={4}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeclineDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeclineSubmit}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Submit & Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SolutionSeekersValidation;
