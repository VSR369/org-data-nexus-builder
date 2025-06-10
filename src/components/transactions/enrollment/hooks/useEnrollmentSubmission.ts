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
  onSuccessfulSubmission: () => void
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
      const formattedMissingFields = validation.missingFields.join(', ');
      
      toast({
        title: "Required Fields Missing",
        description: `Please complete all required fields highlighted in red: ${formattedMissingFields}`,
        variant: "destructive"
      });
      return;
    }

    // Mark as submitted - data should persist for future edits
    markAsSubmitted();
    
    toast({
      title: "Success",
      description: "Solution Provider enrollment submitted successfully. All data has been saved and will persist across sessions. You can edit and resubmit anytime.",
    });
  };

  const handleResubmit = () => {
    const validation = validateAndHighlightFields(formData, providerType, selectedIndustrySegments, hasCompetencyRatings);
    
    if (!validation.isValid) {
      const formattedMissingFields = validation.missingFields.join(', ');
      
      toast({
        title: "Required Fields Missing",
        description: `Please complete all required fields highlighted in red: ${formattedMissingFields}`,
        variant: "destructive"
      });
      return;
    }

    // Keep submission status as true since this is a resubmission
    markAsSubmitted();
    
    toast({
      title: "Success",
      description: "Solution Provider enrollment updated and resubmitted successfully. All data remains preserved.",
    });
  };

  return {
    handleSubmitEnrollment,
    handleResubmit
  };
};
