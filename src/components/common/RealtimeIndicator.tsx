
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useRealtime } from '../../contexts/RealtimeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

const RealtimeIndicator = () => {
  const { isConnected, connectionStatus } = useRealtime();
  const { language } = useLanguage();

  const getStatusDisplay = () => {
    switch (connectionStatus) {
      case 'connecting':
        return {
          icon: Loader2,
          text: language === 'hi' ? 'कनेक्ट हो रहा' : 'Connecting',
          variant: 'secondary' as const,
          animate: true
        };
      case 'connected':
        return {
          icon: Wifi,
          text: language === 'hi' ? 'लाइव' : 'Live',
          variant: 'default' as const,
          animate: false
        };
      case 'error':
        return {
          icon: WifiOff,
          text: language === 'hi' ? 'त्रुटि' : 'Error',
          variant: 'destructive' as const,
          animate: false
        };
      default:
        return {
          icon: WifiOff,
          text: language === 'hi' ? 'ऑफलाइन' : 'Offline',
          variant: 'destructive' as const,
          animate: false
        };
    }
  };

  const status = getStatusDisplay();
  const IconComponent = status.icon;

  return (
    <Badge 
      variant={status.variant}
      className="flex items-center space-x-1"
    >
      <IconComponent 
        className={`h-3 w-3 ${status.animate ? 'animate-spin' : ''}`} 
      />
      <span>{status.text}</span>
      {isConnected && (
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1"></div>
      )}
    </Badge>
  );
};

export default RealtimeIndicator;
