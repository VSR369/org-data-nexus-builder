import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Database, User, Users } from 'lucide-react';

const UserDataDebugger: React.FC = () => {
  const [debugData, setDebugData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('media');

  const checkUserStorage = () => {
    console.log('🔍 Debugging user storage...');
    
    const allData: any = {
      localStorage_keys: Object.keys(localStorage),
      userData: {},
      searchResults: []
    };

    // Check all localStorage keys for user data
    const userKeys = [
      'registered_users',
      'users',
      'seeker_users',
      'user_data',
      'all_users'
    ];

    userKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          allData.userData[key] = parsed;
          console.log(`✅ Found data in ${key}:`, parsed);
        } catch (e) {
          allData.userData[key] = 'Failed to parse JSON';
          console.log(`❌ Failed to parse ${key}:`, e);
        }
      } else {
        console.log(`❌ No data found for key: ${key}`);
      }
    });

    // Search for media-related entries
    Object.keys(localStorage).forEach(key => {
      const value = localStorage.getItem(key);
      if (value && (key.includes(searchTerm) || value.includes(searchTerm))) {
        try {
          allData.searchResults.push({
            key,
            value: value.length > 500 ? JSON.parse(value) : value
          });
        } catch (e) {
          allData.searchResults.push({
            key,
            value: value.substring(0, 200) + '...'
          });
        }
      }
    });

    console.log('📊 Complete debug data:', allData);
    setDebugData(allData);
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          User Data Storage Debugger
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={checkUserStorage} size="sm">
            <Search className="h-4 w-4 mr-2" />
            Debug Storage
          </Button>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search term (e.g., media)"
            className="px-3 py-1 border rounded text-sm"
          />
        </div>
      </CardHeader>
      
      {debugData && (
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Data Storage
            </h3>
            {Object.keys(debugData.userData).map(key => (
              <div key={key} className="mb-3 p-3 border rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{key}</Badge>
                  <span className="text-sm text-gray-500">
                    {Array.isArray(debugData.userData[key]) ? 
                      `${debugData.userData[key].length} items` : 
                      typeof debugData.userData[key]
                    }
                  </span>
                </div>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(debugData.userData[key], null, 2)}
                </pre>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Results for "{searchTerm}"
            </h3>
            {debugData.searchResults.length === 0 ? (
              <p className="text-gray-500 italic">No matches found</p>
            ) : (
              debugData.searchResults.map((result: any, index: number) => (
                <div key={index} className="mb-3 p-3 border rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{result.key}</Badge>
                  </div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                    {typeof result.value === 'string' ? result.value : JSON.stringify(result.value, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">All localStorage Keys</h3>
            <div className="flex flex-wrap gap-1">
              {debugData.localStorage_keys.map((key: string) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default UserDataDebugger;