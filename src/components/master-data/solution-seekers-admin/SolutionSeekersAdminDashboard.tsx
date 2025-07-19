import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, RefreshCw, Users, Building2, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { OrganizationDataService, type SolutionSeekerData, type ExistingAdmin } from '@/services/OrganizationDataService';
import OrganizationPreviewCard from './OrganizationPreviewCard';
import AdminCreationDialog from './AdminCreationDialog';
import AdminEditDialog from './AdminEditDialog';
import ComprehensiveDataView from './ComprehensiveDataView';

interface SeekerWithAdmin extends SolutionSeekerData {
  existingAdmin?: ExistingAdmin | null;
}

const SolutionSeekersAdminDashboard: React.FC = () => {
  const [seekers, setSeekers] = useState<SeekerWithAdmin[]>([]);
  const [filteredSeekers, setFilteredSeekers] = useState<SeekerWithAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSeeker, setSelectedSeeker] = useState<SolutionSeekerData | null>(null);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDataView, setShowDataView] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSolutionSeekers();
  }, []);

  useEffect(() => {
    filterSeekers();
  }, [seekers, searchTerm, statusFilter]);

  const loadSolutionSeekers = async () => {
    try {
      setLoading(true);
      const data = await OrganizationDataService.getAllSolutionSeekers();
      
      // Fetch admin data for each organization
      const seekersWithAdmins = await Promise.all(
        data.map(async (seeker) => {
          try {
            const adminData = await OrganizationDataService.getOrganizationAdmin(seeker.organization_id);
            return { ...seeker, existingAdmin: adminData };
          } catch (error) {
            console.warn(`Failed to fetch admin for ${seeker.organization_id}:`, error);
            return { ...seeker, existingAdmin: null };
          }
        })
      );
      
      setSeekers(seekersWithAdmins);
      console.log('✅ Loaded solution seekers with admin data:', seekersWithAdmins.length);
    } catch (error) {
      console.error('❌ Error loading solution seekers:', error);
      toast({
        title: "Error",
        description: "Failed to load solution seekers data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSeekers = () => {
    let filtered = seekers;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(seeker =>
        seeker.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seeker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seeker.contact_person_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(seeker => seeker.overall_status === statusFilter);
    }

    setFilteredSeekers(filtered);
  };

  const handleCreateAdmin = (seeker: SolutionSeekerData) => {
    setSelectedSeeker(seeker);
    setShowAdminDialog(true);
  };

  const handleEditAdmin = (seeker: SolutionSeekerData) => {
    setSelectedSeeker(seeker);
    setShowEditDialog(true);
  };

  const handleViewDetails = (seeker: SolutionSeekerData) => {
    setSelectedSeeker(seeker);
    setShowDataView(true);
  };

  const handleAdminCreated = () => {
    setShowAdminDialog(false);
    toast({
      title: "✅ Administrator Created",
      description: "Organization administrator has been successfully created",
    });
    loadSolutionSeekers(); // Refresh data to show updated admin status
  };

  const handleAdminUpdated = () => {
    setShowEditDialog(false);
    toast({
      title: "✅ Administrator Updated",
      description: "Organization administrator has been successfully updated",
    });
    loadSolutionSeekers(); // Refresh data to show updated admin info
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active Member':
        return 'default';
      case 'Pending Activation':
        return 'secondary';
      case 'Registered - No Engagement':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Active Member', label: 'Active Members' },
    { value: 'Pending Activation', label: 'Pending Activation' },
    { value: 'Registered - No Engagement', label: 'Registered Only' },
    { value: 'Registration Only', label: 'Registration Only' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading solution seekers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Solution Seekers Directory</h2>
          <Badge variant="outline">{filteredSeekers.length} organizations</Badge>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Button
            variant="outline"
            onClick={loadSolutionSeekers}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by organization name, email, or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active Member">Active Members</SelectItem>
                  <SelectItem value="Pending Activation">Pending Activation</SelectItem>
                  <SelectItem value="Registered - No Engagement">Registered Only</SelectItem>
                  <SelectItem value="Registration Only">Registration Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {filteredSeekers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Organizations Found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== 'all' 
                ? 'No organizations match your search criteria. Try adjusting your filters.'
                : 'No solution-seeking organizations have been registered yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSeekers.map((seeker) => (
            <OrganizationPreviewCard
              key={seeker.id}
              seeker={seeker}
              existingAdmin={seeker.existingAdmin}
              onCreateAdmin={() => handleCreateAdmin(seeker)}
              onEditAdmin={() => handleEditAdmin(seeker)}
              onViewDetails={() => handleViewDetails(seeker)}
            />
          ))}
        </div>
      )}

      {/* Admin Creation Dialog */}
      {showAdminDialog && selectedSeeker && (
        <AdminCreationDialog
          isOpen={showAdminDialog}
          onClose={() => setShowAdminDialog(false)}
          seeker={selectedSeeker}
          onAdminCreated={handleAdminCreated}
        />
      )}

      {/* Admin Edit Dialog */}
      {showEditDialog && selectedSeeker && (
        <AdminEditDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          seeker={selectedSeeker}
          existingAdmin={seekers.find(s => s.id === selectedSeeker.id)?.existingAdmin!}
          onAdminUpdated={handleAdminUpdated}
        />
      )}

      {/* Comprehensive Data View Dialog */}
      {showDataView && selectedSeeker && (
        <ComprehensiveDataView
          isOpen={showDataView}
          onClose={() => setShowDataView(false)}
          seeker={selectedSeeker}
        />
      )}
    </div>
  );
};

export default SolutionSeekersAdminDashboard;
