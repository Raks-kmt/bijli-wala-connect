
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
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const { user } = useAuth();
  const { addNotification, updateJobStatus: updateJobInContext, jobs, electricians } = useAppData();
  const connectionTimeoutRef = useRef<NodeJS.Timeout>();
  const updateIntervalRef = useRef<NodeJS.Timeout>();
  const isConnectingRef = useRef(false);

  // Stable connection function
  const establishConnection = useCallback(() => {
    if (!user || isConnectingRef.current) return;

    console.log('🔄 Establishing realtime connection for user:', user.id, user.role);
    isConnectingRef.current = true;
    setConnectionStatus('connecting');
    
    // Clear any existing timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }

    connectionTimeoutRef.current = setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      isConnectingRef.current = false;
      console.log('✅ Realtime connection established for user:', user.id, user.role);
      
      // Send welcome notification based on role
      const welcomeMessages = {
        admin: { 
          hi: 'एडमिन पैनल में आपका स्वागत है', 
          en: 'Welcome to Admin Panel' 
        },
        customer: { 
          hi: 'कस्टमर पैनल में आपका स्वागत है', 
          en: 'Welcome to Customer Panel' 
        },
        electrician: { 
          hi: 'इलेक्ट्रीशियन पैनल में आपका स्वागत है', 
          en: 'Welcome to Electrician Panel' 
        }
      };

      const message = welcomeMessages[user.role as keyof typeof welcomeMessages];
      if (message) {
        addNotification({
          userId: user.id,
          title: user.language === 'hi' ? 'कनेक्शन स्थापित' : 'Connected',
          message: user.language === 'hi' ? message.hi : message.en,
          type: 'system',
          isRead: false
        });
      }
    }, 1500);
  }, [user, addNotification]);

  // Connection management
  useEffect(() => {
    if (user && !isConnected && connectionStatus === 'disconnected') {
      establishConnection();
    }

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      isConnectingRef.current = false;
    };
  }, [user, isConnected, connectionStatus, establishConnection]);

  // Real-time simulation for cross-panel updates
  useEffect(() => {
    if (!isConnected || !user) return;

    // Clear existing interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    updateIntervalRef.current = setInterval(() => {
      const eventChance = Math.random();
      
      // Simulate cross-panel real-time events
      if (eventChance > 0.98) {
        simulateCrossPanelUpdate();
      }
      
      // Simulate job status changes
      if (eventChance > 0.96) {
        simulateJobUpdate();
      }

      // Simulate new electrician registrations (for admin)
      if (eventChance > 0.99 && user.role === 'admin') {
        simulateNewElectricianRegistration();
      }
    }, 5000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isConnected, user, jobs]);

  const simulateCrossPanelUpdate = useCallback(() => {
    if (!user) return;

    const updates = {
      admin: [
        {
          title: user.language === 'hi' ? 'नया यूजर रजिस्टर' : 'New User Registered',
          message: user.language === 'hi' ? 'एक नया कस्टमर रजिस्टर हुआ है' : 'A new customer has registered',
          type: 'system' as const
        },
        {
          title: user.language === 'hi' ? 'रेवेन्यू अपडेट' : 'Revenue Update',
          message: user.language === 'hi' ? 'आज का रेवेन्यू ₹15,000 है' : 'Today\'s revenue is ₹15,000',
          type: 'system' as const
        }
      ],
      customer: [
        {
          title: user.language === 'hi' ? 'नया इलेक्ट्रीशियन' : 'New Electrician',
          message: user.language === 'hi' ? 'आपके क्षेत्र में नया इलेक्ट्रीशियन उपलब्ध' : 'New electrician available in your area',
          type: 'system' as const
        },
        {
          title: user.language === 'hi' ? 'विशेष ऑफर' : 'Special Offer',
          message: user.language === 'hi' ? '20% छूट सभी सेवाओं पर' : '20% off on all services',
          type: 'promotion' as const
        }
      ],
      electrician: [
        {
          title: user.language === 'hi' ? 'नई जॉब उपलब्ध' : 'New Job Available',
          message: user.language === 'hi' ? 'आपके क्षेत्र में नई जॉब आई है' : 'New job available in your area',
          type: 'job' as const
        },
        {
          title: user.language === 'hi' ? 'पेमेंट रिसीव' : 'Payment Received',
          message: user.language === 'hi' ? '₹450 का पेमेंट मिला' : 'Payment of ₹450 received',
          type: 'payment' as const
        }
      ]
    };
    
    const roleUpdates = updates[user.role as keyof typeof updates];
    if (roleUpdates) {
      const randomUpdate = roleUpdates[Math.floor(Math.random() * roleUpdates.length)];
      console.log('📲 Cross-panel real-time notification:', randomUpdate.title, 'for', user.role);
      
      addNotification({
        userId: user.id,
        ...randomUpdate,
        isRead: false
      });
    }
  }, [user, addNotification]);

  const simulateJobUpdate = useCallback(() => {
    if (!user || !jobs.length) return;

    const userJobs = jobs.filter(job => 
      job.customerId === user.id || job.electricianId === user.id
    );
    
    const activeJobs = userJobs.filter(job => 
      job.status === 'pending' || job.status === 'accepted' || job.status === 'in_progress'
    );

    if (activeJobs.length > 0) {
      const randomJob = activeJobs[Math.floor(Math.random() * activeJobs.length)];
      const statusProgression = {
        'pending': 'accepted',
        'accepted': 'in_progress',
        'in_progress': 'completed'
      };
      
      const newStatus = statusProgression[randomJob.status as keyof typeof statusProgression];
      if (newStatus) {
        console.log('🔄 Real-time job status update:', randomJob.id, '->', newStatus, 'for', user.role);
        updateJobInContext(randomJob.id, newStatus as any);
        
        // Notify both customer and electrician
        const statusTexts = {
          accepted: user.language === 'hi' ? 'स्वीकार कर लिया गया' : 'Accepted',
          in_progress: user.language === 'hi' ? 'काम शुरू हो गया' : 'Work Started',
          completed: user.language === 'hi' ? 'काम पूरा हो गया' : 'Work Completed'
        };

        addNotification({
          userId: user.id,
          title: user.language === 'hi' ? 'जॉब अपडेट' : 'Job Update',
          message: `${user.language === 'hi' ? 'जॉब स्टेटस:' : 'Job status:'} ${statusTexts[newStatus as keyof typeof statusTexts]}`,
          type: 'job',
          isRead: false
        });
      }
    }
  }, [user, jobs, updateJobInContext, addNotification]);

  const simulateNewElectricianRegistration = useCallback(() => {
    if (user?.role !== 'admin') return;

    console.log('👷 Simulating new electrician registration for admin');
    addNotification({
      userId: user.id,
      title: user.language === 'hi' ? 'नया इलेक्ट्रीशियन' : 'New Electrician',
      message: user.language === 'hi' ? 'नया इलेक्ट्रीशियन रजिस्ट्रेशन के लिए प्रतीक्षा में' : 'New electrician waiting for approval',
      type: 'system',
      isRead: false
    });
  }, [user, addNotification]);

  const connect = useCallback(() => {
    if (!isConnected) {
      console.log('🔗 Manual connection requested');
      establishConnection();
    }
  }, [isConnected, establishConnection]);

  const disconnect = useCallback(() => {
    console.log('❌ Manual disconnection requested');
    setIsConnected(false);
    setConnectionStatus('disconnected');
    isConnectingRef.current = false;
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }
  }, []);

  const sendMessage = useCallback((recipientId: string, message: string) => {
    if (!isConnected) {
      console.warn('⚠️ Cannot send message - not connected');
      return;
    }

    console.log('💬 Real-time message sent to:', recipientId, message);
    
    // Simulate message delivery with network delay
    setTimeout(() => {
      addNotification({
        userId: recipientId,
        title: user?.language === 'hi' ? 'नया संदेश' : 'New Message',
        message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        type: 'system',
        isRead: false
      });
      
      console.log('✅ Message delivered to:', recipientId);
    }, Math.random() * 2000 + 500);
  }, [isConnected, user, addNotification]);

  const updateJobStatus = useCallback((jobId: string, status: string) => {
    if (!isConnected) {
      console.warn('⚠️ Cannot update job status - not connected');
      return;
    }

    console.log('🔄 Real-time job status update initiated:', jobId, '->', status);
    updateJobInContext(jobId, status as any);
    
    // Broadcast to all relevant users
    setTimeout(() => {
      if (user) {
        addNotification({
          userId: user.id,
          title: user.language === 'hi' ? 'जॉब अपडेट' : 'Job Update',
          message: `${user.language === 'hi' ? 'जॉब स्टेटस अपडेट:' : 'Job status updated:'} ${status}`,
          type: 'job',
          isRead: false
        });
      }
      console.log('✅ Job status update broadcasted');
    }, 500);
  }, [isConnected, user, updateJobInContext, addNotification]);

  const sendNotification = useCallback((userId: string, notification: any) => {
    if (!isConnected) {
      console.warn('⚠️ Cannot send notification - not connected');
      return;
    }

    console.log('🔔 Real-time notification sent to:', userId, notification);
    addNotification({
      userId,
      ...notification,
      isRead: false
    });
  }, [isConnected, addNotification]);

  // Debug logging
  useEffect(() => {
    console.log('🔗 Realtime Context State:', {
      isConnected,
      connectionStatus,
      userId: user?.id,
      userRole: user?.role,
      hasJobs: jobs.length > 0,
      isConnectingRef: isConnectingRef.current
    });
  }, [isConnected, connectionStatus, user?.id, user?.role, jobs.length]);

  return (
    <RealtimeContext.Provider value={{
      isConnected,
      connect,
      disconnect,
      sendMessage,
      updateJobStatus,
      sendNotification,
      connectionStatus
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
