
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  User, 
  Mail, 
  Key,
  X,
  Info
} from 'lucide-react';

interface AdminCredentials {
  email: string;
  temporaryPassword: string;
  adminId: string;
  organizationName: string;
  isNewUser: boolean;
}

interface AdminCredentialsDisplayProps {
  credentials: AdminCredentials;
  onClose: () => void;
}

const AdminCredentialsDisplay: React.FC<AdminCredentialsDisplayProps> = ({
  credentials,
  onClose
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const copyAllCredentials = async () => {
    const credentialsText = credentials.isNewUser 
      ? `Administrator Login Credentials (NEW USER):
Organization: ${credentials.organizationName}
Email: ${credentials.email}
Temporary Password: ${credentials.temporaryPassword}
Admin ID: ${credentials.adminId}

Login URL: ${window.location.origin}/auth

IMPORTANT: Administrator should change password on first login.`
      : `Administrator Role Assignment (EXISTING USER):
Organization: ${credentials.organizationName}
Email: ${credentials.email}
Admin ID: ${credentials.adminId}

Login URL: ${window.location.origin}/auth

NOTE: Use existing account password to login.`;
    
    await copyToClipboard(credentialsText, 'all');
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-800">
              {credentials.isNewUser ? 'Administrator Account Created!' : 'Administrator Role Assigned!'}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={credentials.isNewUser ? "default" : "secondary"}>
            {credentials.isNewUser ? 'New User' : 'Existing User'}
          </Badge>
          <p className="text-sm text-green-700">
            Administrator can now log in to manage organization users.
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Email */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
              <p className="font-mono text-sm">{credentials.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(credentials.email, 'email')}
            className="flex items-center gap-2"
          >
            {copied === 'email' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'email' ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        {/* Password - Only show for new users */}
        {credentials.isNewUser ? (
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Temporary Password</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm">
                    {showPassword ? credentials.temporaryPassword : '••••••••••••'}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 h-6 w-6"
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(credentials.temporaryPassword, 'password')}
              className="flex items-center gap-2"
            >
              {copied === 'password' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied === 'password' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        ) : (
          <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Info className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">Existing User Account</p>
              <p className="text-xs text-blue-700">
                Administrator should use their existing account password to login.
              </p>
            </div>
          </div>
        )}

        {/* Organization & Admin ID */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organization & Admin ID</p>
              <p className="text-sm font-medium">{credentials.organizationName}</p>
              <p className="font-mono text-xs text-gray-600">{credentials.adminId}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(credentials.adminId, 'adminId')}
            className="flex items-center gap-2"
          >
            {copied === 'adminId' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'adminId' ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={copyAllCredentials}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {copied === 'all' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                All Information Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy All Information
              </>
            )}
          </Button>
        </div>

        {/* Login Instructions */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-2">📋 Next Steps:</p>
          <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
            <li>Go to the login page ({window.location.origin}/auth)</li>
            <li>Sign in with the email {credentials.isNewUser ? 'and temporary password' : 'and existing password'}</li>
            {credentials.isNewUser && <li>Change password on first login for security</li>}
            <li>Administrator can now manage organization users and settings</li>
          </ol>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            🔒 <strong>Security:</strong> {credentials.isNewUser 
              ? 'The temporary password should be changed immediately after first login.' 
              : 'Administrator role has been added to the existing user account.'} 
            These credentials provide administrative access to the organization.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCredentialsDisplay;
