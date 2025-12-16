import axios from 'axios';
import { API_BASE_URL } from '../config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // Remove default Content-Type to allow multipart/form-data for file uploads
});

// Helper function to check if data contains files
const hasFileData = (data) => {
  if (data instanceof FormData) return true;
  if (typeof data === 'object' && data !== null) {
    return Object.values(data).some(value => 
      value instanceof File || 
      (Array.isArray(value) && value.some(item => item instanceof File))
    );
  }
  return false;
};

// Request interceptor for authentication and content type detection
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Auto-detect content type for file uploads
    if (hasFileData(config.data)) {
      // Don't set Content-Type for FormData, let browser set it with boundary
      delete config.headers['Content-Type'];
    } else {
      // Set JSON content-type for regular data
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Don't redirect immediately, let the components handle auth state
      console.warn('Authentication failed - token will be cleared');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
