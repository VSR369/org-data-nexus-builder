
import React from 'react';
import OrganizationRegistrationForm from '../components/forms/OrganizationRegistrationForm';

const OrganizationRegistration = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Organization Registration</h1>
          <p className="text-lg text-muted-foreground">
            Join our platform as a Solution Seeking or Solution Providing organization
          </p>
        </div>
        <OrganizationRegistrationForm />
      </div>
    </div>
  );
};

export default OrganizationRegistration;
