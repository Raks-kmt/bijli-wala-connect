import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Zap, DollarSign, CheckCircle, XCircle, Settings, Bell, Search, Filter, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data
  const stats = {
    totalUsers: 1247,
    totalElectricians: 89,
    totalJobs: 856,
    revenue: 125470,
    pendingApprovals: 12,
    activeJobs: 34,
    pendingServices: 8
  };

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 28000 }
  ];

  const jobStatusData = [
    { name: 'Completed', value: 720, color: '#10B981' },
    { name: 'In Progress', value: 34, color: '#3B82F6' },
    { name: 'Pending', value: 67, color: '#F59E0B' },
    { name: 'Cancelled', value: 35, color: '#EF4444' }
  ];

  const pendingElectricians = [
    {
      id: '1',
      name: language === 'hi' ? 'विकास कुमार' : 'Vikas Kumar',
      experience: 3,
      location: language === 'hi' ? 'नोएडा' : 'Noida',
      services: [language === 'hi' ? 'वायरिंग' : 'Wiring', language === 'hi' ? 'फैन रिपेयर' : 'Fan Repair'],
      appliedDate: '2024-01-10'
    },
    {
      id: '2',
      name: language === 'hi' ? 'अमित शर्मा' : 'Amit Sharma',
      experience: 5,
      location: language === 'hi' ? 'गुरुग्राम' : 'Gurgaon',
      services: [language === 'hi' ? 'स्विच रिपेयर' : 'Switch Repair'],
      appliedDate: '2024-01-12'
    }
  ];

  // New services pending verification
  const [pendingServices, setPendingServices] = useState([
    {
      id: '1',
      electricianName: language === 'hi' ? 'राम प्रसाद' : 'Ram Prasad',
      serviceName: language === 'hi' ? 'फैन इंस्टालेशन' : 'Fan Installation',
      category: language === 'hi' ? 'इंस्टालेशन' : 'Installation',
      basePrice: 150,
      description: language === 'hi' ? 'सीलिंग फैन की स्थापना' : 'Ceiling fan installation',
      submittedDate: '2024-01-15'
    },
    {
      id: '2',
      electricianName: language === 'hi' ? 'सुरेश कुमार' : 'Suresh Kumar',
      serviceName: language === 'hi' ? 'वायरिंग रिपेयर' : 'Wiring Repair',
      category: language === 'hi' ? 'रिपेयर' : 'Repair',
      basePrice: 200,
      description: language === 'hi' ? 'घरेलू वायरिंग की मरम्मत' : 'Home wiring repair',
      submittedDate: '2024-01-14'
    }
  ]);

  const recentComplaints = [
    {
      id: '1',
      user: language === 'hi' ? 'राहुल गुप्ता' : 'Rahul Gupta',
      subject: language === 'hi' ? 'गलत बिल' : 'Wrong billing',
      status: 'pending',
      date: '2024-01-15'
    }
  ];

  const handleApproveService = (serviceId) => {
    setPendingServices(pendingServices.filter(service => service.id !== serviceId));
    toast({
      title: language === 'hi' ? 'सेवा मंजूर' : 'Service Approved',
      description: language === 'hi' ? 'सेवा सफलतापूर्वक मंजूर की गई' : 'Service approved successfully'
    });
  };

  const handleRejectService = (serviceId) => {
    setPendingServices(pendingServices.filter(service => service.id !== serviceId));
    toast({
      title: language === 'hi' ? 'सेवा अस्वीकृत' : 'Service Rejected',
      description: language === 'hi' ? 'सेवा अस्वीकृत की गई' : 'Service has been rejected'
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
            <TabsTrigger value="electricians">{language === 'hi' ? 'इलेक्ट्रीशियन' : 'Electricians'}</TabsTrigger>
            <TabsTrigger value="services">{language === 'hi' ? 'सेवाएं' : 'Services'}</TabsTrigger>
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
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'प्रतीक्षारत सेवाएं' : 'Pending Services'}</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.pendingServices}</p>
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

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'hi' ? 'प्रतीक्षारत सेवाएं' : 'Pending Services'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{service.serviceName}</h3>
                      <p className="text-sm text-gray-600">
                        {language === 'hi' ? 'इलेक्ट्रीशियन:' : 'Electrician:'} {service.electricianName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'hi' ? 'श्रेणी:' : 'Category:'} {service.category} • 
                        {language === 'hi' ? ' मूल्य:' : ' Price:'} ₹{service.basePrice}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {language === 'hi' ? 'प्रस्तुत:' : 'Submitted:'} {service.submittedDate}
                      </p>
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
                        {electrician.experience} {t('years_experience')} • {electrician.location}
                      </p>
                      <div className="flex space-x-1 mt-1">
                        {electrician.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Applied: {electrician.appliedDate}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 mr-1" />
                        {t('reject')}
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {language === 'hi' ? 'अप्रूव' : 'Approve'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'hi' ? 'हालिया शिकायतें' : 'Recent Complaints'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{complaint.user}</h3>
                      <p className="text-sm text-gray-600">{complaint.subject}</p>
                      <p className="text-xs text-gray-400">{complaint.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-orange-600">
                        {t(complaint.status)}
                      </Badge>
                      <Button size="sm">
                        {language === 'hi' ? 'देखें' : 'View'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'hi' ? 'जॉब मैनेजमेंट' : 'Job Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder={language === 'hi' ? 'जॉब्स खोजें...' : 'Search jobs...'} 
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    {t('filter')}
                  </Button>
                </div>
                <p className="text-center text-gray-500 py-8">
                  {language === 'hi' ? 'जॉब लिस्ट यहाँ दिखाई जाएगी' : 'Job list will be displayed here'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
