
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import { Zap, Globe } from 'lucide-react';

const LoginScreen = () => {
  const { language, setLanguage, t } = useLanguage();
  const { login } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp' | 'role'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'electrician' | 'admin'>('customer');

  const handlePhoneSubmit = () => {
    if (phone.length === 10) {
      // Simulate OTP sending
      setStep('otp');
    }
  };

  const handleOtpSubmit = () => {
    if (otp === '1234') { // Demo OTP
      setStep('role');
    }
  };

  const handleRoleSubmit = () => {
    const userData: User = {
      id: Math.random().toString(),
      name: selectedRole === 'admin' ? 'Admin User' : `${selectedRole} User`,
      email: `${selectedRole}@demo.com`,
      phone: phone,
      role: selectedRole,
      isVerified: true,
      language: language
    };
    login(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Selector */}
        <div className="flex justify-center">
          <Card className="w-fit">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <Select value={language} onValueChange={(value: 'en' | 'hi') => setLanguage(value)}>
                  <SelectTrigger className="w-24 border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="hi">हिं</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Logo and Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'hi' ? 'इलेक्ट्रिक सर्विस' : 'Electric Service'}
          </h1>
          <p className="text-gray-600">
            {language === 'hi' ? 'आपकी इलेक्ट्रिकल समस्याओं का समाधान' : 'Your electrical solutions partner'}
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {step === 'phone' && t('phone_number')}
              {step === 'otp' && t('enter_otp')}
              {step === 'role' && t('select_role')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'phone' && (
              <>
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder={language === 'hi' ? 'मोबाइल नंबर दर्ज करें' : 'Enter mobile number'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                  />
                </div>
                <Button 
                  onClick={handlePhoneSubmit} 
                  className="w-full"
                  disabled={phone.length !== 10}
                >
                  {language === 'hi' ? 'OTP भेजें' : 'Send OTP'}
                </Button>
              </>
            )}

            {step === 'otp' && (
              <>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    {language === 'hi' ? `${phone} पर OTP भेजा गया` : `OTP sent to ${phone}`}
                  </p>
                  <Input
                    type="text"
                    placeholder={language === 'hi' ? 'OTP दर्ज करें' : 'Enter OTP'}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                    className="text-center text-xl tracking-widest"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    {language === 'hi' ? 'डेमो के लिए: 1234' : 'Demo OTP: 1234'}
                  </p>
                </div>
                <Button 
                  onClick={handleOtpSubmit} 
                  className="w-full"
                  disabled={otp.length !== 4}
                >
                  {t('verify_otp')}
                </Button>
              </>
            )}

            {step === 'role' && (
              <>
                <RadioGroup 
                  value={selectedRole} 
                  onValueChange={(value: 'customer' | 'electrician' | 'admin') => setSelectedRole(value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="customer" id="customer" />
                    <Label htmlFor="customer" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{t('customer')}</p>
                        <p className="text-sm text-gray-500">
                          {language === 'hi' ? 'सेवा बुक करें' : 'Book services'}
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="electrician" id="electrician" />
                    <Label htmlFor="electrician" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{t('electrician')}</p>
                        <p className="text-sm text-gray-500">
                          {language === 'hi' ? 'सेवा प्रदान करें' : 'Provide services'}
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{t('admin')}</p>
                        <p className="text-sm text-gray-500">
                          {language === 'hi' ? 'प्रशासनिक पैनल' : 'Administrative panel'}
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                <Button onClick={handleRoleSubmit} className="w-full">
                  {t('login')}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
