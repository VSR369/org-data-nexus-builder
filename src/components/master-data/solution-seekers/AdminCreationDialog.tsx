
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Copy, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { SeekerDetails } from './types';
import { toast } from 'sonner';

interface AdminCredentials {
  email: string;
  password: string;
  userId: string;
}

interface AdminCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seeker: SeekerDetails;
  onCreateAdmin: (seekerId: string, adminName: string, adminEmail: string) => Promise<AdminCredentials | null>;
  processing: boolean;
}

const AdminCreationDialog: React.FC<AdminCreationDialogProps> = ({
  open,
  onOpenChange,
  seeker,
  onCreateAdmin,
  processing
}) => {
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');

  const handleCreateAdmin = async () => {
    if (!adminName.trim() || !adminEmail.trim()) {
      toast.error('Please provide both admin name and email');
      return;
    }

    const result = await onCreateAdmin(seeker.id, adminName.trim(), adminEmail.trim());
    
    if (result) {
      setCredentials(result);
      setStep('success');
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  const handleClose = () => {
    setAdminName('');
    setAdminEmail('');
    setCredentials(null);
    setStep('form');
    setShowPassword(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create Organization Administrator - {seeker.organizationName}
          </DialogTitle>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-6">
            {/* Organization Info */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{seeker.organizationId}</Badge>
                <Badge className="bg-green-100 text-green-800">Approved</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Organization:</span> {seeker.organizationName}
                </div>
                <div>
                  <span className="font-medium">Contact:</span> {seeker.contactPersonName}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {seeker.organizationType}
                </div>
                <div>
                  <span className="font-medium">Country:</span> {seeker.country}
                </div>
              </div>
            </div>

            {/* Prerequisites Check */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Prerequisites Complete</span>
              </div>
              <div className="space-y-1 text-sm text-green-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3" />
                  <span>Payment validation completed</span>
                </div>
                {['Non-Profit Organization', 'Society', 'Trust'].includes(seeker.entityType) && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    <span>Document validation completed</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3" />
                  <span>Ready for administrator creation</span>
                </div>
              </div>
            </div>

            {/* Admin Details Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Administrator Name *</Label>
                <Input
                  id="admin-name"
                  placeholder="Enter the full name of the administrator"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator Email *</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter the email address for the administrator"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This email will be used for login credentials. Make sure it's accessible to the administrator.
                </p>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Important</span>
              </div>
              <p className="text-sm text-blue-700">
                A secure temporary password will be generated automatically. The administrator will receive login credentials 
                and should change the password on first login.
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAdmin}
                disabled={processing || !adminName.trim() || !adminEmail.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Administrator Account
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && credentials && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-medium text-green-800 mb-2">Administrator Account Created Successfully!</h3>
              <p className="text-sm text-green-700">
                The administrator account has been created and credentials are ready below.
              </p>
            </div>

            {/* Credentials Display */}
            <Card className="border-2 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-800">Administrator Credentials</span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>User ID / Email</Label>
                    <div className="flex items-center gap-2">
                      <Input value={credentials.email} readOnly className="bg-gray-50" />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(credentials.email, 'Email')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Temporary Password</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type={showPassword ? 'text' : 'password'}
                        value={credentials.password} 
                        readOnly 
                        className="bg-gray-50 font-mono"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(credentials.password, 'Password')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Administrator Name</Label>
                    <div className="flex items-center gap-2">
                      <Input value={adminName} readOnly className="bg-gray-50" />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(adminName, 'Name')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Share these credentials securely with the organization administrator</li>
                <li>Administrator should log in at the Organization Admin portal</li>
                <li>Administrator must change the password on first login</li>
                <li>Keep a secure record of these credentials for your records</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  const credentialsText = `Organization: ${seeker.organizationName}\nAdmin Name: ${adminName}\nEmail: ${credentials.email}\nPassword: ${credentials.password}`;
                  copyToClipboard(credentialsText, 'All credentials');
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All Credentials
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreationDialog;
