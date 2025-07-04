
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { Job } from '../types';

export const useRealtimeJobs = () => {
  const { user } = useAuth();
  const { jobs, updateJobStatus } = useAppData();
  const { isConnected } = useRealtime();
  const [liveJobs, setLiveJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (user) {
      const userJobs = jobs.filter(job => 
        job.customerId === user.id || job.electricianId === user.id
      );
      setLiveJobs(userJobs);
    }
  }, [jobs, user]);

  const updateJobWithNotification = (jobId: string, status: Job['status']) => {
    updateJobStatus(jobId, status);
    
    // Simulate real-time notification
    const job = jobs.find(j => j.id === jobId);
    if (job && isConnected) {
      console.log(`Real-time job update: ${jobId} -> ${status}`);
    }
  };

  return {
    liveJobs,
    updateJobWithNotification,
    isConnected
  };
};
