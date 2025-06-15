export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'electrician' | 'admin';
  isVerified: boolean;
  profileImage?: string;
  language: 'en' | 'hi';
}

export interface ElectricianProfile extends User {
  age: number;
  experience: number;
  education: string;
  services: Service[];
  portfolio: string[];
  rating: number;
  totalJobs: number;
  isApproved: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  availability: boolean;
  earnings: number;
}

export interface Service {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  category: string;
  wholeHousePricing?: {
    enabled: boolean;
    perSquareFoot?: number;
    flatRate?: number;
  };
}

export interface Job {
  id: string;
  customerId: string;
  electricianId: string;
  serviceId: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  distance: number;
  totalPrice: number;
  scheduledDate: string;
  isEmergency: boolean;
  createdAt: string;
  completedImages?: string[];
  rating?: number;
  review?: string;
}

export interface Message {
  id: string;
  jobId: string;
  senderId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Payment {
  id: string;
  jobId: string;
  amount: number;
  method: 'online' | 'cash' | 'wallet';
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job' | 'payment' | 'system' | 'promotion';
  isRead: boolean;
  timestamp: string;
}

export interface Complaint {
  id: string;
  userId: string;
  jobId?: string;
  subject: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
}
