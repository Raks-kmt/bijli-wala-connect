import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Search, MapPin, Star, Clock, Zap, MessageSquare, Bell, User, Wallet } from 'lucide-react';
import BookingSection from './BookingSection';
import ChatSection from './ChatSection';
import WalletSection from './WalletSection';
import ProfileSection from './ProfileSection';
import BookingModal from './BookingModal';

interface Electrician {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience: number;
  distance: number;
  services: string[];
  basePrice: number;
  isAvailable: boolean;
  completedJobs: number;
}

const CustomerDashboard = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'nearby' | 'top_rated' | 'available'>('all');
  const [currentSection, setCurrentSection] = useState<'home' | 'bookings' | 'chat' | 'wallet' | 'profile'>('home');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedElectrician, setSelectedElectrician] = useState<Electrician | null>(null);

  const electricians: Electrician[] = [
    {
      id: '1',
      name: language === 'hi' ? 'राम कुमार' : 'Ram Kumar',
      image: '/placeholder.svg',
      rating: 4.8,
      experience: 5,
      distance: 2.3,
      services: [
        language === 'hi' ? 'वायरिंग' : 'Wiring',
        language === 'hi' ? 'फैन रिपेयर' : 'Fan Repair'
      ],
      basePrice: 300,
      isAvailable: true,
      completedJobs: 120
    },
    {
      id: '2',
      name: language === 'hi' ? 'सुरेश शर्मा' : 'Suresh Sharma',
      image: '/placeholder.svg',
      rating: 4.6,
      experience: 8,
      distance: 4.1,
      services: [
        language === 'hi' ? 'स्विच रिपेयर' : 'Switch Repair',
        language === 'hi' ? 'लाइट फिटिंग' : 'Light Fitting'
      ],
      basePrice: 400,
      isAvailable: false,
      completedJobs: 200
    }
  ];

  const quickServices = [
    { 
      name: language === 'hi' ? 'आपातकालीन सेवा' : 'Emergency Service', 
      icon: Zap, 
      color: 'bg-red-500',
      action: () => handleEmergencyService()
    },
    { 
      name: language === 'hi' ? 'घर की वायरिंग' : 'Home Wiring', 
      icon: Clock, 
      color: 'bg-blue-500',
      action: () => handleQuickService('wiring')
    },
    { 
      name: language === 'hi' ? 'फैन रिपेयर' : 'Fan Repair', 
      icon: Star, 
      color: 'bg-green-500',
      action: () => handleQuickService('fan_repair')
    },
    { 
      name: language === 'hi' ? 'स्विच रिपेयर' : 'Switch Repair', 
      icon: Zap, 
      color: 'bg-purple-500',
      action: () => handleQuickService('switch_repair')
    }
  ];

  const recentBookings = [
    {
      id: '1',
      electrician: language === 'hi' ? 'राम कुमार' : 'Ram Kumar',
      service: language === 'hi' ? 'फैन रिपेयर' : 'Fan Repair',
      status: 'completed',
      date: '2024-01-15',
      amount: 450
    }
  ];

  const handleEmergencyService = () => {
    console.log('Emergency service requested');
    const nearestElectrician = electricians
      .filter(e => e.isAvailable)
      .sort((a, b) => a.distance - b.distance)[0];
    
    if (nearestElectrician) {
      setSelectedElectrician(nearestElectrician);
      setShowBookingModal(true);
      toast({
        title: language === 'hi' ? 'आपातकालीन सेवा' : 'Emergency Service',
        description: language === 'hi' ? 'निकटतम इलेक्ट्रीशियन मिल गया' : 'Nearest electrician found',
      });
    } else {
      toast({
        title: language === 'hi' ? 'क्षमा करें' : 'Sorry',
        description: language === 'hi' ? 'कोई इलेक्ट्रीशियन उपलब्ध नहीं' : 'No electrician available',
        variant: 'destructive'
      });
    }
  };

  const handleQuickService = (serviceType: string) => {
    console.log('Quick service requested:', serviceType);
    const relevantElectricians = electricians.filter(e => 
      e.services.some(service => 
        service.toLowerCase().includes(serviceType.replace('_', ' '))
      )
    );
    
    if (relevantElectricians.length > 0) {
      setSelectedElectrician(relevantElectricians[0]);
      setShowBookingModal(true);
      toast({
        title: language === 'hi' ? 'सेवा मिली' : 'Service Found',
        description: language === 'hi' ? 'इलेक्ट्रीशियन मिल गया' : 'Electrician found for this service',
      });
    } else {
      toast({
        title: language === 'hi' ? 'क्षमा करें' : 'Sorry',
        description: language === 'hi' ? 'इस सेवा के लिए कोई इलेक्ट्रीशियन नहीं मिला' : 'No electrician found for this service',
        variant: 'destructive'
      });
    }
  };

  const bookElectrician = (electricianId: string) => {
    console.log('Booking electrician:', electricianId);
    const electrician = electricians.find(e => e.id === electricianId);
    if (electrician) {
      setSelectedElectrician(electrician);
      setShowBookingModal(true);
    }
  };

  const chatWithElectrician = (electricianId: string) => {
    console.log('Starting chat with electrician:', electricianId);
    setCurrentSection('chat');
    toast({
      title: language === 'hi' ? 'चैट शुरू' : 'Chat Started',
      description: language === 'hi' ? 'इलेक्ट्रीशियन के साथ चैट खुल गई' : 'Chat opened with electrician',
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
    if (query.trim()) {
      toast({
        title: language === 'hi' ? 'खोज रहे हैं' : 'Searching',
        description: language === 'hi' ? `"${query}" के लिए खोज रहे हैं` : `Searching for "${query}"`,
      });
    }
  };

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter as any);
    console.log('Applying filter:', filter);
    const filterTexts = {
      all: language === 'hi' ? 'सभी' : 'All',
      nearby: language === 'hi' ? 'नजदीकी' : 'Nearby',
      top_rated: language === 'hi' ? 'टॉप रेटेड' : 'Top Rated',
      available: language === 'hi' ? 'उपलब्ध' : 'Available'
    };
    toast({
      title: language === 'hi' ? 'फिल्टर लगाया गया' : 'Filter Applied',
      description: filterTexts[filter as keyof typeof filterTexts],
    });
  };

  const handleNotifications = () => {
    console.log('Opening notifications');
    toast({
      title: language === 'hi' ? 'नोटिफिकेशन' : 'Notifications',
      description: language === 'hi' ? 'आपके पास 3 नए नोटिफिकेशन हैं' : 'You have 3 new notifications',
    });
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'bookings':
        return <BookingSection />;
      case 'chat':
        return <ChatSection />;
      case 'wallet':
        return <WalletSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return renderHomeSection();
    }
  };

  const renderHomeSection = () => (
    <div className="p-4 space-y-6">
      {/* Quick Services */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {language === 'hi' ? 'त्वरित सेवाएं' : 'Quick Services'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickServices.map((service, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={service.action}>
              <CardContent className="p-4 text-center">
                <div className={`${service.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">{service.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Electricians */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {language === 'hi' ? 'उपलब्ध इलेक्ट्रीशियन' : 'Available Electricians'}
        </h2>
        <div className="space-y-3">
          {electricians.map((electrician) => (
            <Card key={electrician.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img 
                      src={electrician.image} 
                      alt={electrician.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {electrician.isAvailable && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{electrician.name}</h3>
                      <Badge variant={electrician.isAvailable ? "default" : "secondary"}>
                        {electrician.isAvailable ? (language === 'hi' ? 'उपलब्ध' : 'Available') : (language === 'hi' ? 'अनुपलब्ध' : 'Unavailable')}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {electrician.rating}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {electrician.experience} {language === 'hi' ? 'साल' : 'yrs'}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {electrician.distance} km
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {electrician.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">
                        <span className="text-gray-600">{language === 'hi' ? 'बेस चार्ज' : 'Base charge'}: </span>
                        <span className="font-semibold">₹{electrician.basePrice}</span>
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => chatWithElectrician(electrician.id)}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {language === 'hi' ? 'चैट' : 'Chat'}
                        </Button>
                        <Button size="sm" onClick={() => bookElectrician(electrician.id)}>
                          {language === 'hi' ? 'बुक करें' : 'Book Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {language === 'hi' ? 'हालिया बुकिंग' : 'Recent Bookings'}
        </h2>
        <div className="space-y-3">
          {recentBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{booking.electrician}</h3>
                  <Badge 
                    variant={booking.status === 'completed' ? 'default' : 'secondary'}
                    className={booking.status === 'completed' ? 'bg-green-500' : ''}
                  >
                    {booking.status === 'completed' ? (language === 'hi' ? 'पूर्ण' : 'Completed') : booking.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{booking.service}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{booking.date}</span>
                  <span className="font-semibold">₹{booking.amount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  if (currentSection !== 'home') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header for non-home sections */}
        <div className="bg-white shadow-sm border-b">
          <div className="p-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentSection('home')}>
              ← {language === 'hi' ? 'होम' : 'Home'}
            </Button>
            <h1 className="text-lg font-semibold">
              {currentSection === 'bookings' && (language === 'hi' ? 'बुकिंग' : 'Bookings')}
              {currentSection === 'chat' && (language === 'hi' ? 'चैट' : 'Chat')}
              {currentSection === 'wallet' && (language === 'hi' ? 'वॉलेट' : 'Wallet')}
              {currentSection === 'profile' && (language === 'hi' ? 'प्रोफाइल' : 'Profile')}
            </h1>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handleNotifications}>
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        {renderCurrentSection()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'hi' ? 'नमस्ते!' : 'Hello!'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'आज आपको किस सेवा की जरूरत है?' : 'What service do you need today?'}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handleNotifications}>
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentSection('profile')}>
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={language === 'hi' ? 'इलेक्ट्रीशियन खोजें...' : 'Search electricians...'}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: language === 'hi' ? 'सभी' : 'All' },
              { key: 'nearby', label: language === 'hi' ? 'नजदीकी' : 'Nearby' },
              { key: 'top_rated', label: language === 'hi' ? 'टॉप रेटेड' : 'Top Rated' },
              { key: 'available', label: language === 'hi' ? 'उपलब्ध' : 'Available' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilter(filter.key)}
                className="whitespace-nowrap"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {renderCurrentSection()}

      {/* Booking Modal */}
      {showBookingModal && selectedElectrician && (
        <BookingModal
          electrician={selectedElectrician}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedElectrician(null);
          }}
          onConfirm={(bookingData) => {
            console.log('Booking confirmed:', bookingData);
            setShowBookingModal(false);
            setSelectedElectrician(null);
            setCurrentSection('bookings');
            toast({
              title: language === 'hi' ? 'बुकिंग सफल' : 'Booking Successful',
              description: language === 'hi' ? 'आपकी बुकिंग कन्फर्म हो गई' : 'Your booking has been confirmed',
            });
          }}
        />
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Search, label: language === 'hi' ? 'खोजें' : 'Search', key: 'home' },
            { icon: Clock, label: language === 'hi' ? 'बुकिंग' : 'Bookings', key: 'bookings' },
            { icon: MessageSquare, label: language === 'hi' ? 'चैट' : 'Chat', key: 'chat' },
            { icon: Wallet, label: language === 'hi' ? 'वॉलेट' : 'Wallet', key: 'wallet' },
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

export default CustomerDashboard;
