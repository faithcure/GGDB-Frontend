import axios from 'axios';

// Environment-based API configuration
const getApiConfig = () => {
  const env = import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE;
  
  // Development (Local)
  if (env === 'development' || window.location.hostname === 'localhost') {
    return {
      API_BASE: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
      ENVIRONMENT: 'development'
    };
  }
  
  // Production (Vercel)
  return {
    API_BASE: import.meta.env.VITE_API_URL || '/api',
    BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
    ENVIRONMENT: 'production'
  };
};

const config = getApiConfig();

// Axios instance oluştur
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('API BaseURL set to: http://localhost:5000/api');

// Request interceptor - token ekleme
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const API_BASE = config.API_BASE;
export const BASE_URL = config.BASE_URL;
export const ENVIRONMENT = config.ENVIRONMENT;

// Debug bilgisi (sadece development'ta)
if (config.ENVIRONMENT === 'development') {
  console.log('🔧 API Configuration:', config);
}

export default config;