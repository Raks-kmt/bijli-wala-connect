import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';
import { useRealtime } from '../../contexts/RealtimeContext';
import { useRealtimeJobs } from '../../hooks/useRealtimeJobs';
import { useToast } from '@/hooks/use-toast';
import { Star, MapPin, Clock, Zap, MessageSquare, Bell, User, Wallet, Settings, Phone, Edit, LogOut, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import RealtimeIndicator from '../common/RealtimeIndicator';
import LiveChatWidget from '../common/LiveChatWidget';
import ServicesManagement from './ServicesManagement';

const ElectricianDashboard = () => {
  const { t, language } = useLanguage();
  const { user, logout, updateUser } = useAuth();
  const { jobs, updateJobStatus, electricians, notifications, markNotificationRead } = useAppData();
  const { isConnected, updateJobStatus: realtimeUpdateJob } = useRealtime();
  const { liveJobs, updateJobWithNotification } = useRealtimeJobs();
  const { toast } = useToast();
  
  const [currentSection, setCurrentSection] = useState<'home' | 'jobs' | 'chat' | 'wallet' | 'services' | 'profile'>('home');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{ id: string; name: string } | null>(null);

  // Get current electrician data
  const currentElectrician = electricians.find(e => e.id === user?.id);
  const electricianJobs = liveJobs.filter(job => job.electricianId === user?.id);
  const unreadNotifications = notifications.filter(n => n.userId === user?.id && !n.isRead);

  const stats = {
    totalJobs: currentElectrician?.totalJobs || 0,
    completedJobs: electricianJobs.filter(job => job.status === 'completed').length,
    rating: currentElectrician?.rating || 0,
    earnings: currentElectrician?.earnings || 0,
    activeJobs: electricianJobs.filter(job => job.status === 'in_progress' || job.status === 'accepted').length
  };

  const handleAcceptJob = (jobId: string) => {
    updateJobWithNotification(jobId, 'accepted');
    toast({
      title: language === 'hi' ? 'जॉब स्वीकार की गई' : 'Job Accepted',
      description: language === 'hi' ? 'आपने जॉब स्वीकार कर ली है' : 'You have accepted the job',
    });
  };

  const handleStartJob = (jobId: string) => {
    updateJobWithNotification(jobId, 'in_progress');
    toast({
      title: language === 'hi' ? 'जॉब शुरू की गई' : 'Job Started',
      description: language === 'hi' ? 'जॉब की शुरुआत हो गई है' : 'Job has been started',
    });
  };

  const handleCompleteJob = (jobId: string) => {
    updateJobWithNotification(jobId, 'completed');
    toast({
      title: language === 'hi' ? 'जॉब पूरी की गई' : 'Job Completed',
      description: language === 'hi' ? 'जॉब सफलतापूर्वक पूरी कर दी गई' : 'Job completed successfully',
    });
  };

  const handleChatWithCustomer = (customerId: string, customerName: string) => {
    setChatRecipient({ id: customerId, name: customerName });
    setChatOpen(true);
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
    try {
      logout();
      console.log('Logout function called successfully');
      toast({
        title: language === 'hi' ? 'लॉगआउट सफल' : 'Logout Successful',
        description: language === 'hi' ? 'आप सफलतापूर्वक लॉगआउट हो गए' : 'You have been logged out successfully',
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: language === 'hi' ? 'लॉगआउट में त्रुटि' : 'Logout Error',
        description: language === 'hi' ? 'लॉगआउट में समस्या हुई' : 'There was an error during logout',
        variant: 'destructive'
      });
    }
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    toast({
      title: language === 'hi' ? 'उपलब्धता अपडेट' : 'Availability Updated',
      description: isAvailable ? 
        (language === 'hi' ? 'आप अब अनुपलब्ध हैं' : 'You are now unavailable') :
        (language === 'hi' ? 'आप अब उपलब्ध हैं' : 'You are now available'),
    });
  };

  const renderHomeSection = () => (
    <div className="p-4 space-y-6">
      {/* Connection Status */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
        </h2>
        <RealtimeIndicator />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalJobs}</div>
            <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल जॉब्स' : 'Total Jobs'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">₹{stats.earnings}</div>
            <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल कमाई' : 'Total Earnings'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="text-2xl font-bold">{stats.rating}</span>
            </div>
            <p className="text-sm text-gray-600">{language === 'hi' ? 'रेटिंग' : 'Rating'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.activeJobs}</div>
            <p className="text-sm text-gray-600">{language === 'hi' ? 'एक्टिव जॉब्स' : 'Active Jobs'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Availability Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{language === 'hi' ? 'उपलब्धता स्थिति' : 'Availability Status'}</h3>
              <p className="text-sm text-gray-600">
                {isAvailable ? 
                  (language === 'hi' ? 'आप नई जॉब्स के लिए उपलब्ध हैं' : 'You are available for new jobs') :
                  (language === 'hi' ? 'आप अभी अनुपलब्ध हैं' : 'You are currently unavailable')
                }
              </p>
            </div>
            <Switch checked={isAvailable} onCheckedChange={toggleAvailability} />
          </div>
        </CardContent>
      </Card>

      {/* New Job Requests */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          {language === 'hi' ? 'नई जॉब रिक्वेस्ट' : 'New Job Requests'}
          {isConnected && (
            <Badge variant="default" className="ml-2 text-xs">
              {language === 'hi' ? 'लाइव' : 'Live'}
            </Badge>
          )}
        </h2>
        <div className="space-y-3">
          {electricianJobs.filter(job => job.status === 'pending').map((job) => (
            <Card key={job.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{job.description}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.address}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.scheduledDate}
                      </div>
                      <span className="font-semibold text-green-600">₹{job.totalPrice}</span>
                    </div>
                  </div>
                  {job.isEmergency && (
                    <Badge variant="destructive" className="ml-2">
                      {language === 'hi' ? 'आपातकाल' : 'Emergency'}
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => updateJobWithNotification(job.id, 'cancelled')}>
                    {language === 'hi' ? 'अस्वीकार' : 'Decline'}
                  </Button>
                  <Button size="sm" onClick={() => handleAcceptJob(job.id)}>
                    {language === 'hi' ? 'स्वीकार करें' : 'Accept'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {electricianJobs.filter(job => job.status === 'pending').length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                {language === 'hi' ? 'कोई नई जॉब रिक्वेस्ट नहीं' : 'No new job requests'}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Active Jobs */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {language === 'hi' ? 'एक्टिव जॉब्स' : 'Active Jobs'}
        </h2>
        <div className="space-y-3">
          {electricianJobs.filter(job => job.status === 'accepted' || job.status === 'in_progress').map((job) => (
            <Card key={job.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{job.description}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.address}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.scheduledDate}
                      </div>
                      <span className="font-semibold text-green-600">₹{job.totalPrice}</span>
                    </div>
                  </div>
                  <Badge variant={job.status === 'accepted' ? 'secondary' : 'default'}>
                    {job.status === 'accepted' ? 
                      (language === 'hi' ? 'स्वीकृत' : 'Accepted') : 
                      (language === 'hi' ? 'चालू' : 'In Progress')
                    }
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleChatWithCustomer(job.customerId, 'Customer')}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {language === 'hi' ? 'चैट' : 'Chat'}
                  </Button>
                  {job.status === 'accepted' ? (
                    <Button size="sm" onClick={() => handleStartJob(job.id)}>
                      {language === 'hi' ? 'शुरू करें' : 'Start Job'}
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleCompleteJob(job.id)}>
                      {language === 'hi' ? 'पूरा करें' : 'Complete'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {electricianJobs.filter(job => job.status === 'accepted' || job.status === 'in_progress').length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                {language === 'hi' ? 'कोई एक्टिव जॉब नहीं' : 'No active jobs'}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'jobs':
        return renderHomeSection(); // Jobs are shown on home
      case 'services':
        return <ServicesManagement isOpen={true} onClose={() => setCurrentSection('home')} />;
      case 'chat':
        return (
          <div className="p-4 text-center text-gray-500">
            {language === 'hi' ? 'चैट फीचर उपलब्ध है - जॉब्स में चैट बटन दबाएं' : 'Chat feature available - click chat button in jobs'}
          </div>
        );
      case 'wallet':
        return (
          <div className="p-4 text-center text-gray-500">
            {language === 'hi' ? 'वॉलेट फीचर जल्द आएगा' : 'Wallet feature coming soon'}
          </div>
        );
      case 'profile':
        return (
          <div className="p-4 text-center text-gray-500">
            {language === 'hi' ? 'प्रोफाइल फीचर जल्द आएगा' : 'Profile feature coming soon'}
          </div>
        );
      default:
        return renderHomeSection();
    }
  };

  // Debug: Add console log to check current user state
  console.log('Current user in ElectricianDashboard:', user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'hi' ? 'नमस्ते, ' : 'Hello, '}{user?.name}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'आज आपके लिए ' : 'You have '}{electricianJobs.filter(job => job.status === 'pending').length} {language === 'hi' ? 'नई जॉब्स हैं' : 'new jobs'}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => markNotificationRead('all')}>
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleEditProfile}>
                <Edit className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSettings}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {renderCurrentSection()}

      {/* Live Chat Widget */}
      {chatRecipient && (
        <LiveChatWidget
          recipientId={chatRecipient.id}
          recipientName={chatRecipient.name}
          isOpen={chatOpen}
          onClose={() => {
            setChatOpen(false);
            setChatRecipient(null);
          }}
        />
      )}

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'hi' ? 'प्रोफाइल एडिट करें' : 'Edit Profile'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{language === 'hi' ? 'नाम' : 'Name'}</Label>
              <Input defaultValue={user?.name} />
            </div>
            <div>
              <Label>{language === 'hi' ? 'फोन' : 'Phone'}</Label>
              <Input defaultValue={user?.phone} />
            </div>
            <div>
              <Label>{language === 'hi' ? 'अनुभव (वर्ष)' : 'Experience (Years)'}</Label>
              <Input type="number" defaultValue={currentElectrician?.experience} />
            </div>
            <div>
              <Label>{language === 'hi' ? 'शिक्षा' : 'Education'}</Label>
              <Input defaultValue={currentElectrician?.education} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProfile(false)}>
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button onClick={() => setShowEditProfile(false)}>
              {language === 'hi' ? 'सेव करें' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{language === 'hi' ? 'नोटिफिकेशन' : 'Notifications'}</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>{language === 'hi' ? 'लोकेशन शेयरिंग' : 'Location Sharing'}</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>{language === 'hi' ? 'आपातकालीन जॉब्स' : 'Emergency Jobs'}</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>
              {language === 'hi' ? 'सेव करें' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Zap, label: language === 'hi' ? 'होम' : 'Home', key: 'home' },
            { icon: Clock, label: language === 'hi' ? 'जॉब्स' : 'Jobs', key: 'jobs' },
            { icon: Plus, label: language === 'hi' ? 'सेवाएं' : 'Services', key: 'services' },
            { icon: MessageSquare, label: language === 'hi' ? 'चैट' : 'Chat', key: 'chat' },
            { icon: User, label: language === 'hi' ? 'प्रोफाइल' : 'Profile', key: 'profile' }
          ].map((item) => (
            <Button 
              key={item.key} 
              variant="ghost" 
              size="sm" 
              className={`flex flex-col items-center py-3 ${currentSection === item.key ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setCurrentSection(item.key as any)}
            >
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
