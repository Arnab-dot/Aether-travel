// Centralized configuration for the application using Vite environment variables
// VITE_API_URL should be set in .env (local) or Vercel Environment Variables (production)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://aether-backend-3va3.onrender.com';

// Remove trailing slash if present to avoid double slashes when appending endpoints
export const API_URL = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

console.log('🔌 API Base URL:', API_URL);

export default API_URL;
