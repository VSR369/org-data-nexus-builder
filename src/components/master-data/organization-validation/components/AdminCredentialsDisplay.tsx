
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
  X
} from 'lucide-react';

interface AdminCredentials {
  email: string;
  password: string;
  userId: string;
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
    const credentialsText = `Administrator Login Credentials:
Email: ${credentials.email}
Password: ${credentials.password}
User ID: ${credentials.userId}

Login URL: ${window.location.origin}/auth`;
    
    await copyToClipboard(credentialsText, 'all');
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-800">
              Administrator Account Created!
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
        <p className="text-sm text-green-700 mt-2">
          🔐 <strong>DEV MODE:</strong> Save these credentials for testing. The administrator can now log in to the system.
        </p>
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

        {/* Password */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Password</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm">
                  {showPassword ? credentials.password : '••••••••'}
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
            onClick={() => copyToClipboard(credentials.password, 'password')}
            className="flex items-center gap-2"
          >
            {copied === 'password' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'password' ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        {/* User ID */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">User ID</p>
              <p className="font-mono text-xs text-gray-600">{credentials.userId}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(credentials.userId, 'userId')}
            className="flex items-center gap-2"
          >
            {copied === 'userId' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'userId' ? 'Copied!' : 'Copy'}
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
                All Credentials Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy All Credentials
              </>
            )}
          </Button>
        </div>

        {/* Login Instructions */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-2">📋 Next Steps:</p>
          <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
            <li>Copy the email and password above</li>
            <li>Go to the login page ({window.location.origin}/auth)</li>
            <li>Sign in with these credentials</li>
            <li>The administrator can now manage organization users</li>
          </ol>
        </div>

        {/* Dev Mode Warning */}
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            ⚠️ <strong>Development Mode:</strong> In production, administrators would receive secure login instructions via email. 
            This credential display is for testing purposes only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCredentialsDisplay;
