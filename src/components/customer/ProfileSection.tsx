
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Mail, MapPin, Bell, Shield, Globe, LogOut, Camera, Edit } from 'lucide-react';

const ProfileSection = () => {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: language === 'hi' ? 'अमित कुमार' : 'Amit Kumar',
    phone: '+91 98765 43210',
    email: 'amit.kumar@email.com',
    address: language === 'hi' ? 'सेक्टर 15, गुरुग्राम, हरियाणा' : 'Sector 15, Gurgaon, Haryana'
  });
  const [notifications, setNotifications] = useState({
    booking: true,
    promotion: false,
    reminder: true
  });

  const toggleLanguage = () => {
    const newLanguage = language === 'hi' ? 'en' : 'hi';
    setLanguage(newLanguage);
    toast({
      title: language === 'hi' ? 'भाषा बदली गई' : 'Language Changed',
      description: newLanguage === 'hi' ? 'हिंदी में बदल दिया गया' : 'Changed to English',
    });
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: language === 'hi' ? 'सफल!' : 'Success!',
      description: language === 'hi' ? 'प्रोफाइल अपडेट हो गई' : 'Profile updated successfully',
    });
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
    toast({
      title: language === 'hi' ? 'सेटिंग अपडेट' : 'Setting Updated',
      description: language === 'hi' ? 'नोटिफिकेशन सेटिंग बदली गई' : 'Notification setting changed',
    });
  };

  const handleLogout = () => {
    toast({
      title: language === 'hi' ? 'लॉग आउट' : 'Logged Out',
      description: language === 'hi' ? 'आप सफलतापूर्वक लॉग आउट हो गए' : 'You have been logged out successfully',
    });
    // Here you would implement actual logout logic
  };

  const handleChangePhoto = () => {
    toast({
      title: language === 'hi' ? 'फोटो बदलें' : 'Change Photo',
      description: language === 'hi' ? 'कैमरा या गैलरी से चुनें' : 'Choose from camera or gallery',
    });
    // Here you would implement photo selection logic
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-gray-500" />
              </div>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={handleChangePhoto}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.phone}</p>
              <p className="text-sm text-gray-500">{profileData.email}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'संपादित करें' : 'Edit'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{language === 'hi' ? 'नाम' : 'Name'}</Label>
            {isEditing ? (
              <Input 
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              />
            ) : (
              <p className="mt-1 text-gray-900">{profileData.name}</p>
            )}
          </div>
          
          <div>
            <Label>{language === 'hi' ? 'फोन नंबर' : 'Phone Number'}</Label>
            {isEditing ? (
              <Input 
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              />
            ) : (
              <p className="mt-1 text-gray-900">{profileData.phone}</p>
            )}
          </div>

          <div>
            <Label>{language === 'hi' ? 'ईमेल' : 'Email'}</Label>
            {isEditing ? (
              <Input 
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              />
            ) : (
              <p className="mt-1 text-gray-900">{profileData.email}</p>
            )}
          </div>

          <div>
            <Label>{language === 'hi' ? 'पता' : 'Address'}</Label>
            {isEditing ? (
              <Input 
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
              />
            ) : (
              <p className="mt-1 text-gray-900">{profileData.address}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex space-x-2">
              <Button onClick={handleSaveProfile} className="flex-1">
                {language === 'hi' ? 'सेव करें' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Bell className="h-5 w-5 inline mr-2" />
            {language === 'hi' ? 'नोटिफिकेशन सेटिंग' : 'Notification Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{language === 'hi' ? 'बुकिंग अपडेट' : 'Booking Updates'}</p>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'बुकिंग की स्थिति के बारे में जानकारी' : 'Get notified about booking status'}
              </p>
            </div>
            <Switch 
              checked={notifications.booking}
              onCheckedChange={(checked) => handleNotificationChange('booking', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{language === 'hi' ? 'प्रमोशनल ऑफर' : 'Promotional Offers'}</p>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'नए ऑफर और डिस्काउंट की जानकारी' : 'Get notified about new offers and discounts'}
              </p>
            </div>
            <Switch 
              checked={notifications.promotion}
              onCheckedChange={(checked) => handleNotificationChange('promotion', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{language === 'hi' ? 'रिमाइंडर' : 'Reminders'}</p>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'अपॉइंटमेंट रिमाइंडर' : 'Get reminded about upcoming appointments'}
              </p>
            </div>
            <Switch 
              checked={notifications.reminder}
              onCheckedChange={(checked) => handleNotificationChange('reminder', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="h-5 w-5 inline mr-2" />
            {language === 'hi' ? 'ऐप सेटिंग' : 'App Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">{language === 'hi' ? 'भाषा' : 'Language'}</p>
                <p className="text-sm text-gray-600">
                  {language === 'hi' ? 'हिंदी' : 'English'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              {language === 'hi' ? 'English' : 'हिंदी'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardContent className="p-4">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {language === 'hi' ? 'लॉग आउट' : 'Logout'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
