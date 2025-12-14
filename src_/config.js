

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
    HOME_CONTENT: '/home-content/',
    ANNOUNCEMENTS: '/announcements/',
    MESSAGES: '/messages/',
    NOTIFICATIONS: '/notifications/'
  },
  // Admin-specific endpoints
  ADMIN: {
    BASE: '/admin/',
    TUTORS: '/admin/tutors/',
    STUDENTS: '/admin/students/',
    COURSES: '/admin/courses/',
    ANALYTICS: '/admin/analytics/',
    SYSTEM: '/admin/system/',
    NOTIFICATIONS: '/admin/notifications/',
    DASHBOARD_STATS: '/admin/dashboard-stats/',
    USER_STATISTICS: '/admin/user-statistics/',
    ACADEMIC_STATISTICS: '/admin/academic-statistics/',
    RECENT_ACTIVITY: '/admin/recent-activity/',
    PERFORMANCE_TRENDS: '/admin/performance-trends/',
    SYSTEM_HEALTH: '/admin/system-health/',
    RESOURCE_UTILIZATION: '/admin/resource-utilization/',
    SECURITY_METRICS: '/admin/security-metrics/'
  },
  // Tutor-specific endpoints
  TUTOR: {
    BASE: '/tutor/',
    COURSES: '/tutor/courses/',
    STUDENTS: '/tutor/students/',
    ASSIGNMENTS: '/tutor/assignments/',
    SCHEDULES: '/tutor/schedules/',
    MESSAGES: '/tutor/messages/',
    ANALYTICS: '/tutor/analytics/',
    DASHBOARD_STATS: '/tutor/dashboard-stats/',
    PERFORMANCE_ANALYTICS: '/tutor/performance-analytics/',
    STUDENTS_API: '/api/tutors/students/',
    SCHEDULES_API: '/api/tutors/schedules/',
    MESSAGES_API: '/api/tutors/messages/',
    PERFORMANCE_API: '/api/tutors/performance-analytics/'
  },
  // Student-specific endpoints
  STUDENT: {
    BASE: '/student/',
    COURSES: '/student/courses/',
    ASSIGNMENTS: '/student/assignments/',
    PROGRESS: '/student/progress/',
    MESSAGES: '/student/messages/',
    SCHEDULES: '/student/schedules/',
    DASHBOARD_STATS: '/student/dashboard-stats/'
  },
  // General API endpoints used by multiple roles
  GENERAL: {
    SUBMISSIONS_GRADE: '/api/submissions/{id}/grade/',
    MESSAGES_READ: '/api/messages/{id}/read/'
  }
};

// Legacy export for backward compatibility
export const API = API_BASE_URL;
