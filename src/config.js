
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/refresh/',
    USER: '/auth/user/'
  },
  USERS: '/users/',
  STUDENTS: '/students/',
  ACADEMICS: {
    COURSES: '/courses/',
    ENROLLMENTS: '/enrollments/',
    ASSIGNMENTS: '/assignments/',
    SUBMISSIONS: '/submissions/'
  },
  COMMUNICATION: {
    STATISTICS: '/statistics/',
    NEWS: '/news/',
    EVENTS: '/events/',
    TESTIMONIALS: '/testimonials/',
    CAMPUS_LIFE: '/campus-life/',
    CONTACT: '/contact/',
    DASHBOARD_STATS: '/dashboard-stats/',
    HOME_CONTENT: '/home-content/'
  }
};

// Legacy export for backward compatibility
export const API = API_BASE_URL;
