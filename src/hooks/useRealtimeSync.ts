import { useEffect, useState } from 'react';

interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: number;
}

export const useRealtimeSync = () => {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [updateCount, setUpdateCount] = useState<number>(0);

  useEffect(() => {
    const handleUpdate = (event: CustomEvent<RealtimeEvent>) => {
      const { type, data, timestamp } = event.detail;
      console.log(`🔄 Real-time sync received: ${type}`, data);
      
      setLastUpdate(timestamp);
      setUpdateCount(prev => prev + 1);
      
      // Optional: You can add specific type handlers here
      switch (type) {
        case 'USER_ADDED':
          console.log('👤 New user added:', data.name);
          break;
        case 'JOB_CREATED':
          console.log('💼 New job created:', data.description);
          break;
        case 'ELECTRICIAN_APPROVED':
          console.log('⚡ Electrician approved:', data.name);
          break;
        case 'NOTIFICATION_ADDED':
          console.log('🔔 New notification:', data.title);
          break;
        default:
          console.log(`📡 Update received: ${type}`);
      }
    };

    const handleForceUpdate = () => {
      setLastUpdate(Date.now());
      setUpdateCount(prev => prev + 1);
    };

    window.addEventListener('appDataUpdate', handleUpdate);
    window.addEventListener('forceUpdate', handleForceUpdate);

    return () => {
      window.removeEventListener('appDataUpdate', handleUpdate);
      window.removeEventListener('forceUpdate', handleForceUpdate);
    };
  }, []);

  return {
    lastUpdate,
    updateCount,
    isLive: true
  };
};