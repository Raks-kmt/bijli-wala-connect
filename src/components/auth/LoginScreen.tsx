
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, Users, Wrench, Shield, Eye, EyeOff } from 'lucide-react';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        title: language === 'hi' ? '✅ लॉगिन सफल' : '✅ Login Successful',
        description: language === 'hi' ? 'रियल-टाइम कनेक्शन स्थापित हो रहा है...' : 'Establishing real-time connection...',
      });
    } catch (error) {
      toast({
        title: language === 'hi' ? '❌ लॉगिन त्रुटि' : '❌ Login Error',
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
    
    // Auto-login after setting credentials
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-10 w-10 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'hi' ? 'इलेक्ट्रिकल सेवा' : 'Electrical Service'}
            </h1>
          </div>
          <p className="text-gray-600">
            {language === 'hi' ? 'रियल-टाइम सर्विस प्लेटफॉर्म' : 'Real-time Service Platform'}
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{language === 'hi' ? 'लाइव कनेक्शन एक्टिव' : 'Live Connection Active'}</span>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {language === 'hi' ? 'लॉगिन करें' : 'Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'hi' ? 'आपका ईमेल दर्ज करें' : 'Enter your email'}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'hi' ? 'आपका पासवर्ड दर्ज करें' : 'Enter your password'}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {language === 'hi' ? 'लॉगिन करें' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    {language === 'hi' ? 'या डेमो से लॉगिन करें' : 'Or login with demo'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDemoLogin('admin')}
                  className="flex items-center justify-center space-x-2 h-12 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                >
                  <Shield className="h-4 w-4" />
                  <div className="text-center">
                    <div className="font-medium">{language === 'hi' ? 'एडमिन लॉगिन' : 'Admin Login'}</div>
                    <div className="text-xs opacity-70">admin@example.com</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDemoLogin('customer')}
                  className="flex items-center justify-center space-x-2 h-12 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                >
                  <Users className="h-4 w-4" />
                  <div className="text-center">
                    <div className="font-medium">{language === 'hi' ? 'कस्टमर लॉगिन' : 'Customer Login'}</div>
                    <div className="text-xs opacity-70">customer@example.com</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDemoLogin('electrician')}
                  className="flex items-center justify-center space-x-2 h-12 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                >
                  <Wrench className="h-4 w-4" />
                  <div className="text-center">
                    <div className="font-medium">{language === 'hi' ? 'इलेक्ट्रीशियन लॉगिन' : 'Electrician Login'}</div>
                    <div className="text-xs opacity-70">electrician@example.com</div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              {language === 'hi' ? 
                'सभी डेमो अकाउंट्स रियल-टाइम फीचर्स के साथ' : 
                'All demo accounts with real-time features'
              }
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          {language === 'hi' ? 
            'सुरक्षित और तेज़ कनेक्शन' : 
            'Secure and fast connection'
          }
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
