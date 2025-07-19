
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SelfEnrollmentForm from '@/components/transactions/SelfEnrollmentForm';

const ContributorEnrollment = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
        <SelfEnrollmentForm />
      </div>
    </div>
  );
};

export default ContributorEnrollment;
