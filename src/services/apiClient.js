

import axios from 'axios';
import { API_BASE_URL } from '../config';

// SAFETY: fallback baseURL
const baseURL =
  API_BASE_URL ||
  import.meta?.env?.VITE_API_BASE_URL ||
  'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
apiClient.interceptors.request.use(
  (config) => {
    // SAFETY: window check
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Always JSON for non-multipart requests
    if (!config.headers['Content-Type'] || config.headers['Content-Type'] === 'application/json') {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
apiClient.interceptors.response.use(
  (response) => {
    const contentType = response.headers?.['content-type'];

    // Only reject HTML responses for non-blob requests that explicitly expect JSON
    if (
      contentType &&
      contentType.includes('text/html') &&
      response.config.responseType !== 'blob' &&
      !response.config.url?.includes('/books') // Allow HTML for book endpoints that might serve PDFs
    ) {
      console.warn('Received HTML response for JSON endpoint:', response.config.url);
      // Don't reject, just log and continue - let the frontend handle the data
      return response;
    }

    return response;
  },
  (error) => {
    let message = 'An unexpected error occurred';
    let status = null;

    if (error.response) {
      status = error.response.status;
      const { data } = error.response;

      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        message = 'Session expired. Please log in again.';
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        // For 404s, especially for books endpoint, provide a more graceful message
        if (error.config.url?.includes('/books')) {
          message = 'Books not found or service unavailable. You can still upload local PDF files.';
        } else {
          message = 'Requested resource not found.';
        }
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (data) {
        // DRF-style error extraction
        if (typeof data === 'string') {
          message = data;
        } else if (data.detail) {
          message = data.detail;
        } else if (data.message) {
          message = data.message;
        } else {
          const firstError = Object.values(data)[0];
          if (Array.isArray(firstError)) message = firstError[0];
        }
      }
    } else if (error.request) {
      // Network error - provide fallback message
      if (error.config.url?.includes('/books')) {
        message = 'Unable to load books. You can still upload and read local PDF files.';
      } else {
        message = 'Unable to connect to the server.';
      }
    } else {
      message = error.message;
    }

    // Enhance error object with additional context
    error.message = message;
    error.status = status;
    error.isNetworkError = !error.response && error.request;

    // Log error for debugging (in development)
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.status,
        message: error.message,
        isNetworkError: error.isNetworkError
      });
    }

    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Content API Methods
|--------------------------------------------------------------------------
| - Modular content API for news, events, testimonials, etc.
| - Uses the new /content/* endpoints
| - Provides consistent interface for frontend components
*/
const contentApi = {
  // News Management
  getNews: (params) => apiClient.get('/content/news', { params }),
  getNewsById: (id) => apiClient.get(`/content/news/${id}`),
  createNews: (data) => apiClient.post('/content/news', data),
  updateNews: (id, data) => apiClient.put(`/content/news/${id}`, data),
  deleteNews: (id) => apiClient.delete(`/content/news/${id}`),

  // Events Management
  getEvents: (params) => apiClient.get('/content/events', { params }),
  createEvent: (data) => apiClient.post('/content/events', data),

  // Testimonials
  getTestimonials: (params) => apiClient.get('/content/testimonials', { params }),
  createTestimonial: (data) => apiClient.post('/content/testimonials', data),

  // Home Content
  getHomeContent: () => apiClient.get('/content/home'),

  // Statistics
  getStatistics: () => apiClient.get('/content/stats'),
  getStats: () => apiClient.get('/content/stats'),

  // Campus Life
  getCampusLife: () => apiClient.get('/content/campus-life')
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/
export default apiClient;
export { contentApi, tutorApi };

/*
|--------------------------------------------------------------------------
| Tutor API Methods
|--------------------------------------------------------------------------
| - Tutor management and grading endpoints
| - Provides interface for tutor dashboard operations
*/
const tutorApi = {
  // Get all tutors
  getTutors: (params) => apiClient.get('/tutors', { params }),
  
  // Get tutor by ID
  getTutorById: (id) => apiClient.get(`/tutors/${id}`),
  
  // Update tutor profile
  updateTutor: (id, data) => apiClient.put(`/tutors/${id}`, data),
  
  // Delete tutor
  deleteTutor: (id) => apiClient.delete(`/tutors/${id}`),
  
  // Get tutor's courses
  getTutorCourses: (id) => apiClient.get(`/tutors/${id}/courses`),
  
  // Get tutor's students
  getTutorStudents: (id) => apiClient.get(`/tutors/${id}/students`),
  
  // Get tutor's submissions
  getTutorSubmissions: (id, params) => apiClient.get(`/tutors/${id}/submissions`, { params }),
  
  // Get tutor dashboard stats
  getTutorDashboardStats: (id) => apiClient.get(`/tutors/${id}/dashboard-stats`),
  
  // Grade a submission
  gradeSubmission: (tutorId, submissionId, data) => 
    apiClient.put(`/tutors/${tutorId}/submissions/${submissionId}/grade`, data)
};
