
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, RefreshCw, Info, Database } from 'lucide-react';
import { domainGroupsDataManager } from './domain-groups/domainGroupsDataManager';

const GlobalCacheManagerComponent = () => {
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const clearAllCache = () => {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Clear all master data related cache
    const masterDataKeys = keys.filter(key => 
      key.startsWith('master_data_') || 
      key.includes('Data') || 
      key.includes('Cache') ||
      key.includes('Version') ||
      key.includes('LastUpdate')
    );

    masterDataKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    showMessage(`Cleared ${masterDataKeys.length} cache entries`);
  };

  const clearDomainGroupsOnly = () => {
    // Clear only domain groups data
    const keysToRemove = [
      'master_data_domain_groups',
      'master_data_domain_groups_version',
      'master_data_domain_groups_initialized'
    ];

    let clearedCount = 0;
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });

    showMessage(`Cleared ${clearedCount} domain groups cache entries`);
  };

  const resetDomainGroupsToDefault = () => {
    // Force reset domain groups to default empty state
    domainGroupsDataManager.saveData({
      domainGroups: [],
      categories: [],
      subCategories: []
    });
    
    showMessage('Domain groups reset to default empty state');
  };

  const getCacheInfo = () => {
    const keys = Object.keys(localStorage);
    const masterDataKeys = keys.filter(key => 
      key.startsWith('master_data_') || 
      key.includes('Data') || 
      key.includes('Cache')
    );
    
    const domainGroupsData = localStorage.getItem('master_data_domain_groups');
    let domainGroupsInfo = null;
    if (domainGroupsData) {
      try {
        const parsed = JSON.parse(domainGroupsData);
        domainGroupsInfo = {
          domainGroups: parsed.domainGroups?.length || 0,
          categories: parsed.categories?.length || 0,
          subCategories: parsed.subCategories?.length || 0
        };
      } catch (e) {
        domainGroupsInfo = { error: 'Failed to parse' };
      }
    }
    
    return {
      totalKeys: keys.length,
      masterDataKeys: masterDataKeys.length,
      keys: masterDataKeys,
      domainGroupsInfo
    };
  };

  const cacheInfo = getCacheInfo();

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Global Cache Manager</h2>
        <p className="text-lg text-muted-foreground">
          Manage and clear cached data across all master data components
        </p>
      </div>

      {message && (
        <Alert>
          <AlertDescription className="text-left text-base">{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Cache Information
          </CardTitle>
          <CardDescription>
            Current cache status and stored data overview
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{cacheInfo.totalKeys}</div>
              <div className="text-sm text-muted-foreground">Total Cache Keys</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{cacheInfo.masterDataKeys}</div>
              <div className="text-sm text-muted-foreground">Master Data Keys</div>
            </div>
          </div>

          {cacheInfo.domainGroupsInfo && (
            <div className="p-4 bg-blue-50 rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Domain Groups Data
              </h4>
              {cacheInfo.domainGroupsInfo.error ? (
                <p className="text-red-600 text-sm">Error parsing domain groups data</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Domain Groups: {cacheInfo.domainGroupsInfo.domainGroups}</div>
                  <div>Categories: {cacheInfo.domainGroupsInfo.categories}</div>
                  <div>Sub-Categories: {cacheInfo.domainGroupsInfo.subCategories}</div>
                </div>
              )}
            </div>
          )}

          {cacheInfo.keys.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Cached Master Data:</h4>
              <div className="grid gap-2">
                {cacheInfo.keys.map((key) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-background border rounded">
                    <span className="text-sm font-mono">{key}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        localStorage.removeItem(key);
                        showMessage(`Cleared cache: ${key}`);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Cache Management Actions
          </CardTitle>
          <CardDescription>
            Perform cache management operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button 
              onClick={clearDomainGroupsOnly}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Clear Domain Groups Cache Only
            </Button>
            
            <Button 
              onClick={resetDomainGroupsToDefault}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Domain Groups to Empty State
            </Button>
            
            <Button 
              onClick={clearAllCache}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Master Data Cache
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>⚠️ Cache operations will:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Domain Groups Only:</strong> Clear just domain groups data</li>
              <li><strong>Reset to Empty:</strong> Force domain groups back to empty state</li>
              <li><strong>Clear All:</strong> Remove all cached master data and force reload from defaults</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalCacheManagerComponent;
