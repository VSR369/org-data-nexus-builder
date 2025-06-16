
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Settings, FileText, Users } from 'lucide-react';

interface QuickActionsCardProps {
  onJoinAsMember: () => void;
  showLoginWarning: boolean;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onJoinAsMember,
  showLoginWarning
}) => {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-blue-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={onJoinAsMember}
            className="h-16 flex items-center justify-center gap-3"
            disabled={showLoginWarning}
          >
            <CreditCard className="h-5 w-5" />
            Join as Member
          </Button>
          
          <Button 
            variant="outline"
            className="h-16 flex items-center justify-center gap-3"
            disabled={showLoginWarning}
          >
            <FileText className="h-5 w-5" />
            View Solutions
          </Button>
          
          <Button 
            variant="outline"
            className="h-16 flex items-center justify-center gap-3"
            disabled={showLoginWarning}
          >
            <Users className="h-5 w-5" />
            Browse Challenges
          </Button>
          
          <Button 
            variant="outline"
            className="h-16 flex items-center justify-center gap-3"
            disabled={showLoginWarning}
          >
            <Settings className="h-5 w-5" />
            Account Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
