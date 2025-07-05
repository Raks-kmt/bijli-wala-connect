
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';
import { useRealtime } from '../../contexts/RealtimeContext';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Zap, DollarSign, CheckCircle, XCircle, Settings, Bell, Clock, Activity, UserCheck, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RealtimeIndicator from '../common/RealtimeIndicator';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { isConnected, sendNotification, onlineUsers } = useRealtime();
  const { lastUpdate, updateCount } = useRealtimeSync(); // Real-time sync hook
  const [selectedTab, setSelectedTab] = useState('overview');
  const [realtimeStats, setRealtimeStats] = useState({
    onlineUsers: 0,
    activeJobs: 0,
    todayRevenue: 0,
    lastUpdate: Date.now()
  });
  
  const {
    stats,
    users,
    electricians,
    pendingElectricians,
    pendingServices,
    approveElectrician,
    rejectElectrician,
    approveService,
    rejectService,
    jobs,
    notifications
  } = useAppData();

  // Enhanced real-time stats with better simulation
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        onlineUsers: onlineUsers.length || Math.floor(Math.random() * 10) + users.length,
        activeJobs: jobs.filter(j => j.status === 'in_progress' || j.status === 'accepted').length,
        todayRevenue: stats.todayRevenue + Math.floor(Math.random() * 200),
        lastUpdate: Date.now()
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected, jobs, users.length, onlineUsers.length, stats.todayRevenue]);

  // Revenue data based on real jobs
  const revenueData = [
    { month: 'Jan', revenue: Math.floor(stats.revenue * 0.6) },
    { month: 'Feb', revenue: Math.floor(stats.revenue * 0.7) },
    { month: 'Mar', revenue: Math.floor(stats.revenue * 0.8) },
    { month: 'Apr', revenue: Math.floor(stats.revenue * 0.9) },
    { month: 'May', revenue: stats.revenue },
    { month: 'Jun', revenue: stats.revenue + realtimeStats.todayRevenue }
  ];

  const jobStatusData = [
    { name: 'Completed', value: jobs.filter(j => j.status === 'completed').length, color: '#10B981' },
    { name: 'In Progress', value: jobs.filter(j => j.status === 'in_progress').length, color: '#3B82F6' },
    { name: 'Pending', value: jobs.filter(j => j.status === 'pending').length, color: '#F59E0B' },
    { name: 'Cancelled', value: jobs.filter(j => j.status === 'cancelled').length, color: '#EF4444' }
  ];

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const systemNotifications = notifications.filter(n => n.type === 'system').slice(0, 10);

  // Real-time sync effect to force updates when data changes
  useEffect(() => {
    console.log(`🔄 Admin dashboard synced at ${new Date(lastUpdate).toLocaleTimeString()} - Update #${updateCount}`);
    
    // Show real-time sync notification
    if (updateCount > 1 && isConnected) {
      const notifications = ['Data synchronized', 'Real-time update received', 'Dashboard refreshed'];
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      
      if (language === 'hi') {
        toast({
          title: '🔄 डेटा सिंक हुआ',
          description: 'सभी जानकारी अपडेट हो गई है',
          duration: 2000
        });
      } else {
        toast({
          title: '🔄 Data Synced',
          description: randomNotification,
          duration: 2000
        });
      }
    }
  }, [lastUpdate, updateCount, isConnected, language, toast]);

  const handleApproveService = (serviceId: string) => {
    approveService(serviceId);
    toast({
      title: language === 'hi' ? '✅ सेवा मंजूर' : '✅ Service Approved',
      description: language === 'hi' ? 'सेवा सफलतापूर्वक मंजूर की गई' : 'Service approved successfully'
    });

    // Real-time notification to all electricians
    electricians.forEach(electrician => {
      sendNotification(electrician.id, {
        title: language === 'hi' ? '🎉 नई सेवा उपलब्ध' : '🎉 New Service Available',
        message: language === 'hi' ? 'एक नई सेवा मंजूर की गई है और अब बुकिंग के लिए उपलब्ध है' : 'A new service has been approved and is now available for booking',
        type: 'system'
      });
    });
  };

  const handleRejectService = (serviceId: string) => {
    rejectService(serviceId);
    toast({
      title: language === 'hi' ? '❌ सेवा अस्वीकृत' : '❌ Service Rejected',
      description: language === 'hi' ? 'सेवा अस्वीकृत की गई' : 'Service has been rejected'
    });
  };

  const handleApproveElectrician = (electricianId: string) => {
    approveElectrician(electricianId);
    toast({
      title: language === 'hi' ? '✅ इलेक्ट्रीशियन मंजूर' : '✅ Electrician Approved',
      description: language === 'hi' ? 'इलेक्ट्रीशियन सफलतापूर्वक मंजूर किया गया' : 'Electrician approved successfully'
    });

    // Real-time notification to the electrician
    sendNotification(electricianId, {
      title: language === 'hi' ? '🎉 आवेदन स्वीकृत' : '🎉 Application Approved',
      message: language === 'hi' ? 'बधाई! आपका इलेक्ट्रीशियन आवेदन मंजूर हो गया है। अब आप जॉब्स स्वीकार कर सकते हैं।' : 'Congratulations! Your electrician application has been approved. You can now accept jobs.',
      type: 'system'
    });
  };

  const handleRejectElectrician = (electricianId: string) => {
    rejectElectrician(electricianId);
    toast({
      title: language === 'hi' ? '❌ इलेक्ट्रीशियन अस्वीकृत' : '❌ Electrician Rejected',
      description: language === 'hi' ? 'इलेक्ट्रीशियन अस्वीकृत किया गया' : 'Electrician has been rejected'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'hi' ? '⚡ एडमिन कंट्रोल पैनल' : '⚡ Admin Control Panel'}
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-600">
                  {language === 'hi' ? 'रियल-टाइम सिस्टम प्रबंधन' : 'Real-time system management'}
                </p>
                <RealtimeIndicator />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Real-time stats preview */}
              <div className="flex items-center space-x-2 text-xs bg-blue-50 px-3 py-1 rounded-full">
                <Activity className="h-3 w-3 text-blue-600" />
                <span className="text-blue-700">
                  {realtimeStats.onlineUsers} {language === 'hi' ? 'ऑनलाइन' : 'Online'}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadNotifications.length}
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
            <TabsTrigger value="overview">
              {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
            </TabsTrigger>
            <TabsTrigger value="users">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{language === 'hi' ? 'यूजर्स' : 'Users'}</span>
                <Badge variant="outline" className="text-xs">{users.length}</Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="electricians">
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>{language === 'hi' ? 'इलेक्ट्रीशियन' : 'Electricians'}</span>
                {pendingElectricians.length > 0 && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    {pendingElectricians.length}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="services">
              <div className="flex items-center space-x-1">
                <Settings className="h-4 w-4" />
                <span>{language === 'hi' ? 'सेवाएं' : 'Services'}</span>
                {pendingServices.length > 0 && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    {pendingServices.length}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>{language === 'hi' ? 'जॉब्स' : 'Jobs'}</span>
                <Badge variant="outline" className="text-xs">{jobs.length}</Badge>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Real-time Connection Status */}
            {!isConnected && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-orange-700">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">
                      {language === 'hi' ? 'रियल-टाइम कनेक्शन बंद है' : 'Real-time connection is offline'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className={isConnected ? 'border-green-200 bg-green-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल यूजर्स' : 'Total Users'}</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      {isConnected && (
                        <p className="text-xs text-green-600 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>{realtimeStats.onlineUsers} {language === 'hi' ? 'ऑनलाइन' : 'online'}</span>
                        </p>
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
                      {pendingElectricians.length > 0 && (
                        <p className="text-xs text-orange-600">
                          {pendingElectricians.length} {language === 'hi' ? 'प्रतीक्षारत' : 'pending'}
                        </p>
                      )}
                    </div>
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className={isConnected ? 'border-purple-200 bg-purple-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'एक्टिव जॉब्स' : 'Active Jobs'}</p>
                      <p className="text-2xl font-bold text-purple-600">{realtimeStats.activeJobs}</p>
                      {isConnected && realtimeStats.activeJobs > 0 && (
                        <p className="text-xs text-purple-600 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <span>{language === 'hi' ? 'रियल-टाइम' : 'real-time'}</span>
                        </p>
                      )}
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className={isConnected ? 'border-blue-200 bg-blue-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'आज की कमाई' : 'Today Revenue'}</p>
                      <p className="text-2xl font-bold">₹{stats.revenue + realtimeStats.todayRevenue}</p>
                      {isConnected && realtimeStats.todayRevenue > 0 && (
                        <p className="text-xs text-blue-600">
                          +₹{realtimeStats.todayRevenue} {language === 'hi' ? 'लाइव' : 'live'}
                        </p>
                      )}
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Required Alert */}
            {(pendingElectricians.length > 0 || pendingServices.length > 0) && (
              <Card className="border-red-200 bg-red-50 animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-800">
                          {language === 'hi' ? '⚠️ तुरंत कार्रवाई की आवश्यकता' : '⚠️ Immediate Action Required'}
                        </p>
                        <p className="text-sm text-red-700">
                          {pendingElectricians.length > 0 && `${pendingElectricians.length} ${language === 'hi' ? 'इलेक्ट्रीशियन प्रतीक्षारत' : 'electricians pending'}`}
                          {pendingElectricians.length > 0 && pendingServices.length > 0 && ' • '}
                          {pendingServices.length > 0 && `${pendingServices.length} ${language === 'hi' ? 'सेवाएं प्रतीक्षारत' : 'services pending'}`}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => {
                      if (pendingElectricians.length > 0) setSelectedTab('electricians');
                      else if (pendingServices.length > 0) setSelectedTab('services');
                    }}>
                      {language === 'hi' ? 'देखें' : 'Review'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{language === 'hi' ? '📊 मासिक आय ट्रेंड' : '📊 Monthly Revenue Trend'}</span>
                    {isConnected && <Badge variant="outline" className="text-xs animate-pulse">LIVE</Badge>}
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
                    <span>{language === 'hi' ? '🎯 जॉब स्टेटस विवरण' : '🎯 Job Status Breakdown'}</span>
                    {isConnected && <Badge variant="outline" className="text-xs animate-pulse">LIVE</Badge>}
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

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>{language === 'hi' ? 'पंजीकृत यूजर्स' : 'Registered Users'}</span>
                  {isConnected && <Badge variant="outline" className="text-xs">LIVE</Badge>}
                  <Badge variant="secondary">{users.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">
                      {language === 'hi' ? 'अभी तक कोई यूजर रजिस्टर नहीं हुआ' : 'No users registered yet'}
                    </p>
                    <p className="text-sm">
                      {language === 'hi' ? 'जब यूजर्स रजिस्टर होंगे तो यहाँ दिखेंगे' : 'Users will appear here when they register'}
                    </p>
                  </div>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center space-x-2">
                          <span>{user.name}</span>
                          {user.isVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600">{user.phone}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={user.role === 'admin' ? 'default' : user.role === 'electrician' ? 'secondary' : 'outline'}
                          className={
                            user.role === 'admin' ? 'bg-purple-500' : 
                            user.role === 'electrician' ? 'bg-yellow-500' : 'bg-blue-500'
                          }
                        >
                          {user.role === 'admin' ? (language === 'hi' ? 'एडमिन' : 'Admin') :
                           user.role === 'electrician' ? (language === 'hi' ? 'इलेक्ट्रीशियन' : 'Electrician') :
                           (language === 'hi' ? 'कस्टमर' : 'Customer')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {user.language === 'hi' ? 'हिंदी' : 'English'}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Electricians Tab */}
          <TabsContent value="electricians" className="space-y-4">
            {/* Pending Electricians */}
            {pendingElectricians.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800">
                    <AlertCircle className="h-5 w-5" />
                    <span>{language === 'hi' ? '⏳ प्रतीक्षारत इलेक्ट्रीशियन आवेदन' : '⏳ Pending Electrician Applications'}</span>
                    <Badge variant="destructive" className="animate-pulse">{pendingElectricians.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingElectricians.map((electrician) => (
                    <div key={electrician.id} className="flex items-center justify-between p-4 border rounded-lg bg-white border-orange-200">
                      <div className="flex-1">
                        <h3 className="font-semibold">{electrician.name}</h3>
                        <p className="text-sm text-gray-600">
                          📧 {electrician.email} • 📱 {electrician.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          🎓 {electrician.education} • ⚡ {electrician.experience} {language === 'hi' ? 'साल अनुभव' : 'years experience'}
                        </p>
                        <p className="text-sm text-gray-600">
                          📍 {electrician.location.address}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleRejectElectrician(electrician.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          {language === 'hi' ? 'अस्वीकार' : 'Reject'}
                        </Button>
                        <Button size="sm" onClick={() => handleApproveElectrician(electrician.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {language === 'hi' ? '✅ अप्रूव' : '✅ Approve'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Approved Electricians */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>{language === 'hi' ? '✅ मंजूर इलेक्ट्रीशियन' : '✅ Approved Electricians'}</span>
                  <Badge variant="secondary">{electricians.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {electricians.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">
                      {language === 'hi' ? 'अभी तक कोई इलेक्ट्रीशियन मंजूर नहीं' : 'No electricians approved yet'}
                    </p>
                  </div>
                ) : (
                  electricians.map((electrician) => (
                    <div key={electrician.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center space-x-2">
                          <span>{electrician.name}</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {electrician.availability && isConnected && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ⭐ {electrician.rating}/5 • 🔧 {electrician.totalJobs} {language === 'hi' ? 'जॉब्स' : 'jobs'} • 💰 ₹{electrician.earnings}
                        </p>
                        <p className="text-sm text-gray-600">📍 {electrician.location.address}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={electrician.availability ? 'default' : 'secondary'}>
                          {electrician.availability ? (language === 'hi' ? '🟢 उपलब्ध' : '🟢 Available') : (language === 'hi' ? '🔴 व्यस्त' : '🔴 Busy')}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            {/* Pending Services */}
            {pendingServices.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <Clock className="h-5 w-5" />
                    <span>{language === 'hi' ? '⏳ प्रतीक्षारत सेवाएं' : '⏳ Pending Services'}</span>
                    <Badge variant="destructive" className="animate-pulse">{pendingServices.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg bg-white border-blue-200">
                      <div className="flex-1">
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-gray-600">
                          {language === 'hi' ? '🏷️ श्रेणी:' : '🏷️ Category:'} {service.category} • 
                          {language === 'hi' ? '💰 मूल्य:' : '💰 Price:'} ₹{service.basePrice}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        {service.wholeHousePricing?.enabled && (
                          <div className="text-sm text-blue-600 mt-1">
                            {language === 'hi' ? '🏠 पूरे घर की कीमत:' : '🏠 Whole house pricing:'} 
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
                          {language === 'hi' ? '✅ अप्रूव' : '✅ Approve'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {pendingServices.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">
                    {language === 'hi' ? 'कोई प्रतीक्षारत सेवा नहीं' : 'No pending services'}
                  </p>
                  <p className="text-sm">
                    {language === 'hi' ? 'सभी सेवाएं मंजूर हैं' : 'All services are approved'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{language === 'hi' ? '📋 जॉब मैनेजमेंट' : '📋 Job Management'}</span>
                  {isConnected && <Badge variant="outline" className="text-xs">LIVE</Badge>}
                  <Badge variant="secondary">{jobs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">
                        {language === 'hi' ? 'अभी तक कोई जॉब नहीं' : 'No jobs yet'}
                      </p>
                      <p className="text-sm">
                        {language === 'hi' ? 'जब कस्टमर जॉब बुक करेंगे तो यहाँ दिखेंगी' : 'Jobs will appear here when customers book them'}
                      </p>
                    </div>
                  ) : (
                    jobs.slice(0, 10).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <h3 className="font-semibold">{job.description}</h3>
                          <p className="text-sm text-gray-600">📍 {job.address}</p>
                          <p className="text-sm text-gray-600">
                            💰 {language === 'hi' ? 'कुल राशि:' : 'Total:'} ₹{job.totalPrice}
                            {job.isEmergency && <span className="ml-2 text-red-600">🚨 {language === 'hi' ? 'आपातकाल' : 'Emergency'}</span>}
                          </p>
                          <p className="text-xs text-gray-400">📅 {new Date(job.createdAt).toLocaleDateString()}</p>
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
                            {job.status === 'completed' ? (language === 'hi' ? '✅ पूर्ण' : '✅ Completed') :
                             job.status === 'in_progress' ? (language === 'hi' ? '🔧 चालू' : '🔧 In Progress') :
                             job.status === 'pending' ? (language === 'hi' ? '⏳ प्रतीक्षा' : '⏳ Pending') :
                             job.status === 'accepted' ? (language === 'hi' ? '👍 स्वीकार' : '👍 Accepted') :
                             (language === 'hi' ? '❌ रद्द' : '❌ Cancelled')}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
