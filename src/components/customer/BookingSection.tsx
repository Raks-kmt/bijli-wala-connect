
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { Clock, MapPin, Star, Phone, MessageSquare, Navigation } from 'lucide-react';

const BookingSection = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeBookings = [
    {
      id: '1',
      electrician: language === 'hi' ? 'राम कुमार' : 'Ram Kumar',
      service: language === 'hi' ? 'फैन रिपेयर' : 'Fan Repair',
      status: 'in_progress',
      date: '2024-01-15',
      time: '2:00 PM',
      amount: 450,
      phone: '+91 98765 43210',
      address: language === 'hi' ? 'सेक्टर 15, गुरुग्राम' : 'Sector 15, Gurgaon',
      estimatedCompletion: '3:30 PM'
    },
    {
      id: '2',
      electrician: language === 'hi' ? 'सुनील वर्मा' : 'Sunil Verma',
      service: language === 'hi' ? 'वायरिंग चेक' : 'Wiring Check',
      status: 'pending',
      date: '2024-01-16',
      time: '10:00 AM',
      amount: 300,
      phone: '+91 98765 43211',
      address: language === 'hi' ? 'सेक्टर 22, गुरुग्राम' : 'Sector 22, Gurgaon'
    }
  ];

  const bookingHistory = [
    {
      id: '3',
      electrician: language === 'hi' ? 'सुरेश शर्मा' : 'Suresh Sharma',
      service: language === 'hi' ? 'स्विच रिपेयर' : 'Switch Repair',
      status: 'completed',
      date: '2024-01-10',
      amount: 200,
      rating: 5,
      review: language === 'hi' ? 'बहुत अच्छी सेवा' : 'Excellent service'
    },
    {
      id: '4',
      electrician: language === 'hi' ? 'अमित कुमार' : 'Amit Kumar',
      service: language === 'hi' ? 'लाइट फिटिंग' : 'Light Fitting',
      status: 'completed',
      date: '2024-01-08',
      amount: 350,
      rating: 4,
      review: language === 'hi' ? 'समय पर आए और अच्छा काम किया' : 'Came on time and did good work'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const translations = {
      completed: language === 'hi' ? 'पूर्ण' : 'Completed',
      in_progress: language === 'hi' ? 'प्रगति में' : 'In Progress',
      pending: language === 'hi' ? 'प्रतीक्षित' : 'Pending',
      cancelled: language === 'hi' ? 'रद्द' : 'Cancelled'
    };
    return translations[status as keyof typeof translations] || status;
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleChat = (electricianId: string) => {
    console.log('Opening chat with electrician:', electricianId);
    // Here you would navigate to chat with specific electrician
  };

  const handleTrackLocation = (bookingId: string) => {
    console.log('Tracking location for booking:', bookingId);
    // Here you would open map tracking
  };

  const handleCancelBooking = (bookingId: string) => {
    console.log('Cancelling booking:', bookingId);
    // Here you would implement cancellation logic
  };

  const handleRateService = (bookingId: string) => {
    console.log('Rating service for booking:', bookingId);
    // Here you would open rating modal
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'active' ? 'default' : 'outline'}
          onClick={() => setActiveTab('active')}
          className="flex-1"
        >
          {language === 'hi' ? 'सक्रिय बुकिंग' : 'Active Bookings'}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className="flex-1"
        >
          {language === 'hi' ? 'इतिहास' : 'History'}
        </Button>
      </div>

      {activeTab === 'active' && (
        <div className="space-y-3">
          {activeBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{booking.electrician}</h3>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                    <p className="text-xs text-gray-500">{booking.address}</p>
                  </div>
                  <Badge className={`${getStatusColor(booking.status)} text-white`}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {booking.date} at {booking.time}
                    {booking.estimatedCompletion && (
                      <span className="ml-2 text-blue-600">
                        (Est: {booking.estimatedCompletion})
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">₹{booking.amount}</span>
                    <div className="flex space-x-2">
                      {booking.status === 'in_progress' && (
                        <Button size="sm" variant="outline" onClick={() => handleTrackLocation(booking.id)}>
                          <Navigation className="h-4 w-4 mr-1" />
                          {language === 'hi' ? 'ट्रैक करें' : 'Track'}
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleCall(booking.phone)}>
                        <Phone className="h-4 w-4 mr-1" />
                        {language === 'hi' ? 'कॉल' : 'Call'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleChat(booking.id)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {language === 'hi' ? 'चैट' : 'Chat'}
                      </Button>
                    </div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="destructive" onClick={() => handleCancelBooking(booking.id)} className="flex-1">
                        {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {bookingHistory.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{booking.electrician}</h3>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                  </div>
                  <Badge className={`${getStatusColor(booking.status)} text-white`}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{booking.date}</span>
                    <div className="flex items-center space-x-2">
                      {booking.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {booking.rating}
                        </div>
                      )}
                      <span className="font-semibold">₹{booking.amount}</span>
                    </div>
                  </div>
                  
                  {booking.review && (
                    <p className="text-sm text-gray-600 italic">"{booking.review}"</p>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleRateService(booking.id)} className="flex-1">
                      {language === 'hi' ? 'फिर से बुक करें' : 'Book Again'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingSection;
