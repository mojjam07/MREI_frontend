import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../config';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  /* =========================
     DASHBOARD / STATS
  ========================== */
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.CONTENT.STATISTICS);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch dashboard stats:', error);
        return { data: { statistics: {} } };
      }
    },
    enabled: !!user,
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  /* =========================
     CONTENT (PUBLIC)
  ========================== */
  const newsQuery = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.COMMUNICATION.NEWS);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch news:', error);
        return { data: { news: [] } };
      }
    },
    enabled: !!user,
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.COMMUNICATION.EVENTS);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch events:', error);
        return { data: { events: [] } };
      }
    },
    enabled: !!user,
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const testimonialsQuery = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.COMMUNICATION.TESTIMONIALS);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch testimonials:', error);
        return { data: { testimonials: [] } };
      }
    },
    enabled: !!user,
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const campusLifeQuery = useQuery({
    queryKey: ['campus-life'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.COMMUNICATION.CAMPUS_LIFE);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch campus life:', error);
        return { data: { campus_life: [] } };
      }
    },
    enabled: !!user,
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  /* =========================
     ADMIN CONTENT QUERIES
  ========================== */
  const adminNewsQuery = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN_NEWS);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch admin news:', error);
        return { data: { news: [] } };
      }
    },
    enabled: user?.role === 'admin',
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const adminEventsQuery = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN_EVENTS);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch admin events:', error);
        return { data: { events: [] } };
      }
    },
    enabled: user?.role === 'admin',
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const adminTestimonialsQuery = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN_TESTIMONIALS);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch admin testimonials:', error);
        return { data: { testimonials: [] } };
      }
    },
    enabled: user?.role === 'admin',
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const adminCampusLifeQuery = useQuery({
    queryKey: ['admin-campus-life'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN_CAMPUS_LIFE);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch admin campus life:', error);
        return { data: { campus_life: [] } };
      }
    },
    enabled: user?.role === 'admin',
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const adminStudentsQuery = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/dashboard/admin/students');
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch admin students:', error);
        return { data: { students: [] } };
      }
    },
    enabled: user?.role === 'admin',
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const adminTutorsQuery = useQuery({
    queryKey: ['admin-tutors'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/dashboard/admin/tutors');
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch admin tutors:', error);
        return { data: { tutors: [] } };
      }
    },
    enabled: user?.role === 'admin',
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const adminContactMessagesQuery = useQuery({
    queryKey: ['admin-contact-messages'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN_CONTACT_MESSAGES);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch admin contact messages:', error);
        return { data: { contact_messages: [] } };
      }
    },
    enabled: user?.role === 'admin',
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const adminLibraryQuery = useQuery({
    queryKey: ['admin-library'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN_BOOKS);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch admin library:', error);
        return { data: { library: [] } };
      }
    },
    enabled: user?.role === 'admin',
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  /* =========================
     BOOKS (DIGITAL BOOKSHELF)
  ========================== */
  const booksQuery = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.LIBRARY.BOOKS);
        return res.data;
      } catch (error) {
        console.warn('Failed to fetch books:', error);
        return { data: { books: [] } };
      }
    },
    enabled: !!user,
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const createBookMutation = useMutation({
    mutationFn: async (data) => {
      try {
        if (data instanceof FormData) {
          const res = await apiClient.post(API_ENDPOINTS.LIBRARY.BOOKS, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return res.data;
        }
        const res = await apiClient.post(API_ENDPOINTS.LIBRARY.BOOKS, data);
        return res.data;
      } catch (error) {
        console.error('Failed to create book:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        if (data instanceof FormData) {
          const res = await apiClient.put(`${API_ENDPOINTS.LIBRARY.BOOKS}${id}/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return res.data;
        }
        const res = await apiClient.put(`${API_ENDPOINTS.LIBRARY.BOOKS}${id}/`, data);
        return res.data;
      } catch (error) {
        console.error('Failed to update book:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await apiClient.delete(`${API_ENDPOINTS.LIBRARY.BOOKS}${id}/`);
        return res.data;
      } catch (error) {
        console.error('Failed to delete book:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  /* =========================
     ADMIN MUTATIONS (JSON ONLY)
  ========================== */
  const createNews = useMutation({
    mutationFn: (data) => apiClient.post(`${API_ENDPOINTS.DASHBOARD.ADMIN_NEWS}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });

  const updateNews = useMutation({
    mutationFn: ({ id, data }) => apiClient.put(`${API_ENDPOINTS.DASHBOARD.ADMIN_NEWS}${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });

  const deleteNews = useMutation({
    mutationFn: (id) => apiClient.delete(`${API_ENDPOINTS.DASHBOARD.ADMIN_NEWS}${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });

  const createEvent = useMutation({
    mutationFn: (data) => apiClient.post(`${API_ENDPOINTS.DASHBOARD.ADMIN_EVENTS}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const updateEvent = useMutation({
    mutationFn: ({ id, data }) => apiClient.put(`${API_ENDPOINTS.DASHBOARD.ADMIN_EVENTS}${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: (id) => apiClient.delete(`${API_ENDPOINTS.DASHBOARD.ADMIN_EVENTS}${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const createTestimonial = useMutation({
    mutationFn: (data) => apiClient.post(`${API_ENDPOINTS.DASHBOARD.ADMIN_TESTIMONIALS}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  const updateTestimonial = useMutation({
    mutationFn: ({ id, data }) => apiClient.put(`${API_ENDPOINTS.DASHBOARD.ADMIN_TESTIMONIALS}${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  const deleteTestimonial = useMutation({
    mutationFn: (id) => apiClient.delete(`${API_ENDPOINTS.DASHBOARD.ADMIN_TESTIMONIALS}${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  const createCampusLife = useMutation({
    mutationFn: (data) => apiClient.post(`${API_ENDPOINTS.DASHBOARD.ADMIN_CAMPUS_LIFE}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campus-life'] });
      queryClient.invalidateQueries({ queryKey: ['campus-life'] });
    },
  });

  const updateCampusLife = useMutation({
    mutationFn: ({ id, data }) => apiClient.put(`${API_ENDPOINTS.DASHBOARD.ADMIN_CAMPUS_LIFE}${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campus-life'] });
      queryClient.invalidateQueries({ queryKey: ['campus-life'] });
    },
  });

  const deleteCampusLife = useMutation({
    mutationFn: (id) => apiClient.delete(`${API_ENDPOINTS.DASHBOARD.ADMIN_CAMPUS_LIFE}${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campus-life'] });
      queryClient.invalidateQueries({ queryKey: ['campus-life'] });
    },
  });

  const updateContactMessage = useMutation({
    mutationFn: ({ id, data }) => apiClient.put(`${API_ENDPOINTS.DASHBOARD.ADMIN_CONTACT_MESSAGES}${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => apiClient.put(`${API_ENDPOINTS.DASHBOARD.ADMIN_CONTACT_MESSAGES}${id}/`, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] });
    },
  });

  const replyContactMessage = useMutation({
    mutationFn: ({ id, reply }) => apiClient.post(`${API_ENDPOINTS.DASHBOARD.ADMIN_CONTACT_MESSAGES}${id}/reply`, { reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] });
    },
  });

  const deleteContactMessage = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await apiClient.delete(`${API_ENDPOINTS.DASHBOARD.ADMIN_CONTACT_MESSAGES}${id}/`);
        return res.data;
      } catch (error) {
        // Handle "message not found" gracefully - it may have already been deleted
        const errorData = error.response?.data;
        if (errorData?.error_code === 'MESSAGE_NOT_FOUND') {
          console.warn('Contact message was already deleted or does not exist:', id);
          // Return a special flag to indicate the message was already gone
          return {
            success: true,
            deleted: false,
            message: errorData.message,
            already_deleted: true
          };
        }
        console.error('Failed to delete contact message:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Only invalidate queries if actually deleted
      if (data?.deleted) {
        queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] });
      }
    },
  });

  /* =========================
     CONTEXT VALUE
  ========================== */
  const safeExtractData = (data, primaryPath, fallbackPaths = []) => {
    if (!data) return [];
    let result = primaryPath.split('.').reduce((obj, key) => obj?.[key], data);
    if (result && Array.isArray(result)) return result;
    for (const path of fallbackPaths) {
      result = path.split('.').reduce((obj, key) => obj?.[key], data);
      if (result && Array.isArray(result)) return result;
    }
    if (Array.isArray(data)) return data;
    return [];
  };

  const safeExtractStats = (data) => {
    if (!data) return {};
    return data?.data?.statistics || data?.statistics || data?.data || data || {};
  };

  const value = {
    stats: safeExtractStats(stats),
    news: safeExtractData(newsQuery.data, 'data.news', ['data.data.news', 'news', 'data']),
    events: safeExtractData(eventsQuery.data, 'data.events', ['data.data.events', 'events', 'data']),
    testimonials: safeExtractData(testimonialsQuery.data, 'data.testimonials', ['data.data.testimonials', 'testimonials', 'data']),
    campusLife: safeExtractData(campusLifeQuery.data, 'data.campus_life', ['data.data.campus_life', 'campus_life', 'data']),
    books: safeExtractData(booksQuery.data, 'data.books', ['data.data.books', 'data', 'books']),
    adminNews: safeExtractData(adminNewsQuery.data, 'data.news', ['data.data.news', 'news']),
    adminEvents: safeExtractData(adminEventsQuery.data, 'data.events', ['data.data.events', 'events']),
    adminTestimonials: safeExtractData(adminTestimonialsQuery.data, 'data.testimonials', ['data.data.testimonials', 'testimonials']),
    adminCampusLife: safeExtractData(adminCampusLifeQuery.data, 'data.campus_life', ['data.data.campus_life', 'campus_life']),
    students: safeExtractData(adminStudentsQuery.data, 'data.students', ['data.data.students', 'students']),
    tutors: safeExtractData(adminTutorsQuery.data, 'data.tutors', ['data.data.tutors', 'tutors']),
    contactMessages: safeExtractData(adminContactMessagesQuery.data, 'data.contact_messages', ['data.data.contact_messages', 'contact_messages']),
    library: safeExtractData(adminLibraryQuery.data, 'data.library', ['data.data.library', 'library']),
    pendingTestimonials: (() => {
      try {
        const testimonials = safeExtractData(adminTestimonialsQuery.data, 'data.testimonials', ['data.data.testimonials', 'testimonials']);
        return testimonials.filter(t => t && t.status === 'pending') || [];
      } catch (error) {
        console.warn('Error filtering pending testimonials:', error);
        return [];
      }
    })(),
    unreadMessages: (() => {
      try {
        const messages = safeExtractData(adminContactMessagesQuery.data, 'data.contact_messages', ['data.data.contact_messages', 'contact_messages']);
        return messages.filter(m => m && !m.is_read) || [];
      } catch (error) {
        console.warn('Error filtering unread messages:', error);
        return [];
      }
    })(),
    statsLoading: statsLoading || false,
    newsLoading: newsQuery.isLoading || false,
    eventsLoading: eventsQuery.isLoading || false,
    testimonialsLoading: testimonialsQuery.isLoading || false,
    campusLifeLoading: campusLifeQuery.isLoading || false,
    booksLoading: booksQuery.isLoading || false,
    creatingBook: createBookMutation.isLoading || false,
    updatingBook: updateBookMutation.isLoading || false,
    deletingBook: deleteBookMutation.isLoading || false,
    adminNewsLoading: adminNewsQuery.isLoading || false,
    adminEventsLoading: adminEventsQuery.isLoading || false,
    adminTestimonialsLoading: adminTestimonialsQuery.isLoading || false,
    adminCampusLifeLoading: adminCampusLifeQuery.isLoading || false,
    studentProfilesLoading: adminStudentsQuery.isLoading || false,
    tutorProfilesLoading: adminTutorsQuery.isLoading || false,
    contactMessagesLoading: adminContactMessagesQuery.isLoading || false,
    libraryLoading: adminLibraryQuery.isLoading || false,
    createNews: async (...args) => {
      try { return await createNews.mutateAsync(...args); } catch (error) { console.error('Create news failed:', error); throw error; }
    },
    updateNews: async (...args) => {
      try { return await updateNews.mutateAsync(...args); } catch (error) { console.error('Update news failed:', error); throw error; }
    },
    deleteNews: async (...args) => {
      try { return await deleteNews.mutateAsync(...args); } catch (error) { console.error('Delete news failed:', error); throw error; }
    },
    createEvent: async (...args) => {
      try { return await createEvent.mutateAsync(...args); } catch (error) { console.error('Create event failed:', error); throw error; }
    },
    updateEvent: async (...args) => {
      try { return await updateEvent.mutateAsync(...args); } catch (error) { console.error('Update event failed:', error); throw error; }
    },
    deleteEvent: async (...args) => {
      try { return await deleteEvent.mutateAsync(...args); } catch (error) { console.error('Delete event failed:', error); throw error; }
    },
    createTestimonial: async (...args) => {
      try { return await createTestimonial.mutateAsync(...args); } catch (error) { console.error('Create testimonial failed:', error); throw error; }
    },
    updateTestimonial: async (...args) => {
      try { return await updateTestimonial.mutateAsync(...args); } catch (error) { console.error('Update testimonial failed:', error); throw error; }
    },
    deleteTestimonial: async (...args) => {
      try { return await deleteTestimonial.mutateAsync(...args); } catch (error) { console.error('Delete testimonial failed:', error); throw error; }
    },
    createCampusLife: async (...args) => {
      try { return await createCampusLife.mutateAsync(...args); } catch (error) { console.error('Create campus life failed:', error); throw error; }
    },
    updateCampusLife: async (...args) => {
      try { return await updateCampusLife.mutateAsync(...args); } catch (error) { console.error('Update campus life failed:', error); throw error; }
    },
    deleteCampusLife: async (...args) => {
      try { return await deleteCampusLife.mutateAsync(...args); } catch (error) { console.error('Delete campus life failed:', error); throw error; }
    },
    createBook: async (...args) => {
      try { return await createBookMutation.mutateAsync(...args); } catch (error) { console.error('Create book failed:', error); throw error; }
    },
    updateBook: async (...args) => {
      try { return await updateBookMutation.mutateAsync(...args); } catch (error) { console.error('Update book failed:', error); throw error; }
    },
    deleteBook: (...args) => {
      try { return deleteBookMutation.mutate(...args); } catch (error) { console.error('Delete book failed:', error); throw error; }
    },
    updateContactMessage: async (...args) => {
      try { return await updateContactMessage.mutateAsync(...args); } catch (error) { console.error('Update contact message failed:', error); throw error; }
    },
    markAsRead: async (...args) => {
      try { return await markAsReadMutation.mutateAsync(...args); } catch (error) { console.error('Mark as read failed:', error); throw error; }
    },
    replyContactMessage: async (...args) => {
      try { return await replyContactMessage.mutateAsync(...args); } catch (error) { console.error('Reply contact message failed:', error); throw error; }
    },
    deleteContactMessage: async (...args) => {
      try { return await deleteContactMessage.mutateAsync(...args); } catch (error) { console.error('Delete contact message failed:', error); throw error; }
    },
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  return useContext(DashboardContext) || {};
};

