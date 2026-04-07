import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('up_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (email: string, password: string) => {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    return api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  me: () => api.get('/auth/me'),
};

// Traffic
export const trafficAPI = {
  predict: (data: {
    city: string;
    junction: number;
    hour: number;
    day: number;
    month: number;
  }) => api.post('/api/predict', data),
  cities: () => api.get('/api/cities'),
  dashboardStats: () => api.get('/api/dashboard-stats'),
  liveTraffic: () => api.get('/api/live-traffic'),
  analytics: () => api.get('/api/analytics'),
  alerts: () => api.get('/api/alerts'),
};

export default api;
