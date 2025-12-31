/* ============================================================================
   API BASE CONFIG
   ============================================================================
   - Safe fallback to prevent UI crash
   - Vite-compatible env loading
   - Django REST friendly
   - Production-ready with environment-aware configuration
============================================================================ */

// Determine the environment
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// Configure API base URL based on environment
// Production: Use environment variable or deploy-specific URL
// Development: Use localhost by default
let apiBaseUrl;

if (isProduction) {
  // In production, use the VITE_API_BASE_URL environment variable
  // If not set, try to use a known production URL
  apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mrei-backend-api.onrender.com/api/';
} else {
  // In development, default to localhost
  apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';
}

export const API_BASE_URL = apiBaseUrl;

// Log configuration in development
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    API_BASE_URL,
    isProduction,
    isDevelopment
  });
}

/* ============================================================================
   API ENDPOINTS
   ============================================================================
   - All endpoints use trailing slashes (Django-safe)
   - Organized by domain
   - Backward-compatible where necessary
============================================================================ */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/refresh/',
    USER: '/auth/user/',
  },

  USERS: '/users/',

  STUDENTS: {
    PROFILES: '/students/',
    LIST: '/students/',
  },

  TUTORS: {
    PROFILES: '/tutors/',
    LIST: '/tutors/',
  },

  ACADEMICS: {
    COURSES: '/academics/courses/',
    ENROLLMENTS: '/academics/enrollments/',
    ASSIGNMENTS: '/academics/assignments/',
    SUBMISSIONS: '/academics/submissions/',
    CLASS_SCHEDULES: '/academics/class-schedules/',
    ATTENDANCE: '/academics/attendance/',

    // Student-specific
    STUDENT_ENROLLMENTS: '/academics/enrollments/student/',
    STUDENT_ASSIGNMENTS: '/academics/assignments/student/',
    STUDENT_ATTENDANCE: '/academics/attendance/student/',
    STUDENT_CLASS_SCHEDULES: '/academics/class-schedules/student/',
  },

  /* =========================
     CONTENT (PUBLIC)
  ========================== */
  CONTENT: {
    OVERVIEW: '/content/',
    // Statistics endpoint - uses the working /communication/dashboard-stats
    STATISTICS: '/communication/dashboard-stats/',
    NEWS: '/content/news/',
    EVENTS: '/content/events/',
    TESTIMONIALS: '/content/testimonials/',
    CAMPUS_LIFE: '/content/campus-life/',
    HOME: '/content/home/',
    HOME_CONTENT: '/content/home/',
    CONTACT: '/communication/contact/',
    DASHBOARD_STATS: '/communication/dashboard-stats/',
    BOOKS: '/communication/books/',
  },

  /* =========================
     ADMIN DASHBOARD (NEW - points to /dashboard routes)
  ========================== */
  DASHBOARD: {
    STUDENT: '/dashboard/student/',
    TUTOR: '/dashboard/tutor/',
    ADMIN: '/dashboard/admin/',

    // New admin endpoints (matching backend-api/src/routes/dashboard.js)
    ADMIN_NEWS: '/dashboard/admin/news/',
    ADMIN_EVENTS: '/dashboard/admin/events/',
    ADMIN_TESTIMONIALS: '/dashboard/admin/testimonials/',
    ADMIN_CAMPUS_LIFE: '/dashboard/admin/campus-life/',
    ADMIN_BOOKS: '/dashboard/admin/books/',
    ADMIN_CONTACT_MESSAGES: '/dashboard/admin/contact-messages/',
  },

  /* =========================
     COMMUNICATION
  ========================== */
  COMMS: {
    CONTACT: '/communication/contact/',
    DASHBOARD_STATS: '/communication/dashboard-stats/',
  },

  /* =========================
     LIBRARY
  ========================== */
  LIBRARY: {
    BOOKS: '/communication/books/',
  },

  /* =========================
     BACKWARD COMPATIBILITY
  ========================== */
  COMMUNICATION: {
    STATISTICS: '/content/stats/',
    NEWS: '/communication/news/',
    EVENTS: '/communication/events/',
    TESTIMONIALS: '/communication/testimonials/',
    CAMPUS_LIFE: '/communication/campus-life/',
    HOME_CONTENT: '/communication/home-content/',
    CONTACT: '/communication/contact/',
    DASHBOARD_STATS: '/communication/dashboard-stats/',
    BOOKS: '/communication/books/',
  },
};

/* ============================================================================
   Legacy export (do not remove)
============================================================================ */

export const API = API_BASE_URL;
