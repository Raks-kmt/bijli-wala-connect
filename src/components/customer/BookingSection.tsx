
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRealtime } from '../../contexts/RealtimeContext';
import { useAppData } from '../../contexts/AppDataContext';
import { Clock, MapPin, Star, Phone, MessageSquare, Navigation, CheckCircle } from 'lucide-react';

const BookingSection = () => {
  const { language } = useLanguage();
  const { isConnected, sendMessage } = useRealtime();
  const { jobs, updateJobStatus } = useAppData();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Filter jobs for real-time updates
  const activeBookings = jobs.filter(job => 
    job.status === 'pending' || job.status === 'accepted' || job.status === 'in_progress'
  );

  const bookingHistory = jobs.filter(job => 
    job.status === 'completed' || job.status === 'cancelled'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'accepted': return 'bg-purple-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const translations = {
      completed: language === 'hi' ? 'पूर्ण' : 'Completed',
      in_progress: language === 'hi' ? 'प्रगति में' : 'In Progress',
      accepted: language === 'hi' ? 'स्वीकार' : 'Accepted',
      pending: language === 'hi' ? 'प्रतीक्षित' : 'Pending',
      cancelled: language === 'hi' ? 'रद्द' : 'Cancelled'
    };
    return translations[status as keyof typeof translations] || status;
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleChat = (bookingId: string) => {
    console.log('Opening chat with electrician for booking:', bookingId);
    sendMessage(bookingId, language === 'hi' ? 'नमस्ते, मुझे जॉब के बारे में बात करनी है' : 'Hello, I need to discuss about the job');
  };

  const handleTrackLocation = (bookingId: string) => {
    console.log('Tracking location for booking:', bookingId);
    // Simulate real-time location tracking
    alert(language === 'hi' ? 'इलेक्ट्रीशियन आपके पास आ रहा है' : 'Electrician is on the way to you');
  };

  const handleCancelBooking = (bookingId: string) => {
    console.log('Cancelling booking:', bookingId);
    updateJobStatus(bookingId, 'cancelled');
  };

  const handleCompleteJob = (bookingId: string) => {
    console.log('Completing job:', bookingId);
    updateJobStatus(bookingId, 'completed');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Real-time Connection Status */}
      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {isConnected 
              ? (language === 'hi' ? 'रियल-टाइम अपडेट चालू' : 'Real-time Updates Active')
              : (language === 'hi' ? 'कनेक्शन नहीं' : 'Not Connected')
            }
          </span>
        </div>
        <Badge variant="outline" className="text-xs">
          {language === 'hi' ? 'लाइव' : 'LIVE'}
        </Badge>
      </div>

      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'active' ? 'default' : 'outline'}
          onClick={() => setActiveTab('active')}
          className="flex-1"
        >
          {language === 'hi' ? 'सक्रिय बुकिंग' : 'Active Bookings'}
          {activeBookings.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeBookings.length}
            </Badge>
          )}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className="flex-1"
        >
          {language === 'hi' ? 'इतिहास' : 'History'}
          {bookingHistory.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {bookingHistory.length}
            </Badge>
          )}
        </Button>
      </div>

      {activeTab === 'active' && (
        <div className="space-y-3">
          {activeBookings.map((booking) => (
            <Card key={booking.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{booking.description}</h3>
                    <p className="text-sm text-gray-600">{booking.address}</p>
                    {booking.isEmergency && (
                      <Badge variant="destructive" className="mt-1">
                        {language === 'hi' ? 'आपातकाल' : 'Emergency'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`${getStatusColor(booking.status)} text-white`}>
                      {getStatusText(booking.status)}
                    </Badge>
                    {isConnected && (
                      <div className="flex items-center text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                        {language === 'hi' ? 'लाइव अपडेट' : 'Live Updates'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {booking.scheduledDate}
                    {booking.status === 'in_progress' && (
                      <span className="ml-2 text-blue-600 font-medium">
                        {language === 'hi' ? '(काम चल रहा है)' : '(Work in Progress)'}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">₹{booking.totalPrice}</span>
                    <div className="flex space-x-2">
                      {booking.status === 'in_progress' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleTrackLocation(booking.id)}>
                            <Navigation className="h-4 w-4 mr-1" />
                            {language === 'hi' ? 'ट्रैक करें' : 'Track'}
                          </Button>
                          <Button size="sm" variant="default" onClick={() => handleCompleteJob(booking.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {language === 'hi' ? 'पूरा करें' : 'Complete'}
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleCall('9876543210')}>
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

                  {booking.status === 'accepted' && (
                    <div className="bg-green-50 p-2 rounded text-sm text-green-700">
                      {language === 'hi' ? '✅ इलेक्ट्रीशियन आपकी जॉब स्वीकार कर चुका है' : '✅ Electrician has accepted your job'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {activeBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>{language === 'hi' ? 'कोई सक्रिय बुकिंग नहीं' : 'No active bookings'}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {bookingHistory.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{booking.description}</h3>
                    <p className="text-sm text-gray-600">{booking.address}</p>
                  </div>
                  <Badge className={`${getStatusColor(booking.status)} text-white`}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{booking.scheduledDate}</span>
                    <div className="flex items-center space-x-2">
                      {booking.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {booking.rating}
                        </div>
                      )}
                      <span className="font-semibold">₹{booking.totalPrice}</span>
                    </div>
                  </div>
                  
                  {booking.review && (
                    <p className="text-sm text-gray-600 italic">"{booking.review}"</p>
                  )}
                  
                  {booking.status === 'completed' && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        {language === 'hi' ? 'फिर से बुक करें' : 'Book Again'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {bookingHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>{language === 'hi' ? 'कोई पुराना बुकिंग नहीं' : 'No booking history'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingSection;
