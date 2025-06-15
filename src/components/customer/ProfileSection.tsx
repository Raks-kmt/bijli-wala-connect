
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { User, Edit, Settings, LogOut, HelpCircle, Star } from 'lucide-react';

const ProfileSection = () => {
  const { language, toggleLanguage } = useLanguage();
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const saveProfile = () => {
    updateUser(editData);
    setIsEditing(false);
  };

  const menuItems = [
    {
      icon: Star,
      label: language === 'hi' ? 'मेरी रेटिंग' : 'My Ratings',
      action: () => console.log('My ratings')
    },
    {
      icon: HelpCircle,
      label: language === 'hi' ? 'सहायता और सपोर्ट' : 'Help & Support',
      action: () => console.log('Help & Support')
    },
    {
      icon: Settings,
      label: language === 'hi' ? 'सेटिंग्स' : 'Settings',
      action: () => console.log('Settings')
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-gray-500" />
          </div>
          <CardTitle>{user?.name}</CardTitle>
          <p className="text-gray-600">{user?.email}</p>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="w-full"
          >
            <Edit className="h-4 w-4 mr-2" />
            {language === 'hi' ? 'प्रोफाइल संपादित करें' : 'Edit Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'hi' ? 'प्रोफाइल संपादित करें' : 'Edit Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{language === 'hi' ? 'नाम' : 'Name'}</Label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
              />
            </div>
            <div>
              <Label>{language === 'hi' ? 'ईमेल' : 'Email'}</Label>
              <Input
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
                type="email"
              />
            </div>
            <div>
              <Label>{language === 'hi' ? 'फोन' : 'Phone'}</Label>
              <Input
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                type="tel"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveProfile} className="flex-1">
                {language === 'hi' ? 'सहेजें' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md" onClick={item.action}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 text-gray-600" />
                <span className="font-medium">{item.label}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Language Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {language === 'hi' ? 'भाषा' : 'Language'}
            </span>
            <Button variant="outline" onClick={toggleLanguage}>
              {language === 'hi' ? 'English' : 'हिंदी'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button variant="destructive" onClick={logout} className="w-full">
        <LogOut className="h-4 w-4 mr-2" />
        {language === 'hi' ? 'लॉग आउट' : 'Logout'}
      </Button>
    </div>
  );
};

export default ProfileSection;
