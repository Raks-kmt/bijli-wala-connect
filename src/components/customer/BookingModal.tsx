
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '../../contexts/LanguageContext';
import { X, MapPin, Clock, User, Star } from 'lucide-react';

interface Electrician {
  id: string;
  name: string;
  rating: number;
  experience: number;
  distance: number;
  basePrice: number;
  image: string;
}

interface BookingModalProps {
  electrician: Electrician;
  onClose: () => void;
  onConfirm: (bookingData: any) => void;
}

const BookingModal = ({ electrician, onClose, onConfirm }: BookingModalProps) => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [address, setAddress] = useState('');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  const calculateTotal = () => {
    let total = electrician.basePrice;
    if (urgency === 'urgent') total += 100;
    if (urgency === 'emergency') total += 200;
    total += electrician.distance * 10; // ₹10 per km
    return total;
  };

  const handleConfirm = () => {
    const bookingData = {
      electricianId: electrician.id,
      electricianName: electrician.name,
      date: selectedDate,
      time: selectedTime,
      description,
      urgency,
      address,
      totalAmount: calculateTotal(),
      status: 'pending'
    };
    onConfirm(bookingData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {language === 'hi' ? 'बुकिंग करें' : 'Book Service'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Electrician Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <img src={electrician.image} alt={electrician.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <h3 className="font-semibold">{electrician.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 mr-1" />
                  {electrician.rating}
                </div>
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {electrician.experience} {language === 'hi' ? 'साल' : 'yrs'}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {electrician.distance} km
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Label>{language === 'hi' ? 'तारीख चुनें' : 'Select Date'}</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Time Selection */}
          <div>
            <Label>{language === 'hi' ? 'समय चुनें' : 'Select Time'}</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div>
            <Label>{language === 'hi' ? 'प्राथमिकता' : 'Priority'}</Label>
            <div className="flex space-x-2 mt-2">
              {[
                { key: 'normal', label: language === 'hi' ? 'सामान्य' : 'Normal', extra: 0 },
                { key: 'urgent', label: language === 'hi' ? 'तत्काल' : 'Urgent', extra: 100 },
                { key: 'emergency', label: language === 'hi' ? 'आपातकाल' : 'Emergency', extra: 200 }
              ].map((option) => (
                <Button
                  key={option.key}
                  variant={urgency === option.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUrgency(option.key as any)}
                  className="flex-1"
                >
                  <div className="text-center">
                    <div>{option.label}</div>
                    <div className="text-xs">+₹{option.extra}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <Label>{language === 'hi' ? 'पता' : 'Address'}</Label>
            <Textarea
              placeholder={language === 'hi' ? 'अपना पूरा पता दर्ज करें' : 'Enter your complete address'}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
            />
          </div>

          {/* Problem Description */}
          <div>
            <Label>{language === 'hi' ? 'समस्या का विवरण' : 'Problem Description'}</Label>
            <Textarea
              placeholder={language === 'hi' ? 'समस्या के बारे में बताएं' : 'Describe the problem'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Cost Breakdown */}
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>{language === 'hi' ? 'बेस चार्ज' : 'Base Charge'}</span>
              <span>₹{electrician.basePrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{language === 'hi' ? 'दूरी चार्ज' : 'Distance Charge'} ({electrician.distance}km)</span>
              <span>₹{electrician.distance * 10}</span>
            </div>
            {urgency !== 'normal' && (
              <div className="flex justify-between text-sm">
                <span>{language === 'hi' ? 'प्राथमिकता चार्ज' : 'Priority Charge'}</span>
                <span>₹{urgency === 'urgent' ? 100 : 200}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-semibold">
              <span>{language === 'hi' ? 'कुल राशि' : 'Total Amount'}</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1"
              disabled={!selectedDate || !selectedTime || !address.trim()}
            >
              {language === 'hi' ? 'बुक करें' : 'Book Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingModal;
