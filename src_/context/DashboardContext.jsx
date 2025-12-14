



import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '../services/apiClient';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Individual loading states
  const [statsLoading, setStatsLoading] = useState(true);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);



  // Action loading states
  const [_updatingStats, _setUpdatingStats] = useState(false);
  const [creatingAnnouncement, setCreatingAnnouncement] = useState(false);
  const [_updatingAnnouncement, _setUpdatingAnnouncement] = useState(false);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(false);


  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setStatsLoading(false);
      setAnnouncementsLoading(false);
      setUsersLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch announcements (common for all users)
      setAnnouncementsLoading(true);
      const announcementsResponse = await apiClient.get('/api/announcements/');
      setAnnouncements(announcementsResponse.data || []);
      setAnnouncementsLoading(false);

      // Fetch stats based on user role
      if (user.role === 'admin') {
        setStatsLoading(true);
        const statsResponse = await apiClient.get('/api/admin/dashboard-stats/');
        setStats(statsResponse.data);
        setStatsLoading(false);

        // Fetch users for admin
        setUsersLoading(true);
        const usersResponse = await apiClient.get('/api/users/');
        setUsers(usersResponse.data?.results || usersResponse.data || []);
        setUsersLoading(false);
      } else {
        // For tutors and students, fetch role-specific stats
        setStatsLoading(true);
        const endpoint = user.role === 'tutor' ? '/api/tutors/dashboard-stats/' : '/api/students/dashboard-stats/';
        const statsResponse = await apiClient.get(endpoint);
        setStats(statsResponse.data);
        setStatsLoading(false);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');

      // Set default empty data on error
      setStats(null);
      setAnnouncements([]);
      setUsers([]);
      setStatsLoading(false);
      setAnnouncementsLoading(false);
      setUsersLoading(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateStats = async (newStats) => {
    try {
      const response = await apiClient.patch('/api/admin/dashboard-stats/', newStats);
      setStats(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating stats:', err);
      throw err;
    }
  };

  const createAnnouncement = async (announcementData) => {
    try {
      setCreatingAnnouncement(true);
      const response = await apiClient.post('/api/announcements/', announcementData);
      setAnnouncements(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating announcement:', err);
      throw err;
    } finally {
      setCreatingAnnouncement(false);
    }
  };


  const updateAnnouncement = async ({ id, data: updateData }) => {
    try {
      const response = await apiClient.put(`/api/announcements/${id}/`, updateData);
      setAnnouncements(prev => prev.map(item => item.id === id ? response.data : item));
      return response.data;
    } catch (err) {
      console.error('Error updating announcement:', err);
      throw err;
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    try {
      setDeletingAnnouncement(true);
      await apiClient.delete(`/api/announcements/${announcementId}/`);
      setAnnouncements(prev => prev.filter(item => item.id !== announcementId));
    } catch (err) {
      console.error('Error deleting announcement:', err);
      throw err;
    } finally {
      setDeletingAnnouncement(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, [user, fetchDashboardData]);

  const value = {
    // Data
    stats,
    announcements,
    users,

    // States
    loading,
    error,

    // Individual loading states
    statsLoading,
    announcementsLoading,
    usersLoading,


    // Action loading states
    _updatingStats,
    creatingAnnouncement,
    _updatingAnnouncement,
    deletingAnnouncement,

    // Actions
    updateStats,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    refreshData: fetchDashboardData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Combined provider that handles role-based context switching
export const CombinedDashboardProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  // Show loading spinner while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  // If no user, render children without dashboard context
  if (!user) {
    return children;
  }

  // Wrap with DashboardProvider for authenticated users
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
};


