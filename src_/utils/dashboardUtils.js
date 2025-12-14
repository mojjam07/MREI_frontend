import { apiClient } from '../services/apiClient';

/**
 * Dashboard utility functions
 * These are separated to avoid Fast Refresh issues in DashboardContext
 */

// Fetch dashboard data based on user role
export const fetchDashboardData = async (user) => {
  if (!user) {
    return {
      stats: null,
      announcements: [],
      users: [],
      loading: false,
      error: null
    };
  }

  try {
    // Fetch announcements (common for all users)
    const announcementsResponse = await apiClient.get('/api/announcements/');
    const announcements = announcementsResponse.data || [];

    let stats = null;
    let users = [];

    // Fetch stats based on user role
    if (user.role === 'admin') {
      const statsResponse = await apiClient.get('/api/admin/dashboard-stats/');
      stats = statsResponse.data;

      // Fetch users for admin
      const usersResponse = await apiClient.get('/api/users/');
      users = usersResponse.data?.results || usersResponse.data || [];
    } else {
      // For tutors and students, fetch role-specific stats
      const endpoint = user.role === 'tutor' ? '/api/tutors/dashboard-stats/' : '/api/students/dashboard-stats/';
      const statsResponse = await apiClient.get(endpoint);
      stats = statsResponse.data;
    }

    return {
      stats,
      announcements,
      users,
      loading: false,
      error: null
    };
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return {
      stats: null,
      announcements: [],
      users: [],
      loading: false,
      error: err.message || 'Failed to fetch dashboard data'
    };
  }
};

// Update dashboard stats
export const updateStats = async (newStats) => {
  try {
    const response = await apiClient.patch('/api/admin/dashboard-stats/', newStats);
    return response.data;
  } catch (err) {
    console.error('Error updating stats:', err);
    throw err;
  }
};

// Create announcement
export const createAnnouncement = async (announcementData) => {
  try {
    const response = await apiClient.post('/api/announcements/', announcementData);
    return response.data;
  } catch (err) {
    console.error('Error creating announcement:', err);
    throw err;
  }
};

// Update announcement
export const updateAnnouncement = async ({ id, data: updateData }) => {
  try {
    const response = await apiClient.put(`/api/announcements/${id}/`, updateData);
    return response.data;
  } catch (err) {
    console.error('Error updating announcement:', err);
    throw err;
  }
};

// Delete announcement
export const deleteAnnouncement = async (announcementId) => {
  try {
    await apiClient.delete(`/api/announcements/${announcementId}/`);
    return true;
  } catch (err) {
    console.error('Error deleting announcement:', err);
    throw err;
  }
};
