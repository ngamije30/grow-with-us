import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async register(data: { email: string; password: string; name: string }) {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post('/users/login', data);
    return response.data;
  },
};

export const messageService = {
  async sendMessage(data: { receiverId: string; content: string }) {
    const response = await api.post('/messages', data);
    return response.data;
  },

  async getMessages(otherUserId: string) {
    const response = await api.get(`/messages/${otherUserId}`);
    return response.data;
  },
};

export const mediaService = {
  async uploadMedia(data: FormData) {
    const response = await api.post('/media/upload', data);
    return response.data;
  },

  async getUserMedia() {
    const response = await api.get('/media');
    return response.data;
  },
};