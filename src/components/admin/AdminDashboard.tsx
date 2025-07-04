import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';
import { useRealtime } from '../../contexts/RealtimeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Zap, DollarSign, CheckCircle, XCircle, Settings, Bell, Clock, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { isConnected, sendNotification } = useRealtime();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [realtimeStats, setRealtimeStats] = useState({
    onlineUsers: 0,
    activeJobs: 0,
    todayRevenue: 0
  });
  
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

  // Simulate real-time stats updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        onlineUsers: Math.floor(Math.random() * 50) + 20,
        activeJobs: jobs.filter(j => j.status === 'in_progress').length,
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 500)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected, jobs]);

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

    // Send real-time notification
    sendNotification('all_electricians', {
      title: language === 'hi' ? 'नई सेवा उपलब्ध' : 'New Service Available',
      message: language === 'hi' ? 'एक नई सेवा मंजूर की गई है' : 'A new service has been approved',
      type: 'system'
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

    // Send real-time notification to the electrician
    sendNotification(electricianId, {
      title: language === 'hi' ? 'आवेदन स्वीकृत' : 'Application Approved',
      message: language === 'hi' ? 'बधाई! आपका इलेक्ट्रीशियन आवेदन मंजूर हो गया' : 'Congratulations! Your electrician application has been approved',
      type: 'system'
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
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-600">
                  {language === 'hi' ? 'सिस्टम प्रबंधन डैशबोर्ड' : 'System management dashboard'}
                </p>
                {/* Real-time Status */}
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-500">
                    {isConnected 
                      ? (language === 'hi' ? 'रियल-टाइम चालू' : 'Real-time Active')
                      : (language === 'hi' ? 'ऑफलाइन' : 'Offline')
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="relative">
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
                <Badge variant="destructive" className="ml-1 text-xs animate-pulse">
                  {pendingElectricians.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="services">
              {language === 'hi' ? 'सेवाएं' : 'Services'}
              {pendingServices.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs animate-pulse">
                  {pendingServices.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="jobs">{language === 'hi' ? 'जॉब्स' : 'Jobs'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Real-time Stats Banner */}
            {isConnected && (
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{language === 'hi' ? 'रियल-टाइम अपडेट' : 'Real-time Updates'}</h3>
                      <p className="text-sm opacity-90">{language === 'hi' ? 'लाइव डेटा देखें' : 'View live data'}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-right">
                      <div>
                        <div className="text-2xl font-bold">{realtimeStats.onlineUsers}</div>
                        <div className="text-xs opacity-90">{language === 'hi' ? 'ऑनलाइन यूजर्स' : 'Online Users'}</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{realtimeStats.activeJobs}</div>
                        <div className="text-xs opacity-90">{language === 'hi' ? 'एक्टिव जॉब्स' : 'Active Jobs'}</div>
                      </div>
                      <Activity className="h-8 w-8 animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className={isConnected ? 'border-green-200 bg-green-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल यूजर्स' : 'Total Users'}</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      {isConnected && (
                        <p className="text-xs text-green-600">{language === 'hi' ? 'लाइव काउंट' : 'Live Count'}</p>
                      )}
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className={isConnected ? 'border-yellow-200 bg-yellow-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'इलेक्ट्रीशियन' : 'Electricians'}</p>
                      <p className="text-2xl font-bold">{stats.totalElectricians}</p>
                      {isConnected && (
                        <p className="text-xs text-yellow-600">{language === 'hi' ? 'रियल-टाइम' : 'Real-time'}</p>
                      )}
                    </div>
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className={isConnected ? 'border-green-200 bg-green-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल जॉब्स' : 'Total Jobs'}</p>
                      <p className="text-2xl font-bold">{stats.totalJobs}</p>
                      {isConnected && (
                        <p className="text-xs text-green-600">{language === 'hi' ? 'अपडेटेड' : 'Updated'}</p>
                      )}
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className={isConnected ? 'border-blue-200 bg-blue-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'रेवेन्यू' : 'Revenue'}</p>
                      <p className="text-2xl font-bold">₹{stats.revenue + realtimeStats.todayRevenue}</p>
                      {isConnected && realtimeStats.todayRevenue > 0 && (
                        <p className="text-xs text-blue-600">+₹{realtimeStats.todayRevenue} {language === 'hi' ? 'आज' : 'today'}</p>
                      )}
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className={pendingElectricians.length > 0 || pendingServices.length > 0 ? 'border-orange-200 bg-orange-50 animate-pulse' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'प्रतीक्षारत अप्रूवल' : 'Pending Approvals'}</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</p>
                      {isConnected && stats.pendingApprovals > 0 && (
                        <p className="text-xs text-orange-600">{language === 'hi' ? 'तुरंत देखें' : 'Needs attention'}</p>
                      )}
                    </div>
                    <XCircle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className={isConnected ? 'border-purple-200 bg-purple-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'एक्टिव जॉब्स' : 'Active Jobs'}</p>
                      <p className="text-2xl font-bold text-purple-600">{realtimeStats.activeJobs}</p>
                      {isConnected && (
                        <p className="text-xs text-purple-600">{language === 'hi' ? 'लाइव ट्रैकिंग' : 'Live Tracking'}</p>
                      )}
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
                  <CardTitle className="flex items-center space-x-2">
                    <span>{language === 'hi' ? 'मासिक आय' : 'Monthly Revenue'}</span>
                    {isConnected && <Badge variant="outline" className="text-xs">LIVE</Badge>}
                  </CardTitle>
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
                  <CardTitle className="flex items-center space-x-2">
                    <span>{language === 'hi' ? 'जॉब स्टेटस' : 'Job Status'}</span>
                    {isConnected && <Badge variant="outline" className="text-xs">LIVE</Badge>}
                  </CardTitle>
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
                <CardTitle className="flex items-center space-x-2">
                  <span>{language === 'hi' ? 'प्रतीक्षारत सेवाएं' : 'Pending Services'}</span>
                  {isConnected && <Badge variant="outline" className="text-xs animate-pulse">LIVE</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
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
                        {language === 'hi' ? 'अस्वीकार' : 'Reject'}
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
                <CardTitle className="flex items-center space-x-2">
                  <span>{language === 'hi' ? 'प्रतीक्षारत इलेक्ट्रीशियन' : 'Pending Electricians'}</span>
                  {isConnected && <Badge variant="outline" className="text-xs animate-pulse">LIVE</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingElectricians.map((electrician) => (
                  <div key={electrician.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <div className="flex-1">
                      <h3 className="font-semibold">{electrician.name}</h3>
                      <p className="text-sm text-gray-600">
                        {electrician.experience} {language === 'hi' ? 'साल अनुभव' : 'years experience'} • {electrician.location.address}
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
                        {language === 'hi' ? 'अस्वीकार' : 'Reject'}
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
                <CardTitle className="flex items-center space-x-2">
                  <span>{language === 'hi' ? 'जॉब मैनेजमेंट' : 'Job Management'}</span>
                  {isConnected && <Badge variant="outline" className="text-xs">LIVE</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.slice(0, 10).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-semibold">{job.description}</h3>
                        <p className="text-sm text-gray-600">{job.address}</p>
                        <p className="text-sm text-gray-600">
                          {language === 'hi' ? 'कुल राशि:' : 'Total:'} ₹{job.totalPrice}
                        </p>
                        <p className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isConnected && (job.status === 'in_progress' || job.status === 'accepted') && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                        <Badge 
                          variant={job.status === 'completed' ? 'default' : job.status === 'in_progress' ? 'secondary' : 'outline'}
                          className={
                            job.status === 'completed' ? 'bg-green-500' : 
                            job.status === 'in_progress' ? 'bg-blue-500' :
                            job.status === 'pending' ? 'bg-orange-500' : 
                            job.status === 'accepted' ? 'bg-purple-500' : 'bg-red-500'
                          }
                        >
                          {job.status === 'completed' ? (language === 'hi' ? 'पूर्ण' : 'Completed') :
                           job.status === 'in_progress' ? (language === 'hi' ? 'चालू' : 'In Progress') :
                           job.status === 'pending' ? (language === 'hi' ? 'प्रतीक्षा' : 'Pending') :
                           job.status === 'accepted' ? (language === 'hi' ? 'स्वीकार' : 'Accepted') :
                           (language === 'hi' ? 'रद्द' : 'Cancelled')}
                        </Badge>
                      </div>
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
                <CardTitle className="flex items-center space-x-2">
                  <span>{language === 'hi' ? 'सिस्टम नोटिफिकेशन' : 'System Notifications'}</span>
                  {isConnected && <Badge variant="outline" className="text-xs">LIVE</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentComplaints.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400">{new Date(notification.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && isConnected && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                      <Badge variant={notification.isRead ? 'outline' : 'default'}>
                        {notification.isRead ? (language === 'hi' ? 'पढ़ा गया' : 'Read') : (language === 'hi' ? 'नया' : 'New')}
                      </Badge>
                    </div>
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
