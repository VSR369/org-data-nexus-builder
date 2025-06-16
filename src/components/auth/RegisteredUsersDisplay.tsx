
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building, Mail, Globe, Eye, EyeOff } from 'lucide-react';
import { userDataManager } from '@/utils/storage/UserDataManager';

interface RegisteredUser {
  userId: string;
  password: string;
  organizationName: string;
  organizationType: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  industrySegment: string;
  organizationId: string;
  registrationTimestamp?: string;
}

interface RegisteredUsersDisplayProps {
  onSelectUser?: (userId: string, password: string) => void;
}

const RegisteredUsersDisplay: React.FC<RegisteredUsersDisplayProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log('📋 Loading registered users for display...');
        const allUsers = await userDataManager.getAllUsers();
        setUsers(allUsers);
        console.log('✅ Loaded users:', allUsers.length);
      } catch (error) {
        console.error('❌ Error loading users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading registered users...</div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            No Registered Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center">
            No users have registered yet. Please register first to see user details here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Registered Users ({users.length})
          </CardTitle>
          <p className="text-sm text-gray-600">
            Click on any user to auto-fill login credentials
          </p>
        </CardHeader>
      </Card>

      {users.map((user) => (
        <Card key={user.userId} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.contactPersonName}</h3>
                    <p className="text-sm text-gray-600">{user.userId}</p>
                  </div>
                </div>
                <Badge variant="outline">{user.entityType}</Badge>
              </div>

              {/* Organization Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Organization:</span>
                  <span className="font-medium">{user.organizationName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Country:</span>
                  <span className="font-medium">{user.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{user.organizationType}</span>
                </div>
              </div>

              {/* Login Credentials */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Login Credentials</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">User ID:</span>
                    <div className="font-mono bg-white p-2 rounded border mt-1">
                      {user.userId}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Password:</span>
                    <div className="font-mono bg-white p-2 rounded border mt-1 flex items-center justify-between">
                      <span>
                        {showPasswords[user.userId] ? user.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(user.userId)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords[user.userId] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Use Credentials Button */}
              {onSelectUser && (
                <Button
                  onClick={() => onSelectUser(user.userId, user.password)}
                  className="w-full"
                  variant="outline"
                >
                  Use These Credentials to Sign In
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RegisteredUsersDisplay;
