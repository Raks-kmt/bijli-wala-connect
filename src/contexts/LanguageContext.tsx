
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Common
    'login': 'Login',
    'signup': 'Sign Up',
    'logout': 'Logout',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'search': 'Search',
    'filter': 'Filter',
    'back': 'Back',
    'next': 'Next',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'language': 'Language',
    'settings': 'Settings',
    'profile': 'Profile',
    'notifications': 'Notifications',
    'help': 'Help',
    'about': 'About',
    
    // Auth
    'phone_number': 'Phone Number',
    'enter_otp': 'Enter OTP',
    'verify_otp': 'Verify OTP',
    'otp_sent': 'OTP sent to your phone',
    'invalid_otp': 'Invalid OTP',
    'select_role': 'Select Role',
    'customer': 'Customer',
    'electrician': 'Electrician',
    'admin': 'Admin',
    
    // Customer
    'find_electricians': 'Find Electricians',
    'book_service': 'Book Service',
    'my_bookings': 'My Bookings',
    'distance': 'Distance',
    'experience': 'Experience',
    'rating': 'Rating',
    'services': 'Services',
    'view_profile': 'View Profile',
    'book_now': 'Book Now',
    'track_job': 'Track Job',
    'rate_service': 'Rate Service',
    'chat': 'Chat',
    'payment': 'Payment',
    'emergency': 'Emergency',
    'wallet': 'Wallet',
    'reviews': 'Reviews',
    'complaints': 'Complaints',
    
    // Electrician
    'my_profile': 'My Profile',
    'job_requests': 'Job Requests',
    'active_jobs': 'Active Jobs',
    'earnings': 'Earnings',
    'portfolio': 'Portfolio',
    'accept': 'Accept',
    'reject': 'Reject',
    'start_job': 'Start Job',
    'complete_job': 'Complete Job',
    'upload_images': 'Upload Images',
    'availability': 'Availability',
    'available': 'Available',
    'unavailable': 'Unavailable',
    
    // Admin
    'dashboard': 'Dashboard',
    'manage_users': 'Manage Users',
    'approve_electricians': 'Approve Electricians',
    'service_charges': 'Service Charges',
    'analytics': 'Analytics',
    'system_settings': 'System Settings',
    'total_users': 'Total Users',
    'total_jobs': 'Total Jobs',
    'revenue': 'Revenue',
    'pending_approvals': 'Pending Approvals',
    
    // Job Status
    'pending': 'Pending',
    'accepted': 'Accepted',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    
    // Common phrases
    'years_experience': 'years experience',
    'km_away': 'km away',
    'per_hour': 'per hour',
    'base_charge': 'Base Charge',
    'distance_charge': 'Distance Charge',
    'total_amount': 'Total Amount',
    'payment_method': 'Payment Method',
    'online_payment': 'Online Payment',
    'cash_payment': 'Cash Payment',
    'wallet_payment': 'Wallet Payment',
  },
  hi: {
    // Common
    'login': 'लॉगिन',
    'signup': 'साइनअप',
    'logout': 'लॉगआउट',
    'submit': 'सबमिट',
    'cancel': 'रद्द करें',
    'save': 'सेव करें',
    'delete': 'डिलीट',
    'edit': 'एडिट',
    'search': 'खोजें',
    'filter': 'फ़िल्टर',
    'back': 'वापस',
    'next': 'आगे',
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि',
    'success': 'सफल',
    'language': 'भाषा',
    'settings': 'सेटिंग्स',
    'profile': 'प्रोफाइल',
    'notifications': 'नोटिफिकेशन',
    'help': 'सहायता',
    'about': 'के बारे में',
    
    // Auth
    'phone_number': 'मोबाइल नंबर',
    'enter_otp': 'OTP डालें',
    'verify_otp': 'OTP वेरीफाई करें',
    'otp_sent': 'आपके फोन पर OTP भेजा गया',
    'invalid_otp': 'गलत OTP',
    'select_role': 'भूमिका चुनें',
    'customer': 'कस्टमर',
    'electrician': 'इलेक्ट्रीशियन',
    'admin': 'एडमिन',
    
    // Customer
    'find_electricians': 'इलेक्ट्रीशियन खोजें',
    'book_service': 'सर्विस बुक करें',
    'my_bookings': 'मेरी बुकिंग',
    'distance': 'दूरी',
    'experience': 'अनुभव',
    'rating': 'रेटिंग',
    'services': 'सेवाएं',
    'view_profile': 'प्रोफाइल देखें',
    'book_now': 'अभी बुक करें',
    'track_job': 'जॉब ट्रैक करें',
    'rate_service': 'सर्विस रेट करें',
    'chat': 'चैट',
    'payment': 'भुगतान',
    'emergency': 'आपातकाल',
    'wallet': 'वॉलेट',
    'reviews': 'रिव्यू',
    'complaints': 'शिकायत',
    
    // Electrician
    'my_profile': 'मेरा प्रोफाइल',
    'job_requests': 'जॉब रिक्वेस्ट',
    'active_jobs': 'एक्टिव जॉब्स',
    'earnings': 'कमाई',
    'portfolio': 'पोर्टफोलियो',
    'accept': 'स्वीकार करें',
    'reject': 'अस्वीकार करें',
    'start_job': 'जॉब शुरू करें',
    'complete_job': 'जॉब पूरा करें',
    'upload_images': 'तस्वीरें अपलोड करें',
    'availability': 'उपलब्धता',
    'available': 'उपलब्ध',
    'unavailable': 'अनुपलब्ध',
    
    // Admin
    'dashboard': 'डैशबोर्ड',
    'manage_users': 'यूजर प्रबंधन',
    'approve_electricians': 'इलेक्ट्रीशियन अप्रूव करें',
    'service_charges': 'सर्विस चार्ज',
    'analytics': 'एनालिटिक्स',
    'system_settings': 'सिस्टम सेटिंग्स',
    'total_users': 'कुल यूजर',
    'total_jobs': 'कुल जॉब्स',
    'revenue': 'आय',
    'pending_approvals': 'पेंडिंग अप्रूवल',
    
    // Job Status
    'pending': 'पेंडिंग',
    'accepted': 'स्वीकार किया',
    'in_progress': 'प्रगति में',
    'completed': 'पूरा हुआ',
    'cancelled': 'रद्द',
    
    // Common phrases
    'years_experience': 'साल का अनुभव',
    'km_away': 'किमी दूर',
    'per_hour': 'प्रति घंटे',
    'base_charge': 'मूल शुल्क',
    'distance_charge': 'दूरी शुल्क',
    'total_amount': 'कुल राशि',
    'payment_method': 'भुगतान विधि',
    'online_payment': 'ऑनलाइन भुगतान',
    'cash_payment': 'नकद भुगतान',
    'wallet_payment': 'वॉलेट भुगतान',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'hi';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
