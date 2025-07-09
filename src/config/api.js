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

export const API_BASE = config.API_BASE;
export const BASE_URL = config.BASE_URL;
export const ENVIRONMENT = config.ENVIRONMENT;

// Debug bilgisi (sadece development'ta)
if (config.ENVIRONMENT === 'development') {
  console.log('🔧 API Configuration:', config);
}

export default config;