
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRealtime } from '../../contexts/RealtimeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Wifi, WifiOff, Loader2, Users, RefreshCw } from 'lucide-react';

const RealtimeIndicator = () => {
  const { isConnected, connectionStatus, onlineUsers, connect } = useRealtime();
  const { language } = useLanguage();

  const getStatusDisplay = () => {
    switch (connectionStatus) {
      case 'connecting':
        return {
          icon: Loader2,
          text: language === 'hi' ? 'कनेक्ट हो रहा' : 'Connecting',
          variant: 'secondary' as const,
          animate: true,
          color: 'bg-yellow-500'
        };
      case 'connected':
        return {
          icon: Wifi,
          text: language === 'hi' ? 'लाइव' : 'Live',
          variant: 'default' as const,
          animate: false,
          color: 'bg-green-500'
        };
      case 'error':
        return {
          icon: WifiOff,
          text: language === 'hi' ? 'त्रुटि' : 'Error',
          variant: 'destructive' as const,
          animate: false,
          color: 'bg-red-500'
        };
      default:
        return {
          icon: WifiOff,
          text: language === 'hi' ? 'ऑफलाइन' : 'Offline',
          variant: 'destructive' as const,
          animate: false,
          color: 'bg-gray-500'
        };
    }
  };

  const status = getStatusDisplay();
  const IconComponent = status.icon;

  const handleRetryConnection = () => {
    console.log('🔄 Manual retry connection');
    connect();
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant={status.variant}
        className="flex items-center space-x-1 px-2 py-1"
      >
        <IconComponent 
          className={`h-3 w-3 ${status.animate ? 'animate-spin' : ''}`} 
        />
        <span className="text-xs font-medium">{status.text}</span>
        {isConnected && (
          <div className={`w-2 h-2 ${status.color} rounded-full animate-pulse ml-1`}></div>
        )}
      </Badge>
      
      {/* Retry button for error or disconnected states */}
      {(connectionStatus === 'error' || connectionStatus === 'disconnected') && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleRetryConnection}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      )}
      
      {isConnected && onlineUsers && onlineUsers.length > 0 && (
        <Badge variant="outline" className="flex items-center space-x-1 px-2 py-1">
          <Users className="h-3 w-3" />
          <span className="text-xs">{onlineUsers.length}</span>
        </Badge>
      )}
    </div>
  );
};

export default RealtimeIndicator;
