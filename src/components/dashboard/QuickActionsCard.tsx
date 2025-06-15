
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActionsCard: React.FC = () => {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/challenges">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2">
              <Building className="h-5 w-5" />
              <span>Browse Challenges</span>
            </Button>
          </Link>
          
          <Link to="/solutions">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2">
              <Building className="h-5 w-5" />
              <span>View Solutions</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
