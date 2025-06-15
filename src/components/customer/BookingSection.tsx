
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { Clock, MapPin, Star, Phone, MessageSquare } from 'lucide-react';

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
      phone: '+91 98765 43210'
    }
  ];

  const bookingHistory = [
    {
      id: '2',
      electrician: language === 'hi' ? 'सुरेश शर्मा' : 'Suresh Sharma',
      service: language === 'hi' ? 'वायरिंग' : 'Wiring',
      status: 'completed',
      date: '2024-01-10',
      amount: 800,
      rating: 5
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const translations = {
      completed: language === 'hi' ? 'पूर्ण' : 'Completed',
      in_progress: language === 'hi' ? 'प्रगति में' : 'In Progress',
      pending: language === 'hi' ? 'प्रतीक्षित' : 'Pending'
    };
    return translations[status as keyof typeof translations] || status;
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
                  </div>
                  <Badge className={`${getStatusColor(booking.status)} text-white`}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {booking.date} at {booking.time}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">₹{booking.amount}</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        {language === 'hi' ? 'कॉल' : 'Call'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {language === 'hi' ? 'चैट' : 'Chat'}
                      </Button>
                    </div>
                  </div>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingSection;
