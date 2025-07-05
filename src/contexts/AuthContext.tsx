
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database - includes all registered users
const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    email: 'admin@example.com',
    name: 'Admin User',
    phone: '9876543210',
    role: 'admin',
    isVerified: true,
    language: 'hi'
  },
  {
    id: 'customer1',
    email: 'customer@example.com',
    name: 'राम शर्मा',
    phone: '9876543211',
    role: 'customer',
    isVerified: true,
    language: 'hi'
  },
  {
    id: 'electrician1',
    email: 'electrician@example.com',
    name: 'राम कुमार',
    phone: '9876543212',
    role: 'electrician',
    isVerified: true,
    language: 'hi'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('AuthContext - Restored user session:', userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check in both MOCK_USERS and dynamically added users from localStorage
    const allUsers = [...MOCK_USERS];
    const dynamicUsers = JSON.parse(localStorage.getItem('dynamicUsers') || '[]');
    allUsers.push(...dynamicUsers);
    
    const foundUser = allUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      console.log('AuthContext - User logged in:', foundUser);
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    console.log('AuthContext - Logging out user:', user?.id);
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      console.log('AuthContext - User updated:', updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
