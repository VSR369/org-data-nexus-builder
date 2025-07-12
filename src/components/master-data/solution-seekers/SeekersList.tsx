import React from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { SeekerDetails, ApprovalHandlers, ProcessingStates } from './types';
import SeekerCard from './SeekerCard';

interface SeekersListProps {
  seekers: SeekerDetails[];
  handlers: ApprovalHandlers;
  processing: ProcessingStates;
  onRefresh: () => void;
}

const SeekersList: React.FC<SeekersListProps> = ({ seekers, handlers, processing, onRefresh }) => {
  if (seekers.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No solution seekers found</h3>
        <p className="text-gray-500 mb-4">
          No users with entity type 'solution-seeker' or organization type containing 'seeker' were found in the system.
        </p>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {seekers.map(seeker => (
        <SeekerCard 
          key={seeker.id} 
          seeker={seeker} 
          handlers={handlers} 
          processing={processing} 
        />
      ))}
    </div>
  );
};

export default SeekersList;