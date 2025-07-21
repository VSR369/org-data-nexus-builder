import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, User, Mail, Lock, Building, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { administratorStorageService, Administrator } from '@/services/AdministratorStorageService';

interface AdminRegistrationFormProps {
  onRegistrationSuccess?: (admin: Administrator) => void;
  onCancel?: () => void;
}

const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({ 
  onRegistrationSuccess, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    adminId: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    adminEmail: '',
    adminName: '',
    role: 'organization_admin' as 'organization_admin' | 'system_admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.adminId.trim()) errors.push('Admin ID is required');
    if (!formData.password) errors.push('Password is required');
    if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');
    if (!formData.organizationName.trim()) errors.push('Organization name is required');
    if (!formData.adminEmail.trim()) errors.push('Admin email is required');
    if (!formData.adminName.trim()) errors.push('Admin name is required');
    if (!formData.role) errors.push('Role is required');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.adminEmail && !emailRegex.test(formData.adminEmail)) {
      errors.push('Please enter a valid email address');
    }

    // Password strength validation
    if (formData.password && formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 === ADMIN REGISTRATION FORM SUBMISSION ===');
    console.log('📝 Form data:', {
      adminId: formData.adminId,
      organizationName: formData.organizationName,
      adminEmail: formData.adminEmail,
      adminName: formData.adminName,
      role: formData.role
    });

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    setIsLoading(true);

    try {
      const permissions = ['manage_membership', 'view_dashboard', 'organization_config'];

      const adminData = {
        adminId: formData.adminId.trim(),
        password: formData.password,
        organizationName: formData.organizationName.trim(),
        adminEmail: formData.adminEmail.trim().toLowerCase(),
        adminName: formData.adminName.trim(),
        permissions,
        role: formData.role,
        isActive: true
      };

      console.log('💾 Submitting admin registration...');
      const result = await administratorStorageService.registerAdministrator(adminData);

      if (result.success && result.admin) {
        console.log('✅ Admin registration successful:', result.admin.adminId);
        toast.success(`Administrator "${formData.adminName}" registered successfully!`);
        
        if (onRegistrationSuccess) {
          onRegistrationSuccess(result.admin);
        }

        // Reset form
        setFormData({
          adminId: '',
          password: '',
          confirmPassword: '',
          organizationName: '',
          adminEmail: '',
          adminName: '',
          role: 'organization_admin'
        });
      } else {
        console.log('❌ Admin registration failed:', result.error);
        toast.error(result.error || 'Registration failed');
      }

    } catch (error) {
      console.error('❌ Admin registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          Register New Administrator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adminId" className="text-sm font-medium">
                Admin ID *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="adminId"
                  type="text"
                  value={formData.adminId}
                  onChange={(e) => handleInputChange('adminId', e.target.value)}
                  className="pl-10"
                  placeholder="Enter unique admin ID"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminName" className="text-sm font-medium">
                Admin Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="adminName"
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => handleInputChange('adminName', e.target.value)}
                  className="pl-10"
                  placeholder="Enter admin full name"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail" className="text-sm font-medium">
              Admin Email *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="adminEmail"
                type="email"
                value={formData.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                className="pl-10"
                placeholder="Enter admin email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-sm font-medium">
              Organization Name *
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="organizationName"
                type="text"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                className="pl-10"
                placeholder="Enter organization name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Administrator Role *
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select administrator role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organization_admin">Organization Admin</SelectItem>
                <SelectItem value="system_admin">System Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register Administrator'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </div>
  );
};

export default AdminRegistrationForm;