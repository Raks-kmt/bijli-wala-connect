
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap } from 'lucide-react';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: language === 'hi' ? 'लॉगिन सफल' : 'Login Successful',
        description: language === 'hi' ? 'आपका स्वागत है' : 'Welcome back',
      });
    } catch (error) {
      toast({
        title: language === 'hi' ? 'लॉगिन त्रुटि' : 'Login Error',
        description: language === 'hi' ? 'गलत ईमेल या पासवर्ड' : 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'admin' | 'customer' | 'electrician') => {
    const demoCredentials = {
      admin: { email: 'admin@example.com', password: 'admin123' },
      customer: { email: 'customer@example.com', password: 'customer123' },
      electrician: { email: 'electrician@example.com', password: 'electrician123' }
    };

    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'hi' ? 'इलेक्ट्रिकल सेवा' : 'Electrical Service'}
            </h1>
          </div>
          <p className="text-gray-600">
            {language === 'hi' ? 'अपने अकाउंट में लॉगिन करें' : 'Login to your account'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {language === 'hi' ? 'लॉगिन' : 'Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">
                  {language === 'hi' ? 'ईमेल' : 'Email'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'hi' ? 'आपका ईमेल' : 'Your email'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'hi' ? 'आपका पासवर्ड' : 'Your password'}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {language === 'hi' ? 'लॉगिन करें' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-600 text-center">
                {language === 'hi' ? 'डेमो अकाउंट्स:' : 'Demo Accounts:'}
              </p>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDemoLogin('admin')}
                  className="text-xs"
                >
                  {language === 'hi' ? 'एडमिन डेमो' : 'Admin Demo'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDemoLogin('customer')}
                  className="text-xs"
                >
                  {language === 'hi' ? 'कस्टमर डेमो' : 'Customer Demo'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDemoLogin('electrician')}
                  className="text-xs"
                >
                  {language === 'hi' ? 'इलेक्ट्रीशियन डेमो' : 'Electrician Demo'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
