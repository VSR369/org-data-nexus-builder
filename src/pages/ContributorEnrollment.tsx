
import React from 'react';
import SelfEnrollmentForm from '@/components/transactions/SelfEnrollmentForm';

const ContributorEnrollment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <SelfEnrollmentForm />
      </div>
    </div>
  );
};

export default ContributorEnrollment;
