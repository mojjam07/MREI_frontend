/**
 * Safe date utility functions to prevent crashes from null/undefined/malformed dates
 */

/**
 * Safely format a date string or date object
 * @param {string|Date|null|undefined} dateValue - The date value to format
 * @param {string} fallback - The fallback text to display if date is invalid
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string or fallback
 */
export const safeFormatDate = (dateValue, fallback = 'N/A', options = {}) => {
  try {
    // Handle null, undefined, or empty values
    if (!dateValue) {
      return fallback;
    }

    // Handle string dates
    if (typeof dateValue === 'string') {
      // Check if string is empty or invalid
      if (dateValue.trim() === '' || dateValue === 'null' || dateValue === 'undefined') {
        return fallback;
      }
      
      // Try to parse the date
      const parsedDate = new Date(dateValue);
      
      // Check if the parsed date is valid
      if (isNaN(parsedDate.getTime())) {
        return fallback;
      }
      
      return parsedDate.toLocaleDateString(undefined, options);
    }

    // Handle Date objects
    if (dateValue instanceof Date) {
      if (isNaN(dateValue.getTime())) {
        return fallback;
      }
      return dateValue.toLocaleDateString(undefined, options);
    }

    // Handle numbers (timestamp)
    if (typeof dateValue === 'number') {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return fallback;
      }
      return date.toLocaleDateString(undefined, options);
    }

    // Default fallback for unknown types
    return fallback;
  } catch {
    console.warn('Error formatting date:', 'Value:', dateValue);
    return fallback;
  }
};

/**
 * Safely format a date for datetime input (ISO string)
 * @param {string|Date|null|undefined} dateValue - The date value to format
 * @returns {string} ISO string or empty string
 */
export const safeFormatDateTimeInput = (dateValue) => {
  try {
    if (!dateValue) return '';
    
    if (typeof dateValue === 'string') {
      if (dateValue.trim() === '' || dateValue === 'null' || dateValue === 'undefined') {
        return '';
      }
    }
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().slice(0, 16); // Format for datetime-local input
  } catch (error) {
    console.warn('Error formatting datetime input:', error, 'Value:', dateValue);
    return '';
  }
};

/**
 * Safely get relative time (e.g., "2 days ago")
 * @param {string|Date|null|undefined} dateValue - The date value to format
 * @param {string} fallback - The fallback text to display if date is invalid
 * @returns {string} Relative time string or fallback
 */
export const safeFormatRelativeTime = (dateValue, fallback = 'N/A') => {
  try {
    if (!dateValue) return fallback;
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return fallback;
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
      }
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else {
      return safeFormatDate(dateValue, fallback);
    }
  } catch (error) {
    console.warn('Error formatting relative time:', error, 'Value:', dateValue);
    return fallback;
  }
};

/**
 * Check if a date is valid
 * @param {string|Date|null|undefined} dateValue - The date value to validate
 * @returns {boolean} True if valid date, false otherwise
 */
export const isValidDate = (dateValue) => {
  try {
    if (!dateValue) return false;
    
    const date = new Date(dateValue);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Get safe array from potentially undefined/null value
 * @param {Array|undefined|null} arrayValue - The array value to validate
 * @returns {Array} Safe array (empty array if invalid)
 */
export const safeArray = (arrayValue) => {
  return Array.isArray(arrayValue) ? arrayValue : [];
};

/**
 * Get safe string from potentially undefined/null/empty value
 * @param {string|undefined|null} stringValue - The string value to validate
 * @param {string} fallback - The fallback text to display
 * @returns {string} Safe string
 */
export const safeString = (stringValue, fallback = 'N/A') => {
  if (typeof stringValue === 'string' && stringValue.trim() !== '' && stringValue !== 'null' && stringValue !== 'undefined') {
    return stringValue.trim();
  }
  return fallback;
};

/**
 * Get safe number from potentially undefined/null/invalid value
 * @param {number|undefined|null} numberValue - The number value to validate
 * @param {number} fallback - The fallback number to use
 * @returns {number} Safe number
 */
export const safeNumber = (numberValue, fallback = 0) => {
  if (typeof numberValue === 'number' && !isNaN(numberValue)) {
    return numberValue;
  }
  return fallback;
};

export default {
  safeFormatDate,
  safeFormatDateTimeInput,
  safeFormatRelativeTime,
  isValidDate,
  safeArray,
  safeString,
  safeNumber
};
