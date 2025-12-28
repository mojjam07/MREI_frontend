
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// // const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// // export const API_BASE_URL = baseUrl;

// export const API_ENDPOINTS = {
//   AUTH: {
//     LOGIN: '/auth/login',
//     REGISTER: '/auth/register',
//     REFRESH: '/auth/refresh',
//     USER: '/auth/user'
//   },
//   USERS: '/users',
//   STUDENTS: {
//     PROFILES: '/students',
//     LIST: '/students'
//   },
//   TUTORS: {
//     PROFILES: '/tutors',
//     LIST: '/tutors'
//   },
//   ACADEMICS: {
//     COURSES: '/academics/courses',
//     ENROLLMENTS: '/academics/enrollments',
//     ASSIGNMENTS: '/academics/assignments',
//     SUBMISSIONS: '/academics/submissions',
//     CLASS_SCHEDULES: '/academics/class-schedules',
//     ATTENDANCE: '/academics/attendance',
//     // Student-specific endpoints
//     STUDENT_ENROLLMENTS: '/academics/enrollments/student',
//     STUDENT_ASSIGNMENTS: '/academics/assignments/student',
//     STUDENT_ATTENDANCE: '/academics/attendance/student',
//     STUDENT_CLASS_SCHEDULES: '/academics/class-schedules/student'
//   },

//   COMMUNICATION: {
//     // Content endpoints - MOVED to /content/ for proper separation
//     // Keeping for backward compatibility during migration
//     STATISTICS: '/content/stats',      // Was: /communication/statistics
//     NEWS: '/content/news',             // Was: /communication/news  
//     EVENTS: '/content/events',         // Was: /communication/events
//     TESTIMONIALS: '/content/testimonials', // Was: /communication/testimonials
//     CAMPUS_LIFE: '/content/campus-life',   // Was: /communication/campus-life
//     HOME_CONTENT: '/content/home',     // Was: /communication/home-content
    
//     // Communication endpoints - REMAIN in /communication/
//     CONTACT: '/communication/contact',
//     DASHBOARD_STATS: '/communication/dashboard-stats',
//     BOOKS: '/communication/books'
//   },

//   // NEW: Dedicated content endpoints for better organization
//   CONTENT: {
//     OVERVIEW: '/content',
//     STATISTICS: '/content/stats',
//     NEWS: '/content/news',
//     EVENTS: '/content/events', 
//     TESTIMONIALS: '/content/testimonials',
//     CAMPUS_LIFE: '/content/campus-life',
//     HOME: '/content/home'
//   },

//   // REMAINING COMMUNICATION endpoints (true communication features)
//   COMMS: {
//     CONTACT: '/communication/contact',
//     DASHBOARD_STATS: '/communication/dashboard-stats'
//   },
  
//   // LIBRARY endpoints for book management
//   LIBRARY: {
//     BOOKS: '/communication/books'
//   },
//   DASHBOARD: {
//     STUDENT: '/dashboard/student',
//     TUTOR: '/dashboard/tutor',
//     ADMIN: '/dashboard/admin'
//   }
// };

// // Legacy export for backward compatibility
// export const API = API_BASE_URL;

/* ============================================================================
   API BASE CONFIG
   ============================================================================
   - Safe fallback to prevent UI crash
   - Vite-compatible env loading
   - Django REST friendly
============================================================================ */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';

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
    STATISTICS: '/content/stats/',
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
     ADMIN DASHBOARD
  ========================== */
  DASHBOARD: {
    STUDENT: '/dashboard/student/',
    TUTOR: '/dashboard/tutor/',
    ADMIN: '/dashboard/admin/',

    ADMIN_NEWS: '/dashboard/admin/news/',
    ADMIN_EVENTS: '/dashboard/admin/events/',
    ADMIN_TESTIMONIALS: '/dashboard/admin/testimonials/',
    ADMIN_CAMPUS_LIFE: '/dashboard/admin/campus-life/',
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
    NEWS: '/content/news/',
    EVENTS: '/content/events/',
    TESTIMONIALS: '/content/testimonials/',
    CAMPUS_LIFE: '/content/campus-life/',
    HOME_CONTENT: '/content/home/',
    CONTACT: '/communication/contact/',
    DASHBOARD_STATS: '/communication/dashboard-stats/',
    BOOKS: '/communication/books/',
  },
};

/* ============================================================================
   Legacy export (do not remove)
============================================================================ */

export const API = API_BASE_URL;
