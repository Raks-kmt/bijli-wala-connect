
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Zap, DollarSign, CheckCircle, XCircle, Settings, Bell, Search, Filter, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const {
    stats,
    pendingElectricians,
    pendingServices,
    approveElectrician,
    rejectElectrician,
    approveService,
    rejectService,
    jobs,
    notifications
  } = useAppData();

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 28000 }
  ];

  const jobStatusData = [
    { name: 'Completed', value: jobs.filter(j => j.status === 'completed').length, color: '#10B981' },
    { name: 'In Progress', value: jobs.filter(j => j.status === 'in_progress').length, color: '#3B82F6' },
    { name: 'Pending', value: jobs.filter(j => j.status === 'pending').length, color: '#F59E0B' },
    { name: 'Cancelled', value: jobs.filter(j => j.status === 'cancelled').length, color: '#EF4444' }
  ];

  const recentComplaints = notifications.filter(n => n.type === 'system').slice(0, 5);

  const handleApproveService = (serviceId: string) => {
    approveService(serviceId);
    toast({
      title: language === 'hi' ? 'सेवा मंजूर' : 'Service Approved',
      description: language === 'hi' ? 'सेवा सफलतापूर्वक मंजूर की गई' : 'Service approved successfully'
    });
  };

  const handleRejectService = (serviceId: string) => {
    rejectService(serviceId);
    toast({
      title: language === 'hi' ? 'सेवा अस्वीकृत' : 'Service Rejected',
      description: language === 'hi' ? 'सेवा अस्वीकृत की गई' : 'Service has been rejected'
    });
  };

  const handleApproveElectrician = (electricianId: string) => {
    approveElectrician(electricianId);
    toast({
      title: language === 'hi' ? 'इलेक्ट्रीशियन मंजूर' : 'Electrician Approved',
      description: language === 'hi' ? 'इलेक्ट्रीशियन सफलतापूर्वक मंजूर किया गया' : 'Electrician approved successfully'
    });
  };

  const handleRejectElectrician = (electricianId: string) => {
    rejectElectrician(electricianId);
    toast({
      title: language === 'hi' ? 'इलेक्ट्रीशियन अस्वीकृत' : 'Electrician Rejected',
      description: language === 'hi' ? 'इलेक्ट्रीशियन अस्वीकृत किया गया' : 'Electrician has been rejected'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'hi' ? 'एडमिन पैनल' : 'Admin Panel'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'सिस्टम प्रबंधन डैशबोर्ड' : 'System management dashboard'}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{language === 'hi' ? 'ओवरव्यू' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="users">{language === 'hi' ? 'यूजर्स' : 'Users'}</TabsTrigger>
            <TabsTrigger value="electricians">
              {language === 'hi' ? 'इलेक्ट्रीशियन' : 'Electricians'}
              {pendingElectricians.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {pendingElectricians.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="services">
              {language === 'hi' ? 'सेवाएं' : 'Services'}
              {pendingServices.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {pendingServices.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="jobs">{language === 'hi' ? 'जॉब्स' : 'Jobs'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{t('total_users')}</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'इलेक्ट्रीशियन' : 'Electricians'}</p>
                      <p className="text-2xl font-bold">{stats.totalElectricians}</p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{t('total_jobs')}</p>
                      <p className="text-2xl font-bold">{stats.totalJobs}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{t('revenue')}</p>
                      <p className="text-2xl font-bold">₹{stats.revenue}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{t('pending_approvals')}</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'एक्टिव जॉब्स' : 'Active Jobs'}</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.activeJobs}</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'hi' ? 'मासिक आय' : 'Monthly Revenue'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'hi' ? 'जॉब स्टेटस' : 'Job Status'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={jobStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {jobStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'hi' ? 'प्रतीक्षारत सेवाएं' : 'Pending Services'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-gray-600">
                        {language === 'hi' ? 'श्रेणी:' : 'Category:'} {service.category} • 
                        {language === 'hi' ? ' मूल्य:' : ' Price:'} ₹{service.basePrice}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      {service.wholeHousePricing?.enabled && (
                        <div className="text-sm text-blue-600 mt-1">
                          {language === 'hi' ? 'पूरे घर की कीमत:' : 'Whole house pricing:'} 
                          {service.wholeHousePricing.perSquareFoot && ` ₹${service.wholeHousePricing.perSquareFoot}/sq ft`}
                          {service.wholeHousePricing.flatRate && ` या ₹${service.wholeHousePricing.flatRate} (फिक्स रेट)`}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleRejectService(service.id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        {t('reject')}
                      </Button>
                      <Button size="sm" onClick={() => handleApproveService(service.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {language === 'hi' ? 'अप्रूव' : 'Approve'}
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingServices.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {language === 'hi' ? 'कोई प्रतीक्षारत सेवा नहीं मिली' : 'No pending services found'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Electricians Tab */}
          <TabsContent value="electricians" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('pending_approvals')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingElectricians.map((electrician) => (
                  <div key={electrician.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{electrician.name}</h3>
                      <p className="text-sm text-gray-600">
                        {electrician.experience} {t('years_experience')} • {electrician.location.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'hi' ? 'शिक्षा:' : 'Education:'} {electrician.education}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'hi' ? 'फोन:' : 'Phone:'} {electrician.phone}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleRejectElectrician(electrician.id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        {t('reject')}
                      </Button>
                      <Button size="sm" onClick={() => handleApproveElectrician(electrician.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {language === 'hi' ? 'अप्रूव' : 'Approve'}
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingElectricians.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {language === 'hi' ? 'कोई प्रतीक्षारत इलेक्ट्रीशियन नहीं मिला' : 'No pending electricians found'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'hi' ? 'जॉब मैनेजमेंट' : 'Job Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.slice(0, 10).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{job.description}</h3>
                        <p className="text-sm text-gray-600">{job.address}</p>
                        <p className="text-sm text-gray-600">
                          {language === 'hi' ? 'कुल राशि:' : 'Total:'} ₹{job.totalPrice}
                        </p>
                      </div>
                      <Badge 
                        variant={job.status === 'completed' ? 'default' : job.status === 'in_progress' ? 'secondary' : 'outline'}
                        className={
                          job.status === 'completed' ? 'bg-green-500' : 
                          job.status === 'in_progress' ? 'bg-blue-500' :
                          job.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                        }
                      >
                        {job.status === 'completed' ? (language === 'hi' ? 'पूर्ण' : 'Completed') :
                         job.status === 'in_progress' ? (language === 'hi' ? 'चालू' : 'In Progress') :
                         job.status === 'pending' ? (language === 'hi' ? 'प्रतीक्षा' : 'Pending') :
                         job.status === 'accepted' ? (language === 'hi' ? 'स्वीकार' : 'Accepted') :
                         (language === 'hi' ? 'रद्द' : 'Cancelled')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'hi' ? 'सिस्टम नोटिफिकेशन' : 'System Notifications'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentComplaints.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400">{new Date(notification.timestamp).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={notification.isRead ? 'outline' : 'default'}>
                      {notification.isRead ? (language === 'hi' ? 'पढ़ा गया' : 'Read') : (language === 'hi' ? 'नया' : 'New')}
                    </Badge>
                  </div>
                ))}
                {recentComplaints.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {language === 'hi' ? 'कोई नोटिफिकेशन नहीं' : 'No notifications found'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
