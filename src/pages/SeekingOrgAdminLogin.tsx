
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import SeekingOrgAdminLoginHeader from '@/components/auth/SeekingOrgAdminLoginHeader';
import { supabase } from '@/integrations/supabase/client';

const SeekingOrgAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting administrator login for:', email);

      // Query the organization_administrators table directly
      const { data: adminData, error: queryError } = await supabase
        .from('organization_administrators')
        .select(`
          *,
          organizations:organization_id (
            organization_name,
            contact_person_name,
            phone_number,
            website,
            address
          )
        `)
        .eq('admin_email', email)
        .eq('is_active', true)
        .single();

      if (queryError || !adminData) {
        console.error('❌ Admin not found:', queryError);
        setError('Invalid email or password');
        return;
      }

      // Simple password validation - decode base64 and compare
      const storedPassword = atob(adminData.admin_password_hash || '');
      if (storedPassword !== password) {
        console.error('❌ Password mismatch');
        setError('Invalid email or password');
        return;
      }

      console.log('✅ Administrator login successful:', adminData.admin_name);
      
      // Store admin session in localStorage
      const adminSession = {
        id: adminData.id,
        admin_name: adminData.admin_name,
        admin_email: adminData.admin_email,
        organization_id: adminData.organization_id,
        organization_name: adminData.organizations?.organization_name,
        contact_number: adminData.contact_number,
        role_type: adminData.role_type,
        last_login: new Date().toISOString()
      };

      localStorage.setItem('seeking_org_admin_session', JSON.stringify(adminSession));
      
      toast.success(`Welcome back, ${adminData.admin_name}!`);
      navigate('/seeking-org-admin-dashboard');

    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <SeekingOrgAdminLoginHeader />
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Administrator Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Main Portal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekingOrgAdminLogin;
