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

  // Enhanced connection function with better realtime simulation
  const establishConnection = useCallback(() => {
    if (!user || isConnectingRef.current) return;

    console.log('🔄 Establishing enhanced realtime connection for user:', user.id, user.role);
    isConnectingRef.current = true;
    setConnectionStatus('connecting');
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }

    connectionTimeoutRef.current = setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      isConnectingRef.current = false;
      
      // Add user to online users list
      setOnlineUsers(prev => [...prev.filter(id => id !== user.id), user.id]);
      
      console.log('✅ Enhanced realtime connection established for user:', user.id, user.role);
      
      // Enhanced welcome notification
      const welcomeMessages = {
        admin: { 
          hi: 'एडमिन पैनल रियल-टाइम कनेक्टेड - सभी डेटा लाइव अपडेट होगा', 
          en: 'Admin Panel Real-time Connected - All data will update live' 
        },
        customer: { 
          hi: 'कस्टमर पैनल रियल-टाइम कनेक्टेड - इलेक्ट्रीशियन लाइव ट्रैक करें', 
          en: 'Customer Panel Real-time Connected - Track electricians live' 
        },
        electrician: { 
          hi: 'इलेक्ट्रीशियन पैनल रियल-टाइम कनेक्टेड - नई जॉब्स तुरंत मिलेंगी', 
          en: 'Electrician Panel Real-time Connected - Get jobs instantly' 
        }
      };

      const message = welcomeMessages[user.role as keyof typeof welcomeMessages];
      if (message) {
        addNotification({
          userId: user.id,
          title: user.language === 'hi' ? '🟢 रियल-टाइम कनेक्टेड' : '🟢 Real-time Connected',
          message: user.language === 'hi' ? message.hi : message.en,
          type: 'system',
          isRead: false
        });
      }
    }, 1200);
  }, [user, addNotification]);

  // Enhanced realtime simulation with better cross-panel updates
  useEffect(() => {
    if (!isConnected || !user) return;

    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    updateIntervalRef.current = setInterval(() => {
      const eventChance = Math.random();
      
      // More frequent cross-panel updates
      if (eventChance > 0.85) {
        simulateEnhancedCrossPanelUpdate();
      }
      
      // Enhanced job status changes
      if (eventChance > 0.90) {
        simulateEnhancedJobUpdate();
      }

      // Simulate real-time electrician availability updates
      if (eventChance > 0.95) {
        simulateElectricianAvailabilityUpdate();
      }

      // Simulate real-time earnings updates for electricians
      if (eventChance > 0.92 && user.role === 'electrician') {
        simulateEarningsUpdate();
      }

      // Simulate customer booking notifications for admin
      if (eventChance > 0.88 && user.role === 'admin') {
        simulateAdminBookingAlert();
      }
    }, 3000); // More frequent updates

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isConnected, user, jobs]);

  const simulateEnhancedCrossPanelUpdate = useCallback(() => {
    if (!user) return;

    const enhancedUpdates = {
      admin: [
        {
          title: user.language === 'hi' ? '📊 लाइव डेटा अपडेट' : '📊 Live Data Update',
          message: user.language === 'hi' ? 'नए 3 कस्टमर ऑनलाइन आए' : '3 new customers came online',
          type: 'system' as const
        },
        {
          title: user.language === 'hi' ? '💰 रेवेन्यू अलर्ट' : '💰 Revenue Alert',
          message: user.language === 'hi' ? 'आज ₹25,000 कमाई हुई' : 'Earned ₹25,000 today',
          type: 'system' as const
        },
        {
          title: user.language === 'hi' ? '⚡ सिस्टम स्टेटस' : '⚡ System Status',
          message: user.language === 'hi' ? '12 इलेक्ट्रीशियन एक्टिव हैं' : '12 electricians are active',
          type: 'system' as const
        }
      ],
      customer: [
        {
          title: user.language === 'hi' ? '🔍 नए इलेक्ट्रीशियन' : '🔍 New Electricians',
          message: user.language === 'hi' ? 'आपके 2 KM के दायरे में 5 नए इलेक्ट्रीशियन' : '5 new electricians within 2 KM',
          type: 'system' as const
        },
        {
          title: user.language === 'hi' ? '🎯 स्पेशल ऑफर' : '🎯 Special Offer',
          message: user.language === 'hi' ? 'आज 30% छूट - तुरंत बुक करें' : '30% off today - Book now',
          type: 'promotion' as const
        },
        {
          title: user.language === 'hi' ? '⭐ रेटिंग अपडेट' : '⭐ Rating Update',
          message: user.language === 'hi' ? 'आपके पिछले इलेक्ट्रीशियन को 5 स्टार दिया गया' : 'Your last electrician got 5 stars',
          type: 'system' as const
        }
      ],
      electrician: [
        {
          title: user.language === 'hi' ? '🚨 नई जॉब अलर्ट' : '🚨 New Job Alert',
          message: user.language === 'hi' ? 'आपके 1 KM के दायरे में अर्जेंट जॉब' : 'Urgent job within 1 KM',
          type: 'job' as const
        },
        {
          title: user.language === 'hi' ? '💸 पेमेंट अलर्ट' : '💸 Payment Alert',
          message: user.language === 'hi' ? '₹750 तुरंत अकाउंट में आया' : '₹750 credited instantly',
          type: 'payment' as const
        },
        {
          title: user.language === 'hi' ? '🏆 परफॉर्मेंस बोनस' : '🏆 Performance Bonus',
          message: user.language === 'hi' ? 'आज 5 जॉब पूरी करने पर ₹200 बोनस' : '₹200 bonus for completing 5 jobs today',
          type: 'bonus' as const
        }
      ]
    };
    
    const roleUpdates = enhancedUpdates[user.role as keyof typeof enhancedUpdates];
    if (roleUpdates) {
      const randomUpdate = roleUpdates[Math.floor(Math.random() * roleUpdates.length)];
      console.log('📲 Enhanced cross-panel notification:', randomUpdate.title, 'for', user.role);
      
      addNotification({
        userId: user.id,
        ...randomUpdate,
        isRead: false
      });
    }
  }, [user, addNotification]);

  const simulateEnhancedJobUpdate = useCallback(() => {
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
        console.log('🔄 Enhanced job status update:', randomJob.id, '->', newStatus, 'for', user.role);
        updateJobInContext(randomJob.id, newStatus as any);
        
        const statusTexts = {
          accepted: user.language === 'hi' ? '✅ इलेक्ट्रीशियन ने स्वीकार किया' : '✅ Electrician accepted',
          in_progress: user.language === 'hi' ? '🔧 काम शुरू हो गया' : '🔧 Work started',
          completed: user.language === 'hi' ? '🎉 काम पूरा हो गया' : '🎉 Work completed'
        };

        addNotification({
          userId: user.id,
          title: user.language === 'hi' ? '⚡ जॉब अपडेट' : '⚡ Job Update',
          message: statusTexts[newStatus as keyof typeof statusTexts],
          type: 'job',
          isRead: false
        });
      }
    }
  }, [user, jobs, updateJobInContext, addNotification]);

  const simulateElectricianAvailabilityUpdate = useCallback(() => {
    if (user?.role !== 'customer') return;

    addNotification({
      userId: user.id,
      title: user.language === 'hi' ? '👷 इलेक्ट्रीशियन अपडेट' : '👷 Electrician Update',
      message: user.language === 'hi' ? 'राम कुमार अब ऑनलाइन है और बुकिंग के लिए उपलब्ध' : 'Ram Kumar is now online and available for booking',
      type: 'system',
      isRead: false
    });
  }, [user, addNotification]);

  const simulateEarningsUpdate = useCallback(() => {
    if (user?.role !== 'electrician') return;

    const earnings = [150, 200, 350, 500, 750];
    const randomEarning = earnings[Math.floor(Math.random() * earnings.length)];

    addNotification({
      userId: user.id,
      title: user.language === 'hi' ? '💰 नई कमाई' : '💰 New Earnings',
      message: user.language === 'hi' ? `आपको ₹${randomEarning} मिले` : `You earned ₹${randomEarning}`,
      type: 'payment',
      isRead: false
    });
  }, [user, addNotification]);

  const simulateAdminBookingAlert = useCallback(() => {
    if (user?.role !== 'admin') return;

    addNotification({
      userId: user.id,
      title: user.language === 'hi' ? '📋 नई बुकिंग' : '📋 New Booking',
      message: user.language === 'hi' ? 'दिल्ली में नई इमरजेंसी बुकिंग - ₹800' : 'New emergency booking in Delhi - ₹800',
      type: 'booking',
      isRead: false
    });
  }, [user, addNotification]);

  const broadcastToAll = useCallback((message: string, title: string) => {
    if (!isConnected) return;

    console.log('📢 Broadcasting to all users:', title, message);
    
    // Simulate broadcast to all online users
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
    if (!isConnected) {
      console.log('🔗 Manual connection requested');
      establishConnection();
    }
  }, [isConnected, establishConnection]);

  const disconnect = useCallback(() => {
    console.log('❌ Manual disconnection requested');
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

    console.log('💬 Enhanced real-time message sent to:', recipientId, message);
    
    setTimeout(() => {
      addNotification({
        userId: recipientId,
        title: user?.language === 'hi' ? '💬 नया संदेश' : '💬 New Message',
        message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        type: 'chat',
        isRead: false
      });
      
      console.log('✅ Message delivered to:', recipientId);
    }, Math.random() * 1000 + 200);
  }, [isConnected, user, addNotification]);

  const updateJobStatus = useCallback((jobId: string, status: string) => {
    if (!isConnected) {
      console.warn('⚠️ Cannot update job status - not connected');
      return;
    }

    console.log('🔄 Enhanced job status update:', jobId, '->', status);
    updateJobInContext(jobId, status as any);
    
    setTimeout(() => {
      if (user) {
        addNotification({
          userId: user.id,
          title: user.language === 'hi' ? '⚡ जॉब स्टेटस अपडेट' : '⚡ Job Status Update',
          message: `${user.language === 'hi' ? 'जॉब अपडेट:' : 'Job updated:'} ${status}`,
          type: 'job',
          isRead: false
        });
      }
    }, 300);
  }, [isConnected, user, updateJobInContext, addNotification]);

  const sendNotification = useCallback((userId: string, notification: any) => {
    if (!isConnected) {
      console.warn('⚠️ Cannot send notification - not connected');
      return;
    }

    console.log('🔔 Enhanced notification sent to:', userId, notification);
    addNotification({
      userId,
      ...notification,
      isRead: false
    });
  }, [isConnected, addNotification]);

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

  // Debug logging
  useEffect(() => {
    console.log('🔗 Enhanced Realtime State:', {
      isConnected,
      connectionStatus,
      userId: user?.id,
      userRole: user?.role,
      onlineUsers: onlineUsers.length,
      hasJobs: jobs.length > 0
    });
  }, [isConnected, connectionStatus, user?.id, user?.role, onlineUsers.length, jobs.length]);

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
