// Constants extracted from context files to avoid Fast Refresh violations

// Auth context constants
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token'
};

export const AUTH_API_ENDPOINTS = {
  USER: '/api/auth/user/',
  LOGIN: '/api/auth/login/',
  REGISTER: '/api/auth/register/',
  REFRESH: '/api/auth/refresh/'
};

// Dashboard context constants
export const DASHBOARD_API_ENDPOINTS = {
  ADMIN_STATS: '/api/admin/dashboard-stats/',
  TUTOR_STATS: '/api/tutors/dashboard-stats/',
  STUDENT_STATS: '/api/students/dashboard-stats/',
  ANNOUNCEMENTS: '/api/announcements/',
  USERS: '/api/users/'
};

// Notification context constants
export const NOTIFICATION_TYPES = {
  ALL: 'all',
  ANNOUNCEMENT: 'announcement',
  ASSIGNMENT: 'assignment',
  MESSAGE: 'message',
  SYSTEM: 'system'
};

export const NOTIFICATION_PRIORITIES = {
  ALL: 'all',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const NOTIFICATION_STATUS = {
  ALL: 'all',
  READ: 'read',
  UNREAD: 'unread'
};

export const NOTIFICATION_DEFAULTS = {
  AUTO_CLOSE_DURATION: 5000,
  POLLING_INTERVAL: 30000
};

// Language context constants
export const LANGUAGE_DIRECTIONS = {
  EN: 'ltr',
  AR: 'rtl'
};

export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'ar'];

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred',
  AUTH_FAILED: 'Authentication failed',
  PERMISSION_DENIED: 'Permission denied',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error occurred'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  SAVE_SUCCESS: 'Data saved successfully',
  DELETE_SUCCESS: 'Item deleted successfully',
  UPDATE_SUCCESS: 'Data updated successfully'
};
