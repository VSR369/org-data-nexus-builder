import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, AlertCircle, CheckCircle, RefreshCw, Download, Trash2, Eye } from 'lucide-react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import type { UserRecord } from '@/services/types';

interface SeekerDetails extends UserRecord {
  approvalStatus: 'pending' | 'approved' | 'rejected';
  membershipStatus?: 'active' | 'inactive' | 'not-member';
}

const SolutionSeekersValidation: React.FC = () => {
  const [seekers, setSeekers] = useState<SeekerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeekers = async () => {
      setLoading(true);
      try {
        await unifiedUserStorageService.initialize();
        const allUsers = await unifiedUserStorageService.getAllUsers();
        
        // Filter for solution seekers and cast to SeekerDetails
        const solutionSeekers = allUsers.filter(user => user.entityType === 'solution-seeker') as SeekerDetails[];
        
        setSeekers(solutionSeekers);
      } catch (err: any) {
        setError(err.message || 'Failed to load solution seekers.');
      } finally {
        setLoading(false);
      }
    };

    loadSeekers();
  }, []);

  const handleApprove = async (seekerId: string) => {
    try {
      await unifiedUserStorageService.updateUser(seekerId, { approvalStatus: 'approved' });
      setSeekers(seekers.map(seeker =>
        seeker.id === seekerId ? { ...seeker, approvalStatus: 'approved' } : seeker
      ));
    } catch (err: any) {
      console.error('Error approving seeker:', err);
      alert('Failed to approve seeker.');
    }
  };

  const handleReject = async (seekerId: string) => {
    try {
      await unifiedUserStorageService.updateUser(seekerId, { approvalStatus: 'rejected' });
      setSeekers(seekers.map(seeker =>
        seeker.id === seekerId ? { ...seeker, approvalStatus: 'rejected' } : seeker
      ));
    } catch (err: any) {
      console.error('Error rejecting seeker:', err);
      alert('Failed to reject seeker.');
    }
  };

  const handleDelete = async (seekerId: string) => {
    if (window.confirm('Are you sure you want to delete this seeker?')) {
      try {
        await unifiedUserStorageService.deleteUser(seekerId);
        setSeekers(seekers.filter(seeker => seeker.id !== seekerId));
      } catch (err: any) {
        console.error('Error deleting seeker:', err);
        alert('Failed to delete seeker.');
      }
    }
  };

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(seekers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "solution_seekers_data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (loading) {
    return <div>Loading solution seekers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Solution Seekers Validation</h1>
        <Button onClick={handleDownloadData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Data
        </Button>
      </div>
      {seekers.length === 0 ? (
        <div className="text-gray-500">No solution seekers found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seekers.map(seeker => (
            <Card key={seeker.id} className="bg-white shadow-md rounded-md overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  {seeker.organizationName}
                </CardTitle>
                <Badge variant="secondary">{seeker.approvalStatus}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <Building2 className="h-4 w-4 inline-block mr-1" />
                    {seeker.organizationType} - {seeker.entityType}
                  </p>
                  <p>
                    <AlertCircle className="h-4 w-4 inline-block mr-1" />
                    {seeker.country}
                  </p>
                  <p>Email: {seeker.email}</p>
                  <p>Contact: {seeker.contactPersonName}</p>
                  <p>Membership: {seeker.membershipStatus || 'Not specified'}</p>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {seeker.approvalStatus === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleApprove(seeker.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(seeker.id)}>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(seeker.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolutionSeekersValidation;
