
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Database, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { GlobalCacheManager } from '@/utils/dataManager';

const GlobalCacheManagerComponent = () => {
  const { toast } = useToast();

  const handleClearAllCache = () => {
    if (window.confirm('Are you sure you want to clear all master data cache? This will reset all components to their default values.')) {
      GlobalCacheManager.clearAllCache();
      toast({
        title: "Success",
        description: "All master data cache cleared. Please refresh the page to see changes.",
        variant: "default",
      });
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const storedKeys = GlobalCacheManager.getStoredKeys();

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Database className="w-5 h-5" />
          Global Cache Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This will clear all stored master data and reset all components to their default values. Use with caution.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Currently managing {storedKeys.length} data stores:
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside">
            {storedKeys.map(key => (
              <li key={key}>{key.replace('master_data_', '').replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </div>

        <Button 
          onClick={handleClearAllCache}
          variant="destructive"
          className="w-full flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Master Data Cache
        </Button>
      </CardContent>
    </Card>
  );
};

export default GlobalCacheManagerComponent;
