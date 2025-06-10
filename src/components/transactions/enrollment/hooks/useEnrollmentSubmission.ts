
import { useToast } from "@/hooks/use-toast";
import { FormData } from '../types';

export const useEnrollmentSubmission = (
  formData: FormData,
  providerType: string,
  selectedIndustrySegments: string[],
  hasCompetencyRatings: boolean,
  isSubmitted: boolean,
  validateAndHighlightFields: (
    formData: FormData,
    providerType: string,
    selectedIndustrySegments: string[],
    hasCompetencyRatings: boolean
  ) => { isValid: boolean; missingFields: string[] },
  markAsSubmitted: () => void,
  resetSubmissionStatus: () => void,
  clearDraft: () => void
) => {
  const { toast } = useToast();

  const handleSubmitEnrollment = () => {
    // Check if already submitted
    if (isSubmitted) {
      toast({
        title: "Already Submitted",
        description: "You have already submitted this enrollment. If you want to edit, please modify the data and submit again.",
        variant: "default"
      });
      return;
    }

    const validation = validateAndHighlightFields(formData, providerType, selectedIndustrySegments, hasCompetencyRatings);
    
    if (!validation.isValid) {
      toast({
        title: "Required Fields Missing",
        description: `Please complete the following: ${validation.missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Mark as submitted first
    markAsSubmitted();
    
    toast({
      title: "Success",
      description: "Solution Provider enrollment submitted successfully. All data has been saved and will persist across sessions.",
    });
  };

  const handleResubmit = () => {
    // Reset submission status to allow editing and resubmission
    resetSubmissionStatus();
    
    toast({
      title: "Ready for Edit",
      description: "You can now modify your enrollment and submit again. All existing data is preserved.",
    });
  };

  return {
    handleSubmitEnrollment,
    handleResubmit
  };
};
