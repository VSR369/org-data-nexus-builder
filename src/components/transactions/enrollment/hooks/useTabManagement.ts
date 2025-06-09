
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useTabManagement = (isBasicDetailsComplete: boolean) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic-details');
  const [showValidationError, setShowValidationError] = useState(false);

  const handleTabChange = (value: string) => {
    if (value === 'competency-assessment') {
      if (!isBasicDetailsComplete) {
        setShowValidationError(true);
        toast({
          title: "Required Fields Missing",
          description: "Please complete all required fields in Basic Details & Information before proceeding to Competency Assessment.",
          variant: "destructive"
        });
        return;
      }
      setShowValidationError(false);
    }
    setActiveTab(value);
  };

  return {
    activeTab,
    showValidationError,
    handleTabChange
  };
};
