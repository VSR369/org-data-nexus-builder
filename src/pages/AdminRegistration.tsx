import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminRegistrationForm from '@/components/admin/AdminRegistrationForm';
import AdminDiagnosticTool from '@/components/admin/AdminDiagnosticTool';
import { Administrator } from '@/services/AdministratorStorageService';
import { ArrowLeft, Shield, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminRegistration = () => {
  const [activeTab, setActiveTab] = useState('register');

  const handleRegistrationSuccess = (admin: Administrator) => {
    console.log('✅ Administrator registered successfully:', admin);
    // Switch to diagnostics tab to show the newly registered admin
    setActiveTab('diagnostics');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administrator Management</h1>
              <p className="text-gray-600">Register new administrators and monitor system health</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Register Administrator
              </TabsTrigger>
              <TabsTrigger value="diagnostics" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                System Diagnostics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="register" className="mt-6">
              <AdminRegistrationForm 
                onRegistrationSuccess={handleRegistrationSuccess}
              />
            </TabsContent>
            
            <TabsContent value="diagnostics" className="mt-6">
              <AdminDiagnosticTool />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Administrator System Information</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Registration:</strong> Create new administrator accounts with proper credentials and permissions</p>
            <p>• <strong>Diagnostics:</strong> Monitor system health, view registered administrators, and check data persistence</p>
            <p>• <strong>Storage:</strong> Administrator data is stored securely in IndexedDB with localStorage backup</p>
            <p>• <strong>Authentication:</strong> Dedicated admin authentication system separate from regular users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;