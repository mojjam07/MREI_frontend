import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../config';
import { useAuth } from '../../context/AuthContext';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();


  // Statistics Query
  const { data: stats, isLoading: statsLoading } = useQuery(
    'dashboard-stats',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.STATISTICS);
      return Array.isArray(response.data) ? response.data[0] : response.data || {
        active_students: 0,
        courses: 0,
        success_rate: 0,
        tutors: 0
      };
    },
    {
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );


  // Courses Query (role-based)
  const { data: courses, isLoading: coursesLoading } = useQuery(
    'courses',
    async () => {
      let endpoint = API_ENDPOINTS.ACADEMICS.COURSES;
      if (user?.role === 'student') {
        endpoint = API_ENDPOINTS.ACADEMICS.ENROLLMENTS;
      } else if (user?.role === 'tutor') {
        endpoint = `${API_ENDPOINTS.ACADEMICS.COURSES}?tutor=${user.id}`;
      }
      const response = await apiClient.get(endpoint);
      return response.data;
    },
    {
      enabled: !!user,
      staleTime: 5 * 60 * 1000,
    }
  );


  // Assignments Query (role-based)
  const { data: assignments, isLoading: assignmentsLoading } = useQuery(
    'assignments',
    async () => {
      let endpoint = API_ENDPOINTS.ACADEMICS.ASSIGNMENTS;
      if (user?.role === 'student') {
        // Get assignments for enrolled courses
        const enrollments = await apiClient.get(API_ENDPOINTS.ACADEMICS.ENROLLMENTS);
        const courseIds = enrollments.data.map(e => e.course);
        if (courseIds.length > 0) {
          endpoint += `?course__in=${courseIds.join(',')}`;
        }
      } else if (user?.role === 'tutor') {
        // Get assignments for tutor's courses
        const tutorCourses = await apiClient.get(`${API_ENDPOINTS.ACADEMICS.COURSES}?tutor=${user.id}`);
        const courseIds = tutorCourses.data.map(c => c.id);
        if (courseIds.length > 0) {
          endpoint += `?course__in=${courseIds.join(',')}`;
        }
      }
      const response = await apiClient.get(endpoint);
      return response.data;
    },
    {
      enabled: !!user,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );


  // Announcements Query
  const { data: announcements, isLoading: announcementsLoading } = useQuery(
    'announcements',
    async () => {
      const [news, events, testimonials, campusLife] = await Promise.all([
        apiClient.get(API_ENDPOINTS.COMMUNICATION.NEWS),
        apiClient.get(API_ENDPOINTS.COMMUNICATION.EVENTS),
        apiClient.get(`${API_ENDPOINTS.COMMUNICATION.TESTIMONIALS}?approved=true`),
        apiClient.get(API_ENDPOINTS.COMMUNICATION.CAMPUS_LIFE)
      ]);

      return [
        ...news.data.map(item => ({ ...item, type: 'news' })),
        ...events.data.map(item => ({ ...item, type: 'event' })),
        ...testimonials.data.map(item => ({ ...item, type: 'testimonial' })),
        ...campusLife.data.map(item => ({ ...item, type: 'campus_life' }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    {
      enabled: !!user,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );


  // Users Query (admin only)
  const { data: users, isLoading: usersLoading } = useQuery(
    'users',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS);
      return response.data;
    },
    {
      enabled: user?.role === 'admin',
      staleTime: 5 * 60 * 1000,
    }
  );


  // Mutations
  const updateStatsMutation = useMutation(
    async (newStats) => {
      const response = await apiClient.put(`${API_ENDPOINTS.COMMUNICATION.STATISTICS}1/`, newStats);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dashboard-stats');
      },
    }
  );


  const createAnnouncementMutation = useMutation(
    async ({ type, data }) => {
      let endpoint = '';
      switch (type) {
        case 'news':
          endpoint = API_ENDPOINTS.COMMUNICATION.NEWS;
          break;
        case 'event':
          endpoint = API_ENDPOINTS.COMMUNICATION.EVENTS;
          break;
        case 'testimonial':
          endpoint = API_ENDPOINTS.COMMUNICATION.TESTIMONIALS;
          break;
        case 'campus_life':
          endpoint = API_ENDPOINTS.COMMUNICATION.CAMPUS_LIFE;
          break;
        default:
          throw new Error('Invalid announcement type');
      }
      const response = await apiClient.post(endpoint, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('announcements');
      },
    }
  );


  const updateAnnouncementMutation = useMutation(
    async ({ type, id, data }) => {
      let endpoint = '';
      switch (type) {
        case 'news':
          endpoint = `${API_ENDPOINTS.COMMUNICATION.NEWS}${id}/`;
          break;
        case 'event':
          endpoint = `${API_ENDPOINTS.COMMUNICATION.EVENTS}${id}/`;
          break;
        case 'testimonial':
          endpoint = `${API_ENDPOINTS.COMMUNICATION.TESTIMONIALS}${id}/`;
          break;
        case 'campus_life':
          endpoint = `${API_ENDPOINTS.COMMUNICATION.CAMPUS_LIFE}${id}/`;
          break;
        default:
          throw new Error('Invalid announcement type');
      }
      const response = await apiClient.put(endpoint, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('announcements');
      },
    }
  );


  const deleteAnnouncementMutation = useMutation(
    async ({ type, id }) => {
      let endpoint = '';
      switch (type) {
        case 'news':
          endpoint = `${API_ENDPOINTS.COMMUNICATION.NEWS}${id}/`;
          break;
        case 'event':
          endpoint = `${API_ENDPOINTS.COMMUNICATION.EVENTS}${id}/`;
          break;
        case 'testimonial':
          endpoint = `${API_ENDPOINTS.COMMUNICATION.TESTIMONIALS}${id}/`;
          break;
        case 'campus_life':
          endpoint = `${API_ENDPOINTS.COMMUNICATION.CAMPUS_LIFE}${id}/`;
          break;
        default:
          throw new Error('Invalid announcement type');
      }
      await apiClient.delete(endpoint);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('announcements');
      },
    }
  );

  const value = {
    // Data
    stats,
    courses,
    assignments,
    announcements,
    users,

    // Loading states
    statsLoading,
    coursesLoading,
    assignmentsLoading,
    announcementsLoading,
    usersLoading,

    // Mutations
    updateStats: updateStatsMutation.mutateAsync,
    createAnnouncement: createAnnouncementMutation.mutateAsync,
    updateAnnouncement: updateAnnouncementMutation.mutateAsync,
    deleteAnnouncement: deleteAnnouncementMutation.mutateAsync,

    // Mutation states
    updatingStats: updateStatsMutation.isLoading,
    creatingAnnouncement: createAnnouncementMutation.isLoading,
    updatingAnnouncement: updateAnnouncementMutation.isLoading,
    deletingAnnouncement: deleteAnnouncementMutation.isLoading,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
