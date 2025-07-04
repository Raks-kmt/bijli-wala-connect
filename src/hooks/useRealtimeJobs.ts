
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { Job } from '../types';

export const useRealtimeJobs = () => {
  const { user } = useAuth();
  const { jobs, updateJobStatus, addNotification } = useAppData();
  const { isConnected } = useRealtime();
  const [liveJobs, setLiveJobs] = useState<Job[]>([]);
  const [jobUpdates, setJobUpdates] = useState<{[key: string]: number}>({});

  // Filter jobs based on user role and ID
  useEffect(() => {
    if (user) {
      let userJobs: Job[] = [];
      
      switch (user.role) {
        case 'customer':
          userJobs = jobs.filter(job => job.customerId === user.id);
          break;
        case 'electrician':
          userJobs = jobs.filter(job => job.electricianId === user.id);
          break;
        case 'admin':
          userJobs = jobs; // Admin can see all jobs
          break;
      }
      
      console.log('useRealtimeJobs - Filtered jobs for user:', user.role, userJobs.length);
      setLiveJobs(userJobs);
    }
  }, [jobs, user]);

  // Real-time job status updates
  const updateJobWithNotification = useCallback((jobId: string, status: Job['status']) => {
    if (!isConnected) {
      console.warn('useRealtimeJobs - Cannot update job, not connected');
      return;
    }

    console.log('useRealtimeJobs - Updating job with notification:', jobId, status);
    
    // Update job status
    updateJobStatus(jobId, status);
    
    // Track update for UI feedback
    setJobUpdates(prev => ({
      ...prev,
      [jobId]: Date.now()
    }));

    // Create status-specific notifications
    const job = jobs.find(j => j.id === jobId);
    if (job && user) {
      const statusMessages = {
        'pending': user.language === 'hi' ? 'जॉब प्रतीक्षा में' : 'Job pending',
        'accepted': user.language === 'hi' ? 'जॉब स्वीकार की गई' : 'Job accepted',
        'in_progress': user.language === 'hi' ? 'काम शुरू हो गया' : 'Work started',
        'completed': user.language === 'hi' ? 'काम पूरा हो गया' : 'Work completed',
        'cancelled': user.language === 'hi' ? 'जॉब रद्द की गई' : 'Job cancelled'
      };

      // Notify customer
      if (job.customerId !== user.id) {
        addNotification({
          userId: job.customerId,
          title: user.language === 'hi' ? 'जॉब अपडेट' : 'Job Update',
          message: statusMessages[status],
          type: 'job',
          isRead: false
        });
      }

      // Notify electrician
      if (job.electricianId && job.electricianId !== user.id) {
        addNotification({
          userId: job.electricianId,
          title: user.language === 'hi' ? 'जॉब अपडेट' : 'Job Update',
          message: statusMessages[status],
          type: 'job',
          isRead: false
        });
      }
    }
  }, [isConnected, user, jobs, updateJobStatus, addNotification]);

  // Get recent job updates for UI indication
  const getJobUpdateStatus = useCallback((jobId: string) => {
    const updateTime = jobUpdates[jobId];
    if (!updateTime) return null;
    
    const timeDiff = Date.now() - updateTime;
    return timeDiff < 5000 ? 'recent' : null; // Show as recent for 5 seconds
  }, [jobUpdates]);

  return {
    liveJobs,
    updateJobWithNotification,
    isConnected,
    getJobUpdateStatus,
    jobCount: liveJobs.length,
    activeJobCount: liveJobs.filter(job => 
      job.status === 'accepted' || job.status === 'in_progress'
    ).length,
    pendingJobCount: liveJobs.filter(job => job.status === 'pending').length,
    completedJobCount: liveJobs.filter(job => job.status === 'completed').length
  };
};
