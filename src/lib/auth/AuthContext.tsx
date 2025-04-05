'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'MENTOR' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Set the token in the Authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Extract user ID and role from token
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const base64Payload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64Payload)
                  .split('')
                  .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const payload = JSON.parse(jsonPayload);
              
              if (payload && payload.userId) {
                api.defaults.headers.common['x-user-id'] = payload.userId;
              }
              if (payload && payload.role) {
                api.defaults.headers.common['x-user-role'] = payload.role;
              }
            }
          } catch (error) {
            console.error('Error decoding token:', error);
          }
          
          try {
            const response = await api.get('/api/users/me');
            setUser(response.data);
          } catch (error) {
            // If there's an error fetching the user, clear the token
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            delete api.defaults.headers.common['x-user-id'];
            delete api.defaults.headers.common['x-user-role'];
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        delete api.defaults.headers.common['x-user-id'];
        delete api.defaults.headers.common['x-user-role'];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Clear any existing token first
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      delete api.defaults.headers.common['x-user-id'];
      delete api.defaults.headers.common['x-user-role'];
      
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Extract user ID and role from token
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const base64Payload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64Payload)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);
          
          if (payload && payload.userId) {
            api.defaults.headers.common['x-user-id'] = payload.userId;
          }
          if (payload && payload.role) {
            api.defaults.headers.common['x-user-role'] = payload.role;
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
      setUser(user);
      
      // Add a small delay before redirecting to ensure state is updated
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } catch (error) {
      // Clear any token that might have been set
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      delete api.defaults.headers.common['x-user-id'];
      delete api.defaults.headers.common['x-user-role'];
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['x-user-id'];
    delete api.defaults.headers.common['x-user-role'];
    setUser(null);
    router.push('/login');
  };

  const register = async (userData: any) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 