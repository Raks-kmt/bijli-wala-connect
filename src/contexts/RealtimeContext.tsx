
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const { addNotification, updateJobStatus: updateJobInContext, jobs } = useAppData();

  // Enhanced connection simulation with proper lifecycle
  const simulateConnection = useCallback(() => {
    if (!user) return;

    console.log('🔄 Establishing realtime connection for user:', user.id);
    setConnectionStatus('connecting');
    
    // Simulate connection delay
    const connectionTimeout = setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      console.log('✅ Realtime connection established for user:', user.id);
      
      // Send welcome notification
      addNotification({
        userId: user.id,
        title: user.language === 'hi' ? 'कनेक्शन स्थापित' : 'Connected',
        message: user.language === 'hi' ? 'रियल-टाइम अपडेट सक्रिय' : 'Real-time updates active',
        type: 'system',
        isRead: false
      });
    }, 1500);

    return () => {
      clearTimeout(connectionTimeout);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      console.log('❌ Realtime connection closed');
    };
  }, [user, addNotification]);

  // Connection management
  useEffect(() => {
    if (user) {
      const cleanup = simulateConnection();
      return cleanup;
    } else {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    }
  }, [user, simulateConnection]);

  // Simulate periodic real-time updates
  useEffect(() => {
    if (!isConnected || !user) return;

    const interval = setInterval(() => {
      // Simulate random real-time events
      const eventChance = Math.random();
      
      if (eventChance > 0.97) {
        simulateRandomUpdate();
      }
      
      // Simulate job status changes for active jobs
      if (eventChance > 0.95) {
        simulateJobUpdate();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected, user, jobs]);

  const simulateRandomUpdate = useCallback(() => {
    if (!user) return;

    const updates = [
      {
        title: user.language === 'hi' ? 'नया इलेक्ट्रीशियन ऑनलाइन' : 'New Electrician Online',
        message: user.language === 'hi' ? 'आपके क्षेत्र में नया इलेक्ट्रीशियन उपलब्ध है' : 'New electrician available in your area',
        type: 'system' as const
      },
      {
        title: user.language === 'hi' ? 'विशेष छूट' : 'Special Discount',
        message: user.language === 'hi' ? '20% छूट सभी सेवाओं पर' : '20% off on all services',
        type: 'promotion' as const
      }
    ];
    
    const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
    console.log('📲 Sending real-time notification:', randomUpdate.title);
    
    addNotification({
      userId: user.id,
      ...randomUpdate,
      isRead: false
    });
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
      const statusUpdates = {
        'pending': 'accepted',
        'accepted': 'in_progress',
        'in_progress': 'completed'
      };
      
      const newStatus = statusUpdates[randomJob.status as keyof typeof statusUpdates];
      if (newStatus) {
        console.log('🔄 Simulating job status update:', randomJob.id, '->', newStatus);
        updateJobInContext(randomJob.id, newStatus as any);
        
        addNotification({
          userId: user.id,
          title: user.language === 'hi' ? 'जॉब अपडेट' : 'Job Update',
          message: user.language === 'hi' ? `जॉब स्टेटस: ${newStatus}` : `Job status: ${newStatus}`,
          type: 'job',
          isRead: false
        });
      }
    }
  }, [user, jobs, updateJobInContext, addNotification]);

  const connect = useCallback(() => {
    console.log('🔗 Manual connection requested');
    setConnectionStatus('connecting');
    setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      console.log('✅ Manual connection established');
    }, 1000);
  }, []);

  const disconnect = useCallback(() => {
    console.log('❌ Manual disconnection requested');
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((recipientId: string, message: string) => {
    if (!isConnected) {
      console.warn('⚠️ Cannot send message - not connected');
      return;
    }

    console.log('💬 Sending real-time message to:', recipientId, message);
    
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
    }, Math.random() * 2000 + 500); // 0.5-2.5 second delay
  }, [isConnected, user, addNotification]);

  const updateJobStatus = useCallback((jobId: string, status: string) => {
    if (!isConnected) {
      console.warn('⚠️ Cannot update job status - not connected');
      return;
    }

    console.log('🔄 Real-time job status update:', jobId, '->', status);
    updateJobInContext(jobId, status as any);
    
    // Notify relevant users with delay simulation
    setTimeout(() => {
      if (user) {
        addNotification({
          userId: user.id,
          title: user.language === 'hi' ? 'जॉब अपडेट' : 'Job Update',
          message: user.language === 'hi' ? `जॉब स्टेटस अपडेट: ${status}` : `Job status updated: ${status}`,
          type: 'job',
          isRead: false
        });
      }
      console.log('✅ Job status notification sent');
    }, 500);
  }, [isConnected, user, updateJobInContext, addNotification]);

  const sendNotification = useCallback((userId: string, notification: any) => {
    if (!isConnected) {
      console.warn('⚠️ Cannot send notification - not connected');
      return;
    }

    console.log('🔔 Sending real-time notification to:', userId, notification);
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
      hasJobs: jobs.length > 0
    });
  }, [isConnected, connectionStatus, user?.id, jobs.length]);

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
