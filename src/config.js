
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_BASE_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;



export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/refresh/',
    USER: '/auth/user/'
  },
  USERS: '/users/',
  STUDENTS: {
    PROFILES: '/students/',
    LIST: '/students/'
  },
  TUTORS: {
    PROFILES: '/tutors/',
    LIST: '/tutors/'
  },
  ACADEMICS: {
    COURSES: '/courses/',
    ENROLLMENTS: '/enrollments/',
    ASSIGNMENTS: '/assignments/',
    SUBMISSIONS: '/submissions/',
    CLASS_SCHEDULES: '/class-schedules/',
    ATTENDANCE: '/attendance/'
  },

  COMMUNICATION: {
    STATISTICS: '/statistics/',
    NEWS: '/news/',
    EVENTS: '/events/',
    TESTIMONIALS: '/testimonials/',
    CAMPUS_LIFE: '/campus-life/',
    CONTACT: '/contact/',
    DASHBOARD_STATS: '/dashboard-stats/',
    HOME_CONTENT: '/home-content/',
    BOOKS: '/books/'
  },
  DASHBOARD: {
    STUDENT: '/dashboard/student/',
    TUTOR: '/dashboard/tutor/',
    ADMIN: '/dashboard/admin/'
  }
};

// Legacy export for backward compatibility
export const API = API_BASE_URL;
