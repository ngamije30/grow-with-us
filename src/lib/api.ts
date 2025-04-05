import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Extract user ID and role from token if available
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
            config.headers['x-user-id'] = payload.userId;
          }
          if (payload && payload.role) {
            config.headers['x-user-role'] = payload.role;
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      console.error('API Error:', {
        status: response.status,
        url: error.config?.url,
        method: error.config?.method,
        data: response.data
      });
      
      switch (response.status) {
        case 401:
          // Only redirect to login if we're not already on the login page
          if (!window.location.pathname.includes('/login')) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            delete api.defaults.headers.common['x-user-id'];
            delete api.defaults.headers.common['x-user-role'];
            
            // Use a small delay to ensure state is updated
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 500:
          toast.error('Server error. Please try again later');
          break;
        default:
          toast.error('An error occurred. Please try again');
      }
    } else {
      console.error('Network Error:', error);
      toast.error('Network error. Please check your connection');
    }
    
    return Promise.reject(error);
  }
);

export default api;