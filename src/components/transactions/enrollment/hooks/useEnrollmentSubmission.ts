
import { useToast } from "@/hooks/use-toast";

export const useEnrollmentSubmission = (
  isBasicDetailsComplete: boolean,
  competencyCompleted: boolean,
  clearDraft: () => void
) => {
  const { toast } = useToast();

  const handleSubmitEnrollment = () => {
    if (!isBasicDetailsComplete) {
      toast({
        title: "Required Fields Missing",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!competencyCompleted) {
      toast({
        title: "Competency Assessment Required",
        description: "Please complete the Competency Assessment before submitting your enrollment.",
        variant: "destructive"
      });
      return;
    }

    // Clear draft after successful submission
    clearDraft();
    
    toast({
      title: "Success",
      description: "Solution Provider enrollment submitted successfully",
    });
  };

  return {
    handleSubmitEnrollment
  };
};
