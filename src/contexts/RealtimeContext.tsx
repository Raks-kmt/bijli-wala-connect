
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAppData } from './AppDataContext';

interface RealtimeContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (recipientId: string, message: string) => void;
  updateJobStatus: (jobId: string, status: string) => void;
  sendNotification: (userId: string, notification: any) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const { addNotification, updateJobStatus: updateJobInContext } = useAppData();

  // Simulate WebSocket connection
  useEffect(() => {
    if (user) {
      setIsConnected(true);
      console.log('Realtime connection established for user:', user.id);
      
      // Simulate periodic updates
      const interval = setInterval(() => {
        // Simulate receiving updates
        if (Math.random() > 0.95) {
          simulateIncomingNotification();
        }
      }, 3000);

      return () => {
        clearInterval(interval);
        setIsConnected(false);
      };
    }
  }, [user]);

  const simulateIncomingNotification = () => {
    if (user) {
      const notifications = [
        {
          title: user.language === 'hi' ? 'नया अपडेट' : 'New Update',
          message: user.language === 'hi' ? 'आपके लिए नई जानकारी है' : 'There is new information for you',
          type: 'system' as const
        },
        {
          title: user.language === 'hi' ? 'जॉब अपडेट' : 'Job Update',
          message: user.language === 'hi' ? 'आपकी जॉब का स्टेटस बदला है' : 'Your job status has changed',
          type: 'job' as const
        }
      ];
      
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      addNotification({
        userId: user.id,
        ...randomNotification,
        isRead: false
      });
    }
  };

  const connect = () => {
    setIsConnected(true);
    console.log('Realtime connection established');
  };

  const disconnect = () => {
    setIsConnected(false);
    console.log('Realtime connection closed');
  };

  const sendMessage = (recipientId: string, message: string) => {
    console.log('Sending message to:', recipientId, message);
    // Simulate message delivery
    setTimeout(() => {
      addNotification({
        userId: recipientId,
        title: user?.language === 'hi' ? 'नया संदेश' : 'New Message',
        message: message.substring(0, 50) + '...',
        type: 'system',
        isRead: false
      });
    }, 1000);
  };

  const updateJobStatus = (jobId: string, status: string) => {
    console.log('Updating job status:', jobId, status);
    updateJobInContext(jobId, status as any);
    
    // Notify relevant users
    setTimeout(() => {
      addNotification({
        userId: user?.id || '',
        title: user?.language === 'hi' ? 'जॉब अपडेट' : 'Job Update',
        message: user?.language === 'hi' ? `जॉब स्टेटस: ${status}` : `Job status: ${status}`,
        type: 'job',
        isRead: false
      });
    }, 500);
  };

  const sendNotification = (userId: string, notification: any) => {
    addNotification({
      userId,
      ...notification,
      isRead: false
    });
  };

  return (
    <RealtimeContext.Provider value={{
      isConnected,
      connect,
      disconnect,
      sendMessage,
      updateJobStatus,
      sendNotification
    }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
