import React, { createContext, useContext, useState, useEffect } from 'react';
import { ElectricianProfile, Service, Job, User, Notification } from '../types';

interface AppDataContextType {
  // Electricians data
  electricians: ElectricianProfile[];
  pendingElectricians: ElectricianProfile[];
  approveElectrician: (electricianId: string) => void;
  rejectElectrician: (electricianId: string) => void;
  updateElectrician: (electrician: Partial<ElectricianProfile>) => void;

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
  };
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real electricians data with proper IDs
  const [electricians, setElectricians] = useState<ElectricianProfile[]>([
    {
      id: 'electrician1',
      name: 'राम कुमार',
      email: 'electrician@example.com',
      phone: '9876543212',
      role: 'electrician',
      isVerified: true,
      language: 'hi',
      age: 35,
      experience: 5,
      education: 'ITI Electrical',
      services: ['1'],
      portfolio: [],
      rating: 4.8,
      totalJobs: 120,
      isApproved: true,
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'नोएडा, उत्तर प्रदेश'
      },
      availability: true,
      earnings: 45000
    }
  ]);

  const [pendingElectricians, setPendingElectricians] = useState<ElectricianProfile[]>([
    {
      id: 'electrician2',
      name: 'विकास कुमार',
      email: 'vikas@example.com',
      phone: '9876543211',
      role: 'electrician',
      isVerified: false,
      language: 'hi',
      age: 28,
      experience: 3,
      education: 'Diploma Electrical',
      services: [],
      portfolio: [],
      rating: 0,
      totalJobs: 0,
      isApproved: false,
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'नोएडा, उत्तर प्रदेश'
      },
      availability: true,
      earnings: 0
    }
  ]);

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

  const [pendingServices, setPendingServices] = useState<Service[]>([
    {
      id: '2',
      name: 'वायरिंग रिपेयर',
      basePrice: 500,
      description: 'घरेलू वायरिंग की मरम्मत',
      category: 'रिपेयर',
      wholeHousePricing: {
        enabled: true,
        perSquareFoot: 50,
        flatRate: 5000
      }
    }
  ]);

  // Real jobs data with proper user IDs
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'job1',
      customerId: 'customer1',
      electricianId: 'electrician1',
      serviceId: '1',
      status: 'pending',
      description: 'फैन नहीं चल रहा',
      address: 'नोएडा सेक्टर 62',
      location: { lat: 28.6139, lng: 77.2090 },
      distance: 2.5,
      totalPrice: 450,
      scheduledDate: new Date().toLocaleDateString(),
      isEmergency: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'job2',
      customerId: 'customer1',
      electricianId: 'electrician1',
      serviceId: '1',
      status: 'completed',
      description: 'AC की वायरिंग',
      address: 'नोएडा सेक्टर 63',
      location: { lat: 28.6139, lng: 77.2090 },
      distance: 3.0,
      totalPrice: 800,
      scheduledDate: '2024-01-15',
      isEmergency: false,
      createdAt: '2024-01-15T10:00:00Z',
      rating: 5,
      review: 'बहुत अच्छी सेवा'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Calculate real-time stats
  const stats = {
    totalUsers: electricians.length + 1247, // Including customers
    totalElectricians: electricians.length,
    totalJobs: jobs.length,
    revenue: jobs.reduce((sum, job) => sum + (job.status === 'completed' ? job.totalPrice : 0), 0),
    pendingApprovals: pendingElectricians.length + pendingServices.length,
    activeJobs: jobs.filter(job => job.status === 'in_progress' || job.status === 'accepted').length,
    onlineUsers: Math.floor(Math.random() * 50) + 20, // Simulate online users
    todayRevenue: jobs.filter(job => 
      job.status === 'completed' && 
      new Date(job.createdAt).toDateString() === new Date().toDateString()
    ).reduce((sum, job) => sum + job.totalPrice, 0)
  };

  const approveElectrician = (electricianId: string) => {
    const electrician = pendingElectricians.find(e => e.id === electricianId);
    if (electrician) {
      const approvedElectrician = { ...electrician, isApproved: true, isVerified: true };
      setElectricians(prev => [...prev, approvedElectrician]);
      setPendingElectricians(prev => prev.filter(e => e.id !== electricianId));
      
      addNotification({
        userId: electricianId,
        title: 'आवेदन स्वीकृत',
        message: 'आपका इलेक्ट्रीशियन आवेदन स्वीकार कर लिया गया है',
        type: 'system',
        isRead: false
      });
    }
  };

  const rejectElectrician = (electricianId: string) => {
    setPendingElectricians(prev => prev.filter(e => e.id !== electricianId));
    
    addNotification({
      userId: electricianId,
      title: 'आवेदन अस्वीकृत',
      message: 'आपका इलेक्ट्रीशियन आवेदन अस्वीकार कर दिया गया है',
      type: 'system',
      isRead: false
    });
  };

  const updateElectrician = (updatedElectrician: Partial<ElectricianProfile>) => {
    setElectricians(prev => 
      prev.map(e => e.id === updatedElectrician.id ? { ...e, ...updatedElectrician } : e)
    );
  };

  const approveService = (serviceId: string) => {
    const service = pendingServices.find(s => s.id === serviceId);
    if (service) {
      setServices(prev => [...prev, service]);
      setPendingServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };

  const rejectService = (serviceId: string) => {
    setPendingServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const addService = (service: Service) => {
    setPendingServices(prev => [...prev, service]);
  };

  const createJob = (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: Math.random().toString(),
      createdAt: new Date().toISOString()
    };
    setJobs(prev => [...prev, newJob]);

    // Notify electrician
    addNotification({
      userId: jobData.electricianId,
      title: 'नई जॉब',
      message: 'आपके लिए एक नई जॉब आई है',
      type: 'job',
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
      // Notify all relevant users
      addNotification({
        userId: job.customerId,
        title: 'जॉब अपडेट',
        message: `आपकी जॉब का स्टेटस अपडेट हुआ: ${status}`,
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
    }
  };

  const completeJob = (jobId: string, completedImages?: string[], rating?: number, review?: string) => {
    setJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'completed' as const, completedImages, rating, review }
          : job
      )
    );

    const job = jobs.find(j => j.id === jobId);
    if (job) {
      // Update electrician earnings and job count
      updateElectrician({
        id: job.electricianId,
        earnings: electricians.find(e => e.id === job.electricianId)?.earnings + job.totalPrice,
        totalJobs: (electricians.find(e => e.id === job.electricianId)?.totalJobs || 0) + 1
      });
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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
      services,
      pendingServices,
      approveService,
      rejectService,
      addService,
      jobs,
      createJob,
      updateJobStatus,
      completeJob,
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
