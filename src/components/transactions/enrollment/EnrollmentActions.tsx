
import React from 'react';
import { Button } from "@/components/ui/button";

interface EnrollmentActionsProps {
  onSubmitEnrollment: () => void;
  onSaveDraft: () => void;
  isSubmitted?: boolean;
}

const EnrollmentActions: React.FC<EnrollmentActionsProps> = ({
  onSubmitEnrollment,
  onSaveDraft,
  isSubmitted = false
}) => {
  return (
    <div className="flex gap-4 pt-6">
      <Button 
        type="button" 
        onClick={onSubmitEnrollment}
        className="flex-1"
        variant={isSubmitted ? "outline" : "default"}
      >
        {isSubmitted ? "Edit & Resubmit" : "Submit Enrollment"}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex-1"
        onClick={onSaveDraft}
      >
        Save as Draft
      </Button>
    </div>
  );
};

export default EnrollmentActions;
