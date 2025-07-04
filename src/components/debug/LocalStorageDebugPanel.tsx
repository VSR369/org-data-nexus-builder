import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Database, Users, Key, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { analyzeLocalStorage, verifySignupDataIntegrity, type LocalStorageReport, type LocalStorageDebugInfo } from '@/utils/localStorageDebugger';

const LocalStorageDebugPanel = () => {
  const [report, setReport] = useState<LocalStorageReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshData = () => {
    setIsLoading(true);
    try {
      const newReport = analyzeLocalStorage();
      setReport(newReport);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error analyzing localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyIntegrity = () => {
    const isValid = verifySignupDataIntegrity();
    return isValid;
  };

  const KeyInfoCard = ({ info }: { info: LocalStorageDebugInfo }) => (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">{info.key}</h4>
          <div className="flex gap-2">
            <Badge variant={info.isJson ? "default" : "secondary"}>
              {info.dataType}
            </Badge>
            <Badge variant="outline">
              {info.size} KB
            </Badge>
          </div>
        </div>
        
        {info.parseError && (
          <div className="flex items-center gap-2 text-red-600 text-xs mb-2">
            <AlertTriangle className="h-3 w-3" />
            Parse Error: {info.parseError}
          </div>
        )}
        
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <strong>Preview:</strong> {
            info.rawValue ? 
              (info.rawValue.length > 150 ? info.rawValue.substring(0, 150) + '...' : info.rawValue) : 
              'null'
          }
        </div>
        
        {info.isJson && info.parsedValue && (
          <div className="mt-2 text-xs">
            {Array.isArray(info.parsedValue) && (
              <span className="text-blue-600">Array with {info.parsedValue.length} items</span>
            )}
            {typeof info.parsedValue === 'object' && !Array.isArray(info.parsedValue) && (
              <span className="text-green-600">
                Object with keys: {Object.keys(info.parsedValue).join(', ')}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const UserAnalysisSection = () => {
    if (!report) return null;
    
    const userAnalysis = report.registeredUsersAnalysis;
    const isValid = userAnalysis.exists && userAnalysis.duplicateUserIds.length === 0 && userAnalysis.missingFields.length === 0;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Users Analysis
            {isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!userAnalysis.exists ? (
            <div className="text-red-600 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              registered_users key not found in localStorage
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {userAnalysis.totalUsers} Users
                </Badge>
                {userAnalysis.duplicateUserIds.length > 0 && (
                  <Badge variant="destructive">
                    {userAnalysis.duplicateUserIds.length} Duplicates
                  </Badge>
                )}
                {userAnalysis.missingFields.length > 0 && (
                  <Badge variant="destructive">
                    {userAnalysis.missingFields.length} Missing Fields
                  </Badge>
                )}
              </div>
              
              {userAnalysis.users.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">User Details:</h4>
                  <ScrollArea className="h-64">
                    {userAnalysis.users.map((user, index) => (
                      <div key={index} className="border rounded p-3 mb-2 bg-gray-50">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><strong>User ID:</strong> {user.userId}</div>
                          <div><strong>Organization:</strong> {user.organizationName}</div>
                          <div><strong>Email:</strong> {user.email}</div>
                          <div><strong>Contact:</strong> {user.contactPersonName}</div>
                          <div><strong>Entity Type:</strong> {user.entityType}</div>
                          <div><strong>Country:</strong> {user.country}</div>
                          <div className="col-span-2">
                            <strong>Registered:</strong> {user.registrationTimestamp ? new Date(user.registrationTimestamp).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
              
              {userAnalysis.duplicateUserIds.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Duplicate User IDs:</h4>
                  <div className="flex flex-wrap gap-1">
                    {userAnalysis.duplicateUserIds.map((id, index) => (
                      <Badge key={index} variant="destructive">{id}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {userAnalysis.missingFields.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Missing Required Fields:</h4>
                  <div className="text-sm text-red-600">
                    {userAnalysis.missingFields.map((field, index) => (
                      <div key={index}>{field}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6" />
            localStorage Debug Panel
          </h1>
          {lastUpdated && (
            <p className="text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={verifyIntegrity} variant="outline">
            Verify Integrity
          </Button>
          <Button onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {!report ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">Click "Refresh Data" to analyze localStorage</p>
            <Button onClick={refreshData} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Start Analysis'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Key className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{report.totalKeys}</div>
                <div className="text-sm text-gray-600">Total Keys</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Database className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{report.totalSizeKB}</div>
                <div className="text-sm text-gray-600">KB Used</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{report.registeredUsersAnalysis.totalUsers}</div>
                <div className="text-sm text-gray-600">Registered Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                {report.registeredUsersAnalysis.exists && 
                 report.registeredUsersAnalysis.duplicateUserIds.length === 0 && 
                 report.registeredUsersAnalysis.missingFields.length === 0 ? (
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                )}
                <div className="text-sm font-medium">
                  {report.registeredUsersAnalysis.exists ? 'Valid' : 'Invalid'}
                </div>
                <div className="text-sm text-gray-600">Data Integrity</div>
              </CardContent>
            </Card>
          </div>

          {/* User Analysis */}
          <UserAnalysisSection />

          {/* Detailed Key Analysis */}
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="user">User Data ({report.userDataKeys.length})</TabsTrigger>
              <TabsTrigger value="session">Sessions ({report.sessionKeys.length})</TabsTrigger>
              <TabsTrigger value="membership">Membership ({report.membershipKeys.length})</TabsTrigger>
              <TabsTrigger value="master">Master Data ({report.masterDataKeys.length})</TabsTrigger>
              <TabsTrigger value="system">System ({report.systemKeys.length})</TabsTrigger>
              <TabsTrigger value="other">Other ({report.otherKeys.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user">
              <ScrollArea className="h-96">
                {report.userDataKeys.length > 0 ? (
                  report.userDataKeys.map((info, index) => (
                    <KeyInfoCard key={index} info={info} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No user data keys found</p>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="session">
              <ScrollArea className="h-96">
                {report.sessionKeys.length > 0 ? (
                  report.sessionKeys.map((info, index) => (
                    <KeyInfoCard key={index} info={info} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No session keys found</p>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="membership">
              <ScrollArea className="h-96">
                {report.membershipKeys.length > 0 ? (
                  report.membershipKeys.map((info, index) => (
                    <KeyInfoCard key={index} info={info} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No membership keys found</p>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="master">
              <ScrollArea className="h-96">
                {report.masterDataKeys.length > 0 ? (
                  report.masterDataKeys.map((info, index) => (
                    <KeyInfoCard key={index} info={info} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No master data keys found</p>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="system">
              <ScrollArea className="h-96">
                {report.systemKeys.length > 0 ? (
                  report.systemKeys.map((info, index) => (
                    <KeyInfoCard key={index} info={info} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No system keys found</p>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="other">
              <ScrollArea className="h-96">
                {report.otherKeys.length > 0 ? (
                  report.otherKeys.map((info, index) => (
                    <KeyInfoCard key={index} info={info} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No other keys found</p>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default LocalStorageDebugPanel;