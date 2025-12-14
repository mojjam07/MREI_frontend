
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';

/**
 * Centralized hook for role-based data fetching
 * Provides unified interface for all role-specific data operations
 */
export const useRoleBasedData = (dataType, options = {}) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);


  const {
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
    _enableCache = true,
    ...fetchOptions
  } = options;

  // Role-based endpoint mapping
  const getEndpoint = (role, type, action = 'list') => {
    const endpoints = {
      admin: {
        tutors: { list: '/admin/tutors/', detail: '/admin/tutors/{id}/' },
        students: { list: '/admin/students/', detail: '/admin/students/{id}/' },
        courses: { list: '/admin/courses/', detail: '/admin/courses/{id}/' },
        analytics: { list: '/admin/analytics/', detail: '/admin/analytics/{id}/' },
        system: { list: '/admin/system/', detail: '/admin/system/{id}/' },
        notifications: { list: '/admin/notifications/', detail: '/admin/notifications/{id}/' }
      },
      tutor: {
        courses: { list: '/tutor/courses/', detail: '/tutor/courses/{id}/' },
        students: { list: '/tutor/students/', detail: '/tutor/students/{id}/' },
        assignments: { list: '/tutor/assignments/', detail: '/tutor/assignments/{id}/' },
        schedules: { list: '/tutor/schedules/', detail: '/tutor/schedules/{id}/' },
        messages: { list: '/tutor/messages/', detail: '/tutor/messages/{id}/' },
        analytics: { list: '/tutor/analytics/', detail: '/tutor/analytics/{id}/' }
      },
      student: {
        courses: { list: '/student/courses/', detail: '/student/courses/{id}/' },
        assignments: { list: '/student/assignments/', detail: '/student/assignments/{id}/' },
        progress: { list: '/student/progress/', detail: '/student/progress/{id}/' },
        messages: { list: '/student/messages/', detail: '/student/messages/{id}/' },
        schedules: { list: '/student/schedules/', detail: '/student/schedules/{id}/' }
      }
    };

    return endpoints[role]?.[type]?.[action] || null;
  };



  // Fetch data function
  const fetchData = useCallback(async (params = {}) => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const role = user.role?.toLowerCase();
    const endpoint = getEndpoint(role, dataType, 'list');

    if (!endpoint) {
      setError(`No endpoint found for role: ${role}, data type: ${dataType}`);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Add user-specific parameters
      const requestParams = {
        ...fetchOptions,
        ...params,
        user_id: user.id
      };

      const response = await apiClient.get(endpoint, { params: requestParams });
      
      let result = response.data;
      
      // Handle different response formats
      if (result.results) {
        result = result.results;
      } else if (!Array.isArray(result)) {
        result = [result];
      }

      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(`Error fetching ${dataType} for role ${role}:`, err);
      setError(err.response?.data?.message || err.message || `Failed to fetch ${dataType}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user, dataType, fetchOptions]);

  // Refresh data
  const refreshData = () => {
    fetchData();
  };

  // Create new item
  const createItem = async (itemData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const role = user.role?.toLowerCase();
    const endpoint = getEndpoint(role, dataType, 'create');

    if (!endpoint) {
      throw new Error(`No create endpoint found for role: ${role}, data type: ${dataType}`);
    }

    try {
      const response = await apiClient.post(endpoint, itemData);
      const newItem = response.data;

      setData(prevData => [...prevData, newItem]);
      return newItem;
    } catch (err) {
      console.error(`Error creating ${dataType}:`, err);
      throw err;
    }
  };

  // Update existing item
  const updateItem = async (id, updateData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const role = user.role?.toLowerCase();
    const endpoint = getEndpoint(role, dataType, 'update');

    if (!endpoint) {
      throw new Error(`No update endpoint found for role: ${role}, data type: ${dataType}`);
    }

    try {
      const response = await apiClient.patch(endpoint.replace('{id}', id), updateData);
      const updatedItem = response.data;

      setData(prevData => 
        prevData.map(item => item.id === id ? updatedItem : item)
      );
      return updatedItem;
    } catch (err) {
      console.error(`Error updating ${dataType}:`, err);
      throw err;
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const role = user.role?.toLowerCase();
    const endpoint = getEndpoint(role, dataType, 'delete');

    if (!endpoint) {
      throw new Error(`No delete endpoint found for role: ${role}, data type: ${dataType}`);
    }

    try {
      await apiClient.delete(endpoint.replace('{id}', id));
      setData(prevData => prevData.filter(item => item.id !== id));
    } catch (err) {
      console.error(`Error deleting ${dataType}:`, err);
      throw err;
    }
  };

  // Get single item by ID
  const getItem = async (id) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const role = user.role?.toLowerCase();
    const endpoint = getEndpoint(role, dataType, 'detail');

    if (!endpoint) {
      throw new Error(`No detail endpoint found for role: ${role}, data type: ${dataType}`);
    }

    try {
      const response = await apiClient.get(endpoint.replace('{id}', id));
      return response.data;
    } catch (err) {
      console.error(`Error fetching ${dataType} item:`, err);
      throw err;
    }
  };

  // Filter data locally
  const filterData = (filters) => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          return true;
        }
        return item[key]?.toString().toLowerCase().includes(value.toString().toLowerCase());
      });
    });
  };

  // Sort data
  const sortData = (sortBy, sortOrder = 'asc') => {
    return [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };



  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData, user, dataType]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || !user) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, user, fetchData]);

  return {
    // Data state
    data,
    loading,
    error,
    lastUpdated,

    // CRUD operations
    refreshData,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    getItem,

    // Utility functions
    filterData,
    sortData,

    // Metadata
    totalCount: data.length,
    isEmpty: data.length === 0
  };
};

// Predefined hooks for common data types
export const useAdminData = (dataType, options) => {
  return useRoleBasedData(dataType, options);
};

export const useTutorData = (dataType, options) => {
  return useRoleBasedData(dataType, options);
};

export const useStudentData = (dataType, options) => {
  return useRoleBasedData(dataType, options);
};
