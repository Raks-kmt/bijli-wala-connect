
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useRealtime } from '../../contexts/RealtimeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Wifi, WifiOff } from 'lucide-react';

const RealtimeIndicator = () => {
  const { isConnected } = useRealtime();
  const { language } = useLanguage();

  return (
    <Badge 
      variant={isConnected ? "default" : "destructive"}
      className="flex items-center space-x-1"
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>{language === 'hi' ? 'लाइव' : 'Live'}</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>{language === 'hi' ? 'ऑफलाइन' : 'Offline'}</span>
        </>
      )}
    </Badge>
  );
};

export default RealtimeIndicator;
