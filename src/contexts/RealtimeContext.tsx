
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useAppData } from './AppDataContext';

interface RealtimeContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (recipientId: string, message: string) => void;
  updateJobStatus: (jobId: string, status: string) => void;
  sendNotification: (userId: string, notification: any) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  onlineUsers: string[];
  broadcastToAll: (message: string, title: string) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useAuth();
  const { addNotification, updateJobStatus: updateJobInContext, jobs, electricians } = useAppData();
  const connectionTimeoutRef = useRef<NodeJS.Timeout>();
  const updateIntervalRef = useRef<NodeJS.Timeout>();
  const isConnectingRef = useRef(false);

  // Fixed connection function with proper timeout handling
  const establishConnection = useCallback(() => {
    if (!user || isConnectingRef.current) return;

    console.log('🔄 Establishing realtime connection for user:', user.id, user.role);
    isConnectingRef.current = true;
    setConnectionStatus('connecting');
    
    // Clear any existing timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }

    // Shorter timeout to prevent hanging
    connectionTimeoutRef.current = setTimeout(() => {
      try {
        setIsConnected(true);
        setConnectionStatus('connected');
        isConnectingRef.current = false;
        
        // Add user to online users list
        setOnlineUsers(prev => {
          const filtered = prev.filter(id => id !== user.id);
          return [...filtered, user.id];
        });
        
        console.log('✅ Realtime connection established for user:', user.id, user.role);
        
        // Welcome notification
        const welcomeMessages = {
          admin: { 
            hi: 'एडमिन पैनल कनेक्ट हो गया', 
            en: 'Admin Panel Connected' 
          },
          customer: { 
            hi: 'कस्टमर पैनल कनेक्ट हो गया', 
            en: 'Customer Panel Connected' 
          },
          electrician: { 
            hi: 'इलेक्ट्रीशियन पैनल कनेक्ट हो गया', 
            en: 'Electrician Panel Connected' 
          }
        };

        const message = welcomeMessages[user.role as keyof typeof welcomeMessages];
        if (message) {
          addNotification({
            userId: user.id,
            title: user.language === 'hi' ? '🟢 कनेक्टेड' : '🟢 Connected',
            message: user.language === 'hi' ? message.hi : message.en,
            type: 'system',
            isRead: false
          });
        }
      } catch (error) {
        console.error('❌ Connection failed:', error);
        setConnectionStatus('error');
        isConnectingRef.current = false;
        
        // Retry after error
        setTimeout(() => {
          if (user && !isConnected) {
            establishConnection();
          }
        }, 3000);
      }
    }, 800); // Reduced timeout
  }, [user, addNotification, isConnected]);

  // Simplified realtime updates
  useEffect(() => {
    if (!isConnected || !user) return;

    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    updateIntervalRef.current = setInterval(() => {
      const eventChance = Math.random();
      
      // Simplified random updates
      if (eventChance > 0.9) {
        simulateUpdate();
      }
    }, 5000); // Less frequent updates

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isConnected, user]);

  const simulateUpdate = useCallback(() => {
    if (!user) return;

    const updates = {
      admin: [
        {
          title: user.language === 'hi' ? '📊 सिस्टम अपडेट' : '📊 System Update',
          message: user.language === 'hi' ? 'सभी सिस्टम सामान्य चल रहे हैं' : 'All systems running normally',
          type: 'system' as const
        }
      ],
      customer: [
        {
          title: user.language === 'hi' ? '🔍 नई सेवाएं' : '🔍 New Services',
          message: user.language === 'hi' ? 'आपके क्षेत्र में नई सेवाएं उपलब्ध हैं' : 'New services available in your area',
          type: 'system' as const
        }
      ],
      electrician: [
        {
          title: user.language === 'hi' ? '🚨 नया अवसर' : '🚨 New Opportunity',
          message: user.language === 'hi' ? 'आपके लिए नया काम उपलब्ध हो सकता है' : 'New work might be available for you',
          type: 'system' as const
        }
      ]
    };
    
    const roleUpdates = updates[user.role as keyof typeof updates];
    if (roleUpdates && roleUpdates.length > 0) {
      const randomUpdate = roleUpdates[Math.floor(Math.random() * roleUpdates.length)];
      console.log('📲 Sending update:', randomUpdate.title);
      
      addNotification({
        userId: user.id,
        ...randomUpdate,
        isRead: false
      });
    }
  }, [user, addNotification]);

  const broadcastToAll = useCallback((message: string, title: string) => {
    if (!isConnected) return;

    console.log('📢 Broadcasting:', title, message);
    
    onlineUsers.forEach(userId => {
      if (userId !== user?.id) {
        addNotification({
          userId,
          title,
          message,
          type: 'broadcast',
          isRead: false
        });
      }
    });
  }, [isConnected, user, onlineUsers, addNotification]);

  const connect = useCallback(() => {
    if (!isConnected && !isConnectingRef.current) {
      console.log('🔗 Manual connection requested');
      establishConnection();
    }
  }, [isConnected, establishConnection]);

  const disconnect = useCallback(() => {
    console.log('❌ Disconnecting');
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setOnlineUsers(prev => prev.filter(id => id !== user?.id));
    isConnectingRef.current = false;
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }
  }, [user?.id]);

  const sendMessage = useCallback((recipientId: string, message: string) => {
    if (!isConnected) {
      console.warn('⚠️ Cannot send message - not connected');
      return;
    }

    console.log('💬 Message sent to:', recipientId);
    
    setTimeout(() => {
      addNotification({
        userId: recipientId,
        title: user?.language === 'hi' ? '💬 नया संदेश' : '💬 New Message',
        message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        type: 'chat',
        isRead: false
      });
    }, 500);
  }, [isConnected, user, addNotification]);

  const updateJobStatus = useCallback((jobId: string, status: string) => {
    if (!isConnected) return;

    console.log('🔄 Job status update:', jobId, '->', status);
    updateJobInContext(jobId, status as any);
    
    if (user) {
      addNotification({
        userId: user.id,
        title: user.language === 'hi' ? '⚡ जॉब अपडेट' : '⚡ Job Update',
        message: `${user.language === 'hi' ? 'जॉब स्टेटस:' : 'Job status:'} ${status}`,
        type: 'job',
        isRead: false
      });
    }
  }, [isConnected, user, updateJobInContext, addNotification]);

  const sendNotification = useCallback((userId: string, notification: any) => {
    if (!isConnected) return;

    console.log('🔔 Notification sent to:', userId);
    addNotification({
      userId,
      ...notification,
      isRead: false
    });
  }, [isConnected, addNotification]);

  // Auto-connect when user is available
  useEffect(() => {
    if (user && !isConnected && connectionStatus === 'disconnected' && !isConnectingRef.current) {
      // Small delay to prevent immediate connection attempts
      const timer = setTimeout(() => {
        establishConnection();
      }, 500);
      
      return () => clearTimeout(timer);
    }

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [user, isConnected, connectionStatus, establishConnection]);

  // Reset connection state on user change
  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setOnlineUsers([]);
      isConnectingRef.current = false;
    }
  }, [user]);

  return (
    <RealtimeContext.Provider value={{
      isConnected,
      connect,
      disconnect,
      sendMessage,
      updateJobStatus,
      sendNotification,
      connectionStatus,
      onlineUsers,
      broadcastToAll
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
