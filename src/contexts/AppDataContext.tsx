import React, { createContext, useContext, useState, useEffect } from 'react';
import { ElectricianProfile, Service, Job, User, Notification } from '../types';

interface AppDataContextType {
  // Electricians data
  electricians: ElectricianProfile[];
  pendingElectricians: ElectricianProfile[];
  approveElectrician: (electricianId: string) => void;
  rejectElectrician: (electricianId: string) => void;
  updateElectrician: (electrician: Partial<ElectricianProfile>) => void;
  addElectricianApplication: (electrician: ElectricianProfile) => void;

  // Services data
  services: Service[];
  pendingServices: Service[];
  approveService: (serviceId: string) => void;
  rejectService: (serviceId: string) => void;
  addService: (service: Service) => void;

  // Jobs data
  jobs: Job[];
  createJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  updateJobStatus: (jobId: string, status: Job['status']) => void;
  completeJob: (jobId: string, completedImages?: string[], rating?: number, review?: string) => void;

  // Users data
  users: User[];
  addUser: (user: User) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (notificationId: string) => void;

  // Statistics
  stats: {
    totalUsers: number;
    totalElectricians: number;
    totalJobs: number;
    revenue: number;
    pendingApprovals: number;
    activeJobs: number;
    onlineUsers: number;
    todayRevenue: number;
  };
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [electricians, setElectricians] = useState<ElectricianProfile[]>([]);
  const [pendingElectricians, setPendingElectricians] = useState<ElectricianProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'फैन रिपेयर',
      basePrice: 300,
      description: 'सीलिंग फैन की मरम्मत',
      category: 'रिपेयर',
      wholeHousePricing: {
        enabled: false
      }
    }
  ]);

  const [pendingServices, setPendingServices] = useState<Service[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Real stats calculation - NO FAKE DATA
  const stats = {
    totalUsers: users.length,
    totalElectricians: electricians.length,
    totalJobs: jobs.length,
    revenue: jobs.reduce((sum, job) => sum + (job.status === 'completed' ? job.totalPrice : 0), 0),
    pendingApprovals: pendingElectricians.length + pendingServices.length,
    activeJobs: jobs.filter(job => job.status === 'in_progress' || job.status === 'accepted').length,
    onlineUsers: users.length, // Only count actual users
    todayRevenue: jobs.filter(job => 
      job.status === 'completed' && 
      new Date(job.createdAt).toDateString() === new Date().toDateString()
    ).reduce((sum, job) => sum + job.totalPrice, 0)
  };

  const addUser = (user: User) => {
    console.log('AppDataContext - Adding new user:', user);
    setUsers(prev => [...prev, user]);
    
    addNotification({
      userId: user.id,
      title: user.language === 'hi' ? 'स्वागत है!' : 'Welcome!',
      message: user.language === 'hi' ? 'आपका खाता सफलतापूर्वक बन गया है' : 'Your account has been created successfully',
      type: 'system',
      isRead: false
    });
  };

  const addElectricianApplication = (electrician: ElectricianProfile) => {
    console.log('AppDataContext - Adding electrician application:', electrician);
    setPendingElectricians(prev => [...prev, electrician]);
    
    addNotification({
      userId: 'admin1',
      title: 'नया इलेक्ट्रीशियन आवेदन',
      message: `${electrician.name} ने इलेक्ट्रीशियन के लिए आवेदन दिया है`,
      type: 'system',
      isRead: false
    });
  };

  const approveElectrician = (electricianId: string) => {
    console.log('AppDataContext - Approving electrician:', electricianId);
    const electrician = pendingElectricians.find(e => e.id === electricianId);
    if (electrician) {
      const approvedElectrician = { ...electrician, isApproved: true, isVerified: true };
      setElectricians(prev => [...prev, approvedElectrician]);
      setPendingElectricians(prev => prev.filter(e => e.id !== electricianId));
      
      const electricianUser: User = {
        id: electrician.id,
        name: electrician.name,
        email: electrician.email,
        phone: electrician.phone,
        role: 'electrician',
        isVerified: true,
        language: electrician.language
      };
      setUsers(prev => [...prev.filter(u => u.id !== electrician.id), electricianUser]);
      
      addNotification({
        userId: electricianId,
        title: 'आवेदन स्वीकृत',
        message: 'बधाई! आपका इलेक्ट्रीशियन आवेदन स्वीकार कर लिया गया है',
        type: 'system',
        isRead: false
      });
    }
  };

  const rejectElectrician = (electricianId: string) => {
    console.log('AppDataContext - Rejecting electrician:', electricianId);
    setPendingElectricians(prev => prev.filter(e => e.id !== electricianId));
    
    addNotification({
      userId: electricianId,
      title: 'आवेदन अस्वीकृत',
      message: 'खुशी: आपका इलेक्ट्रीशियन आवेदन अस्वीकार कर दिया गया है। कृपया फिर से कोशिश करें',
      type: 'system',
      isRead: false
    });
  };

  const updateElectrician = (updatedElectrician: Partial<ElectricianProfile>) => {
    console.log('AppDataContext - Updating electrician:', updatedElectrician);
    setElectricians(prev => 
      prev.map(e => e.id === updatedElectrician.id ? { ...e, ...updatedElectrician } : e)
    );
  };

  const approveService = (serviceId: string) => {
    console.log('AppDataContext - Approving service:', serviceId);
    const service = pendingServices.find(s => s.id === serviceId);
    if (service) {
      setServices(prev => [...prev, service]);
      setPendingServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };

  const rejectService = (serviceId: string) => {
    console.log('AppDataContext - Rejecting service:', serviceId);
    setPendingServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const addService = (service: Service) => {
    console.log('AppDataContext - Adding new service:', service);
    setPendingServices(prev => [...prev, service]);
  };

  const createJob = (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    console.log('AppDataContext - Creating new job:', newJob);
    setJobs(prev => [...prev, newJob]);

    if (jobData.electricianId) {
      addNotification({
        userId: jobData.electricianId,
        title: 'नई जॉब',
        message: `आपके लिए एक नई जॉब आई है: ${jobData.description}`,
        type: 'job',
        isRead: false
      });
    }

    addNotification({
      userId: 'admin1',
      title: 'नई जॉब बुकिंग',
      message: `नई जॉब बुक हुई है: ${jobData.description}`,
      type: 'booking',
      isRead: false
    });
  };

  const updateJobStatus = (jobId: string, status: Job['status']) => {
    console.log('AppDataContext - Updating job status:', jobId, '->', status);
    setJobs(prev => 
      prev.map(job => job.id === jobId ? { ...job, status } : job)
    );

    const job = jobs.find(j => j.id === jobId);
    if (job) {
      addNotification({
        userId: job.customerId,
        title: 'जॉब अपडेट',
        message: `आपकी जॉब का स्टेटस अपडेट हुआ: ${status === 'completed' ? 'पूर्ण' : status === 'in_progress' ? 'चालू' : status === 'accepted' ? 'स्वीकार' : status}`,
        type: 'job',
        isRead: false
      });

      if (job.electricianId) {
        addNotification({
          userId: job.electricianId,
          title: 'जॉब अपडेट',
          message: `जॉब स्टेटस अपडेट हुआ: ${status}`,
          type: 'job',
          isRead: false
        });
      }

      addNotification({
        userId: 'admin1',
        title: 'जॉब स्टेटस अपडेट',
        message: `जॉब ID ${jobId} का स्टेटस ${status} हो गया`,
        type: 'system',
        isRead: false
      });
    }
  };

  const completeJob = (jobId: string, completedImages?: string[], rating?: number, review?: string) => {
    console.log('AppDataContext - Completing job:', jobId);
    setJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'completed' as const, completedImages, rating, review }
          : job
      )
    );

    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const electrician = electricians.find(e => e.id === job.electricianId);
      if (electrician) {
        updateElectrician({
          id: job.electricianId,
          earnings: electrician.earnings + job.totalPrice,
          totalJobs: electrician.totalJobs + 1
        });

        addNotification({
          userId: job.electricianId,
          title: 'पेमेंट प्राप्त',
          message: `आपको ₹${job.totalPrice} का पेमेंट मिला`,
          type: 'payment',
          isRead: false
        });
      }
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    console.log('AppDataContext - Adding notification:', newNotification);
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  return (
    <AppDataContext.Provider value={{
      electricians,
      pendingElectricians,
      approveElectrician,
      rejectElectrician,
      updateElectrician,
      addElectricianApplication,
      services,
      pendingServices,
      approveService,
      rejectService,
      addService,
      jobs,
      createJob,
      updateJobStatus,
      completeJob,
      users,
      addUser,
      notifications,
      addNotification,
      markNotificationRead,
      stats
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
