
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NoDataMessageProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  type?: 'warning' | 'info';
}

const NoDataMessage: React.FC<NoDataMessageProps> = ({
  title,
  description,
  actionText = "Set up master data",
  actionLink = "/master-data",
  onAction,
  type = 'warning'
}) => {
  const Icon = type === 'warning' ? AlertCircle : Database;
  const iconColor = type === 'warning' ? 'text-yellow-600' : 'text-blue-600';
  const borderColor = type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500';
  const bgColor = type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50';

  return (
    <Card className={`shadow-xl border-0 border-l-4 ${borderColor} ${bgColor}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Icon className={`h-6 w-6 ${iconColor} mt-1 flex-shrink-0`} />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-700 mb-4">{description}</p>
            
            {(actionLink || onAction) && (
              <div className="flex gap-3">
                {actionLink ? (
                  <Link to={actionLink}>
                    <Button variant="default" size="sm">
                      {actionText}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="default" size="sm" onClick={onAction}>
                    {actionText}
                  </Button>
                )}
                
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    Development Mode: Mock data available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoDataMessage;
