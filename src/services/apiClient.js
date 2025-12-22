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
  (response) => {
    // Check if the response is HTML when we expect JSON
    // This handles cases where a proxy/server returns a 200 OK HTML error page
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html') && 
        response.config.responseType !== 'text' && 
        response.config.responseType !== 'blob') {
      const error = new Error('Received HTML response from server. This likely indicates a server configuration error or wrong endpoint.');
      error.response = response;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data, status } = error.response;

      if (status === 401) {
        localStorage.removeItem('access_token');
        console.warn('Authentication failed - token will be cleared');
        errorMessage = 'Session expired. Please login again.';
      } else if (status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (status >= 500) {
        errorMessage = 'Internal server error. Please try again later.';
      } else if (data) {
        // Try to extract the error message from the response data
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (typeof data === 'object') {
          // Check for common error fields
          if (data.message) errorMessage = data.message;
          else if (data.detail) errorMessage = data.detail;
          else if (data.error) errorMessage = data.error;
          else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
            errorMessage = data.non_field_errors.join(', ');
          } else {
            // If we have field-specific errors, try to grab the first one
            const firstError = Object.values(data)[0];
            if (typeof firstError === 'string') {
              errorMessage = firstError;
            } else if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0];
            }
          }
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }

    // Update the error message to be more specific
    error.message = errorMessage;
    
    return Promise.reject(error);
  }
);

export default apiClient;
