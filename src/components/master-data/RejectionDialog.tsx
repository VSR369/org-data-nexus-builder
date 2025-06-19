
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserX, UserCheck, Upload, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { UserRecord } from '@/services/types';

interface SeekerDetails extends UserRecord {
  approvalStatus: 'pending' | 'approved' | 'rejected';
  membershipStatus?: 'active' | 'inactive' | 'not-member';
}

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seeker: SeekerDetails;
  onStatusChange: (seekerId: string, status: 'approved' | 'rejected', reason: string, documents?: File[]) => void;
}

const rejectionSchema = z.object({
  reason: z.string().min(10, "Rejection reason must be at least 10 characters"),
});

const approvalSchema = z.object({
  approvalReason: z.string().min(5, "Approval reason must be at least 5 characters"),
});

type RejectionFormData = z.infer<typeof rejectionSchema>;
type ApprovalFormData = z.infer<typeof approvalSchema>;

const RejectionDialog: React.FC<RejectionDialogProps> = ({
  open,
  onOpenChange,
  seeker,
  onStatusChange
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApprovalOption, setShowApprovalOption] = useState(seeker.approvalStatus === 'rejected');
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const { toast } = useToast();

  const rejectionForm = useForm<RejectionFormData>({
    resolver: zodResolver(rejectionSchema),
    defaultValues: {
      reason: ''
    }
  });

  const approvalForm = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      approvalReason: ''
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const onReject = async (data: RejectionFormData) => {
    setIsSubmitting(true);
    try {
      onStatusChange(seeker.id, 'rejected', data.reason);
      toast({
        title: "Seeker Rejected",
        description: `${seeker.organizationName} has been rejected.`,
        variant: "destructive"
      });
      onOpenChange(false);
      resetForms();
    } catch (error) {
      console.error('Error rejecting seeker:', error);
      toast({
        title: "Error",
        description: "Failed to reject seeker. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onApprove = async (data: ApprovalFormData) => {
    setIsSubmitting(true);
    try {
      onStatusChange(seeker.id, 'approved', data.approvalReason, uploadedDocuments);
      toast({
        title: "Seeker Approved",
        description: `${seeker.organizationName} has been approved with supporting documentation.`,
      });
      onOpenChange(false);
      resetForms();
    } catch (error) {
      console.error('Error approving seeker:', error);
      toast({
        title: "Error",
        description: "Failed to approve seeker. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForms = () => {
    rejectionForm.reset();
    approvalForm.reset();
    setShowApprovalOption(seeker.approvalStatus === 'rejected');
    setUploadedDocuments([]);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
    resetForms();
  };

  // Reset forms when dialog opens
  React.useEffect(() => {
    if (open) {
      rejectionForm.reset({ reason: '' });
      approvalForm.reset({ approvalReason: '' });
      setShowApprovalOption(seeker.approvalStatus === 'rejected');
      setUploadedDocuments([]);
    }
  }, [open, seeker.approvalStatus, rejectionForm, approvalForm]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {showApprovalOption ? (
              <>
                <UserCheck className="h-5 w-5 text-green-600" />
                {seeker.approvalStatus === 'rejected' ? 'Reapprove' : 'Approve'} Seeker - {seeker.organizationName}
              </>
            ) : (
              <>
                <UserX className="h-5 w-5 text-red-600" />
                Reject Seeker - {seeker.organizationName}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {!showApprovalOption ? (
          // Rejection Form
          <Form {...rejectionForm}>
            <form onSubmit={rejectionForm.handleSubmit(onReject)} className="space-y-4">
              <FormField
                control={rejectionForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Rejection</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide a detailed reason for rejecting this seeker..."
                        className="min-h-[100px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => setShowApprovalOption(true)}
                  disabled={isSubmitting}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Actually, Approve Instead
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          // Approval Form
          <Form {...approvalForm}>
            <form onSubmit={approvalForm.handleSubmit(onApprove)} className="space-y-4">
              <FormField
                control={approvalForm.control}
                name="approvalReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {seeker.approvalStatus === 'rejected' ? 'Reason for Reapproval' : 'Reason for Approval'}
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={`Please provide a detailed reason for ${seeker.approvalStatus === 'rejected' ? 'reapproving' : 'approving'} this seeker...`}
                        className="min-h-[100px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document Upload Section */}
              <div className="space-y-3">
                <Label>Supporting Documents (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload proof documents
                    </span>
                    <span className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG files accepted
                    </span>
                  </label>
                </div>

                {/* Uploaded Documents List */}
                {uploadedDocuments.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Uploaded Documents:</Label>
                    {uploadedDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 
                    (seeker.approvalStatus === 'rejected' ? 'Reapproving...' : 'Approving...') : 
                    (seeker.approvalStatus === 'rejected' ? 'Confirm Reapproval' : 'Confirm Approval')
                  }
                </Button>
                
                {seeker.approvalStatus !== 'rejected' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowApprovalOption(false)}
                    disabled={isSubmitting}
                  >
                    Back to Rejection
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RejectionDialog;
