// Environment utility functions
export const isDevelopment = () => {
  return import.meta.env.MODE === 'development' || 
         import.meta.env.VITE_ENVIRONMENT === 'development' ||
         window.location.hostname === 'localhost';
};

export const isProduction = () => {
  return import.meta.env.MODE === 'production' || 
         import.meta.env.VITE_ENVIRONMENT === 'production';
};

export const getEnvironment = () => {
  return isDevelopment() ? 'development' : 'production';
};

export const isDebugMode = () => {
  return import.meta.env.VITE_DEBUG_MODE === 'true' && isDevelopment();
};

export const getAppConfig = () => {
  return {
    name: import.meta.env.VITE_APP_NAME || 'GGDB',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: getEnvironment(),
    debug: isDebugMode(),
    isDev: isDevelopment(),
    isProd: isProduction()
  };
};

// Console helper for development
export const devLog = (...args) => {
  if (isDevelopment() && isDebugMode()) {
    console.log('🔧 [DEV]', ...args);
  }
};

export const devWarn = (...args) => {
  if (isDevelopment()) {
    console.warn('⚠️ [DEV]', ...args);
  }
};

export const devError = (...args) => {
  if (isDevelopment()) {
    console.error('❌ [DEV]', ...args);
  }
};

// Environment info (sadece development'ta göster)
if (isDevelopment()) {
  console.log('🌍 Environment Info:', getAppConfig());
}