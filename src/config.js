

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_BASE_URL = baseUrl;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    USER: '/auth/user'
  },
  USERS: '/users',
  STUDENTS: {
    PROFILES: '/students',
    LIST: '/students'
  },
  TUTORS: {
    PROFILES: '/tutors',
    LIST: '/tutors'
  },
  ACADEMICS: {
    COURSES: '/academics/courses',
    ENROLLMENTS: '/academics/enrollments',
    ASSIGNMENTS: '/academics/assignments',
    SUBMISSIONS: '/academics/submissions',
    CLASS_SCHEDULES: '/academics/class-schedules',
    ATTENDANCE: '/academics/attendance',
    // Student-specific endpoints
    STUDENT_ENROLLMENTS: '/academics/enrollments/student',
    STUDENT_ASSIGNMENTS: '/academics/assignments/student',
    STUDENT_ATTENDANCE: '/academics/attendance/student',
    STUDENT_CLASS_SCHEDULES: '/academics/class-schedules/student'
  },

  COMMUNICATION: {
    STATISTICS: '/communication/statistics',
    NEWS: '/communication/news',
    EVENTS: '/communication/events',
    TESTIMONIALS: '/communication/testimonials',
    CAMPUS_LIFE: '/communication/campus-life',
    CONTACT: '/communication/contact',
    DASHBOARD_STATS: '/communication/dashboard-stats',
    HOME_CONTENT: '/communication/home-content',
    BOOKS: '/communication/books'
  },
  DASHBOARD: {
    STUDENT: '/dashboard/student',
    TUTOR: '/dashboard/tutor',
    ADMIN: '/dashboard/admin'
  }
};

// Legacy export for backward compatibility
export const API = API_BASE_URL;
