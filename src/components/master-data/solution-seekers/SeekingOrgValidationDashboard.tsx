import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import RejectionDialog from '../RejectionDialog';
import { 
  Building2, 
  DollarSign,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import ViewDetailsDialog from './ViewDetailsDialog';
import ComprehensiveOrgView from './components/ComprehensiveOrgView';
import ValidationCenter from './components/ValidationCenter';
import SeekerCard from './SeekerCard';
import type { SeekerDetails } from './types';
import { useSeekerValidation } from './hooks/useSeekerValidation';

const SeekingOrgValidationDashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<SeekerDetails | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const {
    seekers,
    setSeekers,
    loading,
    error,
    comprehensiveData,
    processing,
    refreshSeekers,
    loadComprehensiveOrgData,
    handleApproval,
    handleCreateAdmin,
    downloadSeekersData,
    getUpdatedSeeker
  } = useSeekerValidation();

  // Handle seeker updates from the dialog
  const handleSeekerUpdate = (updatedSeeker: SeekerDetails) => {
    console.log('🔄 Dashboard: Received seeker update from dialog:', updatedSeeker.organizationName, updatedSeeker.approvalStatus);
    
    // Update the selected seeker
    setSelectedSeeker(updatedSeeker);
    
    // Update the seekers array
    setSeekers(prevSeekers => 
      prevSeekers.map(seeker => 
        seeker.id === updatedSeeker.id ? updatedSeeker : seeker
      )
    );
  };

  // Auto-sync selected seeker when seekers array changes
  React.useEffect(() => {
    if (selectedSeeker && dialogOpen) {
      const updatedSeeker = getUpdatedSeeker(selectedSeeker.id);
      if (updatedSeeker && updatedSeeker.approvalStatus !== selectedSeeker.approvalStatus) {
        console.log('🔄 Dashboard: Auto-syncing selected seeker with updated data');
        setSelectedSeeker(updatedSeeker);
      }
    }
  }, [seekers, selectedSeeker, dialogOpen, getUpdatedSeeker]);


  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedSeekerForRejection, setSelectedSeekerForRejection] = useState<SeekerDetails | null>(null);

  const handleReject = (seeker: SeekerDetails) => {
    setSelectedSeekerForRejection(seeker);
    setRejectionDialogOpen(true);
  };

  const handleRejectionStatusChange = async (seekerId: string, status: 'approved' | 'rejected', reason: string, documents?: File[]) => {
    try {
      await handleApproval(seekerId, status, reason, documents);
      setRejectionDialogOpen(false);
      setSelectedSeekerForRejection(null);
    } catch (error) {
      console.error('Error in rejection status change:', error);
    }
  };

  const handleReapprove = (seeker: SeekerDetails) => {
    setSelectedSeekerForRejection(seeker);
    setRejectionDialogOpen(true);
  };


  const approvalHandlers = {
    onApproval: handleApproval,
    onReject: handleReject,
    onReapprove: handleReapprove,
    onCreateAdmin: handleCreateAdmin
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading validation dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error loading data</span>
          </div>
          <p className="text-destructive/80 mt-1">{error}</p>
          <Button onClick={refreshSeekers} className="mt-3" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${isMobile ? "space-y-4" : "flex items-center justify-between"}`}>
        <div>
          <h1 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>Solution Seekers Validation Dashboard</h1>
          <p className={`text-muted-foreground mt-1 ${isMobile ? "text-sm" : ""}`}>
            Found {seekers.length} solution seeker{seekers.length !== 1 ? 's' : ''} in the system
          </p>
        </div>
        <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
          <Button onClick={refreshSeekers} variant="outline" className={isMobile ? "w-full" : ""}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={downloadSeekersData} variant="outline" className={isMobile ? "w-full" : ""}>
            <DollarSign className="h-4 w-4 mr-2" />
            Download Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="organizations" className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${isMobile ? "text-xs" : ""}`}>
          <TabsTrigger value="organizations" className={isMobile ? "text-xs px-2" : ""}>
            {isMobile ? "Orgs" : "Organizations"}
          </TabsTrigger>
          <TabsTrigger value="comprehensive" className={isMobile ? "text-xs px-2" : ""}>
            {isMobile ? "Details" : "Comprehensive View"}
          </TabsTrigger>
          <TabsTrigger value="validation" className={isMobile ? "text-xs px-2" : ""}>
            {isMobile ? "Validation" : "Validation Center"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-4">
          <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-6`}>
            {seekers.map(seeker => (
              <SeekerCard 
                key={seeker.id}
                seeker={seeker}
                handlers={approvalHandlers}
                processing={processing}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comprehensive" className="space-y-4">
          {!selectedOrg ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an Organization</h3>
                  <p className="text-muted-foreground">
                    Click "View Details" on an organization to see comprehensive information
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ComprehensiveOrgView data={comprehensiveData} />
          )}
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <ValidationCenter seekers={seekers} isMobile={isMobile} />
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedSeeker && (
          <ViewDetailsDialog 
            seeker={selectedSeeker}
            handlers={approvalHandlers}
            processing={processing}
            onSeekerUpdate={handleSeekerUpdate}
          />
        )}
      </Dialog>

      {/* Rejection Dialog */}
      {selectedSeekerForRejection && (
        <RejectionDialog
          open={rejectionDialogOpen}
          onOpenChange={setRejectionDialogOpen}
          seeker={selectedSeekerForRejection}
          onStatusChange={handleRejectionStatusChange}
        />
      )}
    </div>
  );
};


export default SeekingOrgValidationDashboard;