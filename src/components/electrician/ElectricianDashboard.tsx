
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '../../contexts/LanguageContext';
import { MapPin, Star, Clock, Zap, MessageSquare, Bell, User, Wallet, Camera, CheckCircle, XCircle } from 'lucide-react';

const ElectricianDashboard = () => {
  const { t, language } = useLanguage();
  const [isAvailable, setIsAvailable] = useState(true);

  // Mock data
  const stats = {
    totalEarnings: 15420,
    completedJobs: 45,
    rating: 4.7,
    activeJobs: 2
  };

  const jobRequests = [
    {
      id: '1',
      customer: language === 'hi' ? 'अनिल गुप्ता' : 'Anil Gupta',
      service: language === 'hi' ? 'फैन रिपेयर' : 'Fan Repair',
      address: language === 'hi' ? 'सेक्टर 15, गुरुग्राम' : 'Sector 15, Gurgaon',
      distance: 3.2,
      amount: 450,
      isEmergency: false,
      requestTime: '10 min ago'
    },
    {
      id: '2',
      customer: language === 'hi' ? 'प्रिया शर्मा' : 'Priya Sharma',
      service: language === 'hi' ? 'आपातकालीन वायरिंग' : 'Emergency Wiring',
      address: language === 'hi' ? 'डीएलएफ फेज 2' : 'DLF Phase 2',
      distance: 5.1,
      amount: 800,
      isEmergency: true,
      requestTime: '2 min ago'
    }
  ];

  const activeJobs = [
    {
      id: '1',
      customer: language === 'hi' ? 'राज मल्होत्रा' : 'Raj Malhotra',
      service: language === 'hi' ? 'स्विच रिपेयर' : 'Switch Repair',
      address: language === 'hi' ? 'सेक्टर 21' : 'Sector 21',
      status: 'in_progress',
      startTime: '2 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'आपके काम का सारांश' : 'Your work summary'}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Availability Toggle */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('availability')}</h3>
                  <p className="text-sm text-gray-600">
                    {isAvailable 
                      ? (language === 'hi' ? 'आप नए जॉब्स के लिए उपलब्ध हैं' : 'You are available for new jobs')
                      : (language === 'hi' ? 'आप अनुपलब्ध हैं' : 'You are unavailable')
                    }
                  </p>
                </div>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">₹{stats.totalEarnings}</div>
              <p className="text-sm text-gray-600">{t('earnings')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.completedJobs}</div>
              <p className="text-sm text-gray-600">{language === 'hi' ? 'पूरे किए गए जॉब्स' : 'Completed Jobs'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="text-2xl font-bold">{stats.rating}</span>
              </div>
              <p className="text-sm text-gray-600">{t('rating')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.activeJobs}</div>
              <p className="text-sm text-gray-600">{t('active_jobs')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Job Requests */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            {t('job_requests')} ({jobRequests.length})
          </h2>
          <div className="space-y-3">
            {jobRequests.map((job) => (
              <Card key={job.id} className={job.isEmergency ? 'border-red-200 bg-red-50' : ''}>
                <CardContent className="p-4">
                  {job.isEmergency && (
                    <Badge className="bg-red-500 mb-2">
                      {t('emergency')}
                    </Badge>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.customer}</h3>
                      <p className="text-sm text-gray-600 mb-1">{job.service}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.address} • {job.distance} {t('km_away')}
                      </div>
                      <p className="text-xs text-gray-400">{job.requestTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{job.amount}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <XCircle className="h-4 w-4 mr-1" />
                      {t('reject')}
                    </Button>
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t('accept')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Jobs */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            {t('active_jobs')}
          </h2>
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.customer}</h3>
                      <p className="text-sm text-gray-600 mb-1">{job.service}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.address}
                      </div>
                      <p className="text-xs text-gray-400">Started {job.startTime}</p>
                    </div>
                    <Badge className="bg-blue-500">
                      {t(job.status)}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {t('chat')}
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Camera className="h-4 w-4 mr-1" />
                      {t('complete_job')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pb-20">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">{t('my_profile')}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Camera className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">{t('portfolio')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Clock, label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard', active: true },
            { icon: Zap, label: language === 'hi' ? 'जॉब्स' : 'Jobs', active: false },
            { icon: MessageSquare, label: language === 'hi' ? 'चैट' : 'Chat', active: false },
            { icon: Wallet, label: language === 'hi' ? 'कमाई' : 'Earnings', active: false },
            { icon: User, label: language === 'hi' ? 'प्रोफाइल' : 'Profile', active: false }
          ].map((item, index) => (
            <Button key={index} variant="ghost" size="sm" className={`flex flex-col items-center py-3 ${item.active ? 'text-blue-600' : 'text-gray-500'}`}>
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElectricianDashboard;
