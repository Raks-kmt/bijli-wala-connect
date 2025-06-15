
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Star, Clock, Zap, MessageSquare, Bell, User, Wallet, Camera, CheckCircle, XCircle, Phone, Navigation } from 'lucide-react';

const ElectricianDashboard = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobRequests, setJobRequests] = useState([
    {
      id: '1',
      customer: language === 'hi' ? 'अनिल गुप्ता' : 'Anil Gupta',
      phone: '+91 98765 43210',
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
      phone: '+91 87654 32109',
      service: language === 'hi' ? 'आपातकालीन वायरिंग' : 'Emergency Wiring',
      address: language === 'hi' ? 'डीएलएफ फेज 2' : 'DLF Phase 2',
      distance: 5.1,
      amount: 800,
      isEmergency: true,
      requestTime: '2 min ago'
    }
  ]);

  const [activeJobs, setActiveJobs] = useState([
    {
      id: '3',
      customer: language === 'hi' ? 'राज मल्होत्रा' : 'Raj Malhotra',
      phone: '+91 76543 21098',
      service: language === 'hi' ? 'स्विच रिपेयर' : 'Switch Repair',
      address: language === 'hi' ? 'सेक्टर 21' : 'Sector 21',
      status: 'in_progress',
      startTime: '2 hours ago'
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedJobForCompletion, setSelectedJobForCompletion] = useState(null);
  const [showJobsModal, setShowJobsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);

  // Mock data
  const stats = {
    totalEarnings: 15420,
    completedJobs: 45,
    rating: 4.7,
    activeJobs: activeJobs.length
  };

  const notifications = [
    { id: '1', title: language === 'hi' ? 'नया जॉब रिक्वेस्ट' : 'New Job Request', message: language === 'hi' ? 'आपके पास नया जॉब रिक्वेस्ट है' : 'You have a new job request', time: '5 min ago' },
    { id: '2', title: language === 'hi' ? 'पेमेंट प्राप्त' : 'Payment Received', message: language === 'hi' ? '₹450 आपके वॉलेट में जोड़े गए' : '₹450 added to your wallet', time: '1 hour ago' }
  ];

  const earningsData = [
    { date: '2024-01-15', amount: 450, job: 'Fan Repair', customer: 'Anil Gupta' },
    { date: '2024-01-14', amount: 800, job: 'Emergency Wiring', customer: 'Priya Sharma' },
    { date: '2024-01-13', amount: 300, job: 'Switch Installation', customer: 'Raj Kumar' },
  ];

  const handleAcceptJob = (jobId) => {
    const job = jobRequests.find(j => j.id === jobId);
    if (job) {
      setActiveJobs([...activeJobs, { ...job, status: 'accepted', startTime: 'Just now' }]);
      setJobRequests(jobRequests.filter(j => j.id !== jobId));
      toast({
        title: language === 'hi' ? 'जॉब स्वीकार किया गया' : 'Job Accepted',
        description: language === 'hi' ? 'आपने जॉब स्वीकार कर लिया है' : 'You have accepted the job',
      });
    }
  };

  const handleRejectJob = (jobId) => {
    setJobRequests(jobRequests.filter(j => j.id !== jobId));
    toast({
      title: language === 'hi' ? 'जॉब अस्वीकार किया गया' : 'Job Rejected',
      description: language === 'hi' ? 'आपने जॉब अस्वीकार कर दिया है' : 'You have rejected the job',
    });
  };

  const handleStartChat = (customer, phone) => {
    toast({
      title: language === 'hi' ? 'चैट शुरू करें' : 'Start Chat',
      description: language === 'hi' ? `${customer} के साथ चैट शुरू की गई` : `Chat started with ${customer}`,
    });
  };

  const handleCallCustomer = (customer, phone) => {
    toast({
      title: language === 'hi' ? 'कॉल करें' : 'Calling',
      description: language === 'hi' ? `${customer} को कॉल कर रहे हैं...` : `Calling ${customer}...`,
    });
  };

  const handleNavigate = (address) => {
    toast({
      title: language === 'hi' ? 'नेवीगेशन' : 'Navigation',
      description: language === 'hi' ? `${address} के लिए नेवीगेशन शुरू किया गया` : `Navigation started to ${address}`,
    });
  };

  const handleCompleteJob = (job) => {
    setSelectedJobForCompletion(job);
    setShowCompletionModal(true);
  };

  const handleJobCompletion = () => {
    if (selectedJobForCompletion) {
      setActiveJobs(activeJobs.filter(j => j.id !== selectedJobForCompletion.id));
      setShowCompletionModal(false);
      setSelectedJobForCompletion(null);
      toast({
        title: language === 'hi' ? 'जॉब पूरा किया गया' : 'Job Completed',
        description: language === 'hi' ? 'जॉब सफलतापूर्वक पूरा किया गया' : 'Job completed successfully',
      });
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'profile':
        setShowProfile(true);
        break;
      case 'portfolio':
        toast({
          title: language === 'hi' ? 'पोर्टफोलियो' : 'Portfolio',
          description: language === 'hi' ? 'पोर्टफोलियो पेज खोला जा रहा है...' : 'Opening portfolio page...',
        });
        break;
      default:
        break;
    }
  };

  const handleBottomNavClick = (tab) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'dashboard':
        toast({
          title: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
          description: language === 'hi' ? 'डैशबोर्ड पेज पर जा रहे हैं' : 'Navigating to dashboard',
        });
        break;
      case 'jobs':
        setShowJobsModal(true);
        break;
      case 'chat':
        setShowChatModal(true);
        break;
      case 'earnings':
        setShowEarningsModal(true);
        break;
      case 'profile':
        setShowProfile(true);
        break;
      default:
        toast({
          title: language === 'hi' ? 'नेवीगेशन' : 'Navigation',
          description: language === 'hi' ? `${tab} पेज पर जा रहे हैं` : `Navigating to ${tab} page`,
        });
        break;
    }
  };

  const handleAvailabilityToggle = (checked) => {
    setIsAvailable(checked);
    toast({
      title: language === 'hi' ? 'उपलब्धता' : 'Availability',
      description: checked 
        ? (language === 'hi' ? 'आप अब उपलब्ध हैं' : 'You are now available')
        : (language === 'hi' ? 'आप अब अनुपलब्ध हैं' : 'You are now unavailable'),
    });
  };

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
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(true)}>
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>
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
                  onCheckedChange={handleAvailabilityToggle}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleBottomNavClick('earnings')}>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">₹{stats.totalEarnings}</div>
              <p className="text-sm text-gray-600">{t('earnings')}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.completedJobs}</div>
              <p className="text-sm text-gray-600">{language === 'hi' ? 'पूरे किए गए जॉब्स' : 'Completed Jobs'}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="text-2xl font-bold">{stats.rating}</span>
              </div>
              <p className="text-sm text-gray-600">{t('rating')}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleBottomNavClick('jobs')}>
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
                  <div className="flex space-x-2 mb-2">
                    <Button size="sm" variant="outline" onClick={() => handleCallCustomer(job.customer, job.phone)}>
                      <Phone className="h-4 w-4 mr-1" />
                      {language === 'hi' ? 'कॉल' : 'Call'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleNavigate(job.address)}>
                      <Navigation className="h-4 w-4 mr-1" />
                      {language === 'hi' ? 'नेवीगेट' : 'Navigate'}
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRejectJob(job.id)}>
                      <XCircle className="h-4 w-4 mr-1" />
                      {t('reject')}
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handleAcceptJob(job.id)}>
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
                  <div className="flex space-x-2 mb-2">
                    <Button size="sm" variant="outline" onClick={() => handleCallCustomer(job.customer, job.phone)}>
                      <Phone className="h-4 w-4 mr-1" />
                      {language === 'hi' ? 'कॉल' : 'Call'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleNavigate(job.address)}>
                      <Navigation className="h-4 w-4 mr-1" />
                      {language === 'hi' ? 'नेवीगेट' : 'Navigate'}
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleStartChat(job.customer, job.phone)}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {t('chat')}
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handleCompleteJob(job)}>
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
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('profile')}>
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">{t('my_profile')}</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('portfolio')}>
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
            { icon: Clock, label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard', key: 'dashboard' },
            { icon: Zap, label: language === 'hi' ? 'जॉब्स' : 'Jobs', key: 'jobs' },
            { icon: MessageSquare, label: language === 'hi' ? 'चैट' : 'Chat', key: 'chat' },
            { icon: Wallet, label: language === 'hi' ? 'कमाई' : 'Earnings', key: 'earnings' },
            { icon: User, label: language === 'hi' ? 'प्रोफाइल' : 'Profile', key: 'profile' }
          ].map((item, index) => (
            <Button 
              key={`bottom-nav-${item.key}`}
              variant="ghost" 
              size="sm" 
              className={`flex flex-col items-center py-3 ${activeTab === item.key ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => handleBottomNavClick(item.key)}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Jobs Modal */}
      <Dialog open={showJobsModal} onOpenChange={setShowJobsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'hi' ? 'सभी जॉब्स' : 'All Jobs'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <h3 className="font-medium mb-2">{language === 'hi' ? 'नए रिक्वेस्ट' : 'New Requests'}</h3>
              {jobRequests.map((job) => (
                <div key={`modal-job-${job.id}`} className="p-3 border rounded-lg mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{job.customer}</h4>
                      <p className="text-sm text-gray-600">{job.service}</p>
                      <p className="text-sm text-green-600">₹{job.amount}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleAcceptJob(job.id)}>
                        {language === 'hi' ? 'स्वीकार' : 'Accept'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-medium mb-2">{language === 'hi' ? 'एक्टिव जॉब्स' : 'Active Jobs'}</h3>
              {activeJobs.map((job) => (
                <div key={`modal-active-${job.id}`} className="p-3 border rounded-lg mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{job.customer}</h4>
                      <p className="text-sm text-gray-600">{job.service}</p>
                      <Badge className="bg-blue-500 text-xs">{job.status}</Badge>
                    </div>
                    <Button size="sm" onClick={() => handleCompleteJob(job)}>
                      {language === 'hi' ? 'पूरा करें' : 'Complete'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'hi' ? 'चैट' : 'Chat'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">
                {language === 'hi' ? 'कोई चैट नहीं मिली' : 'No chats found'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'hi' ? 'जॉब स्वीकार करने के बाद चैट शुरू करें' : 'Start chatting after accepting a job'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Earnings Modal */}
      <Dialog open={showEarningsModal} onOpenChange={setShowEarningsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'hi' ? 'कमाई' : 'Earnings'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">₹{stats.totalEarnings}</h3>
              <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल कमाई' : 'Total Earnings'}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">{language === 'hi' ? 'हाल की कमाई' : 'Recent Earnings'}</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {earningsData.map((earning, index) => (
                  <div key={`earning-${index}`} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{earning.job}</h4>
                        <p className="text-sm text-gray-600">{earning.customer}</p>
                        <p className="text-xs text-gray-400">{earning.date}</p>
                      </div>
                      <p className="font-bold text-green-600">₹{earning.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'hi' ? 'सूचनाएं' : 'Notifications'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-3 border rounded-lg">
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'hi' ? 'प्रोफाइल' : 'Profile'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-semibold">{language === 'hi' ? 'राम प्रसाद' : 'Ram Prasad'}</h3>
              <p className="text-sm text-gray-600">{language === 'hi' ? 'इलेक्ट्रिशियन' : 'Electrician'}</p>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={() => {
                toast({
                  title: language === 'hi' ? 'प्रोफाइल एडिट' : 'Edit Profile',
                  description: language === 'hi' ? 'प्रोफाइल एडिट पेज खोला जा रहा है...' : 'Opening edit profile page...',
                });
              }}>
                {language === 'hi' ? 'प्रोफाइल एडिट करें' : 'Edit Profile'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {
                toast({
                  title: language === 'hi' ? 'सेटिंग्स' : 'Settings',
                  description: language === 'hi' ? 'सेटिंग्स पेज खोला जा रहा है...' : 'Opening settings page...',
                });
              }}>
                {language === 'hi' ? 'सेटिंग्स' : 'Settings'}
              </Button>
              <Button variant="outline" className="w-full text-red-600" onClick={() => {
                toast({
                  title: language === 'hi' ? 'लॉगआउट' : 'Logout',
                  description: language === 'hi' ? 'लॉगआउट हो रहे हैं...' : 'Logging out...',
                });
              }}>
                {language === 'hi' ? 'लॉगआउट' : 'Logout'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Completion Dialog */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'hi' ? 'जॉब पूरा करें' : 'Complete Job'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {language === 'hi' ? 'कृपया जॉब की फोटो अपलोड करें और काम पूरा करें' : 'Please upload photos of the completed work'}
            </p>
            <Button variant="outline" className="w-full" onClick={() => {
              toast({
                title: language === 'hi' ? 'फोटो अपलोड' : 'Upload Photos',
                description: language === 'hi' ? 'फोटो अपलोड करने की सुविधा जल्दी आएगी' : 'Photo upload feature coming soon',
              });
            }}>
              <Camera className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'फोटो अपलोड करें' : 'Upload Photos'}
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowCompletionModal(false)}>
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </Button>
              <Button className="flex-1" onClick={handleJobCompletion}>
                {language === 'hi' ? 'पूरा करें' : 'Complete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ElectricianDashboard;
