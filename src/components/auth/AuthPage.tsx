
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';
import { User, ElectricianProfile } from '../../types';
import { LogIn, UserPlus, Zap, Users, Shield } from 'lucide-react';

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [userRole, setUserRole] = useState<'customer' | 'electrician' | 'admin'>('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    language: 'hi' as 'hi' | 'en',
    // Electrician specific fields
    experience: '',
    specialization: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addUser, addElectricianApplication } = useAppData();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone) {
        setError('सभी फील्ड भरना जरूरी है');
        setIsLoading(false);
        return;
      }

      const userId = `${userRole}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      if (userRole === 'electrician') {
        // Create electrician application
        const electricianProfile: ElectricianProfile = {
          id: userId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: 'electrician',
          isVerified: false,
          language: formData.language,
          age: 25, // Default age
          experience: parseInt(formData.experience) || 0,
          education: formData.specialization || 'Basic Electrical Training',
          services: [], // Empty initially
          portfolio: [],
          rating: 0,
          totalJobs: 0,
          earnings: 0,
          isApproved: false,
          location: {
            lat: 0,
            lng: 0,
            address: formData.location || 'Location not specified'
          },
          availability: true
        };

        addElectricianApplication(electricianProfile);
        setError('आपका आवेदन सबमिट हो गया है। एडमिन की मंजूरी का इंतजार करें।');
      } else {
        // Create regular user
        const newUser: User = {
          id: userId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: userRole,
          isVerified: true,
          language: formData.language
        };

        addUser(newUser);
        
        // Auto login after signup
        await login(formData.email, 'password123');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'customer': return <Users className="h-5 w-5" />;
      case 'electrician': return <Zap className="h-5 w-5" />;
      case 'admin': return <Shield className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'customer': return 'कस्टमर';
      case 'electrician': return 'इलेक्ट्रीशियन';
      case 'admin': return 'एडमिन';
      default: return 'कस्टमर';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            इलेक्ट्रिकल सर्विस प्लेटफॉर्म
          </CardTitle>
          <CardDescription>
            {authMode === 'signin' ? 'अपने अकाउंट में लॉगिन करें' : 'नया अकाउंट बनाएं'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'signin' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                साइन इन
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                साइन अप
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">ईमेल</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="आपका ईमेल एड्रेस"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">पासवर्ड</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="आपका पासवर्ड"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
                </Button>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-2">Test Accounts:</p>
                  <p>Admin: admin@example.com</p>
                  <p>Customer: customer@example.com</p>
                  <p>Electrician: electrician@example.com</p>
                  <p className="text-xs mt-1">Password: any</p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">अकाउंट टाइप</Label>
                  <Select value={userRole} onValueChange={(value) => setUserRole(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="अकाउंट टाइप चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">
                        <div className="flex items-center gap-2">
                          {getRoleIcon('customer')}
                          {getRoleTitle('customer')}
                        </div>
                      </SelectItem>
                      <SelectItem value="electrician">
                        <div className="flex items-center gap-2">
                          {getRoleIcon('electrician')}
                          {getRoleTitle('electrician')}
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          {getRoleIcon('admin')}
                          {getRoleTitle('admin')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">नाम</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="आपका पूरा नाम"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ईमेल</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="आपका ईमेल एड्रेस"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">फोन नंबर</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="आपका फोन नंबर"
                    required
                  />
                </div>

                {userRole === 'electrician' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="experience">अनुभव (साल में)</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="कितने साल का अनुभव है"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization">विशेषज्ञता</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        placeholder="आपकी विशेषज्ञता"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">स्थान</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="आपका काम का क्षेत्र"
                      />
                    </div>
                  </>
                )}

                {error && (
                  <div className={`text-sm p-2 rounded ${
                    error.includes('आवेदन सबमिट') 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-red-600 bg-red-50'
                  }`}>
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'अकाउंट बनाया जा रहा है...' : 'अकाउंट बनाएं'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
