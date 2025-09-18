// Production deployment configuration for Google Console
const BACKEND_URL = 'http://34.28.133.216:8888/';
const FRONTEND_URL = 'http://34.28.133.216:3000/';

// Debug environment variables
console.log('Environment check:', {
  PROD: import.meta.env.PROD,
  VITE_DEV_REMOTE: import.meta.env.VITE_DEV_REMOTE,
  VITE_BACKEND_SERVER: import.meta.env.VITE_BACKEND_SERVER,
  NODE_ENV: import.meta.env.NODE_ENV
});

export const API_BASE_URL = BACKEND_URL + 'api/';
export const BASE_URL = BACKEND_URL;
export const WEBSITE_URL = FRONTEND_URL;
export const DOWNLOAD_BASE_URL = BACKEND_URL + 'download/';
export const ACCESS_TOKEN_NAME = 'x-auth-token';
export const FILE_BASE_URL = BACKEND_URL;

// Debug final URLs
console.log('API Configuration:', {
  API_BASE_URL,
  BASE_URL,
  DOWNLOAD_BASE_URL,
  FILE_BASE_URL
});

//  console.log(
//    '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
//  );
