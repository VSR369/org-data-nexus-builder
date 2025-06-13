
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from 'lucide-react';

interface UserInfoSectionProps {
  userId?: string;
}

export const UserInfoSection = ({ userId }: UserInfoSectionProps) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">User ID:</span>
          <span className="font-medium text-gray-900">{userId || 'Not Available'}</span>
        </div>
      </div>
    </div>
  );
};
