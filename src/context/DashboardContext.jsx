import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
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
  const { data: stats, isLoading: statsLoading } = useQuery(
    'dashboard-stats',
    async () => {
      const res = await apiClient.get(API_ENDPOINTS.CONTENT.STATISTICS);
      return res.data;
    },
    { enabled: !!user }
  );

  /* =========================
     CONTENT (PUBLIC)
  ========================== */
  const newsQuery = useQuery(
    'news',
    async () => (await apiClient.get(API_ENDPOINTS.CONTENT.NEWS)).data,
    { enabled: !!user }
  );

  const eventsQuery = useQuery(
    'events',
    async () => (await apiClient.get(API_ENDPOINTS.CONTENT.EVENTS)).data,
    { enabled: !!user }
  );

  const testimonialsQuery = useQuery(
    'testimonials',
    async () => (await apiClient.get(API_ENDPOINTS.CONTENT.TESTIMONIALS)).data,
    { enabled: !!user }
  );

  const campusLifeQuery = useQuery(
    'campus-life',
    async () => (await apiClient.get(API_ENDPOINTS.CONTENT.CAMPUS_LIFE)).data,
    { enabled: !!user }
  );

  /* =========================
     ADMIN CONTENT QUERIES
  ========================== */
  const adminNewsQuery = useQuery(
    'admin-news',
    async () => (await apiClient.get('/dashboard/admin/news/')).data,
    { enabled: user?.role === 'admin' }
  );

  const adminEventsQuery = useQuery(
    'admin-events',
    async () => (await apiClient.get('/dashboard/admin/events/')).data,
    { enabled: user?.role === 'admin' }
  );

  const adminTestimonialsQuery = useQuery(
    'admin-testimonials',
    async () => (await apiClient.get('/dashboard/admin/testimonials/')).data,
    { enabled: user?.role === 'admin' }
  );

  const adminCampusLifeQuery = useQuery(
    'admin-campus-life',
    async () => (await apiClient.get('/dashboard/admin/campus-life/')).data,
    { enabled: user?.role === 'admin' }
  );

  /* =========================
     BOOKS (DIGITAL BOOKSHELF)
  ========================== */
  const booksQuery = useQuery(
    'books',
    async () => (await apiClient.get(API_ENDPOINTS.LIBRARY.BOOKS)).data,
    { 
      enabled: !!user,
      retry: (failureCount, error) => {
        // Don't retry on 404 or authentication errors
        if (error.response?.status === 404 || error.response?.status === 401) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  );

  // Books mutations
  const createBookMutation = useMutation(
    (data) => {
      // Handle FormData for file uploads
      if (data instanceof FormData) {
        return apiClient.post(API_ENDPOINTS.LIBRARY.BOOKS, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      return apiClient.post(API_ENDPOINTS.LIBRARY.BOOKS, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books');
      },
      onError: (error) => {
        console.error('Failed to create book:', error);
      },
    }
  );

  const updateBookMutation = useMutation(
    ({ id, data }) => {
      // Handle FormData for file uploads
      if (data instanceof FormData) {
        return apiClient.put(`${API_ENDPOINTS.LIBRARY.BOOKS}${id}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      return apiClient.put(`${API_ENDPOINTS.LIBRARY.BOOKS}${id}/`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books');
      },
      onError: (error) => {
        console.error('Failed to update book:', error);
      },
    }
  );

  const deleteBookMutation = useMutation(
    (id) => apiClient.delete(`${API_ENDPOINTS.LIBRARY.BOOKS}${id}/`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books');
      },
      onError: (error) => {
        console.error('Failed to delete book:', error);
      },
    }
  );

  /* =========================
     ADMIN MUTATIONS (JSON ONLY)
  ========================== */

  // NEWS
  const createNews = useMutation(
    (data) => apiClient.post('/dashboard/admin/news/', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-news');
        queryClient.invalidateQueries('news');
      },
    }
  );

  const updateNews = useMutation(
    ({ id, data }) => apiClient.put(`/dashboard/admin/news/${id}/`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-news');
        queryClient.invalidateQueries('news');
      },
    }
  );

  const deleteNews = useMutation(
    (id) => apiClient.delete(`/dashboard/admin/news/${id}/`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-news');
        queryClient.invalidateQueries('news');
      },
    }
  );

  // EVENTS
  const createEvent = useMutation(
    (data) => apiClient.post('/dashboard/admin/events/', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-events');
        queryClient.invalidateQueries('events');
      },
    }
  );

  const updateEvent = useMutation(
    ({ id, data }) => apiClient.put(`/dashboard/admin/events/${id}/`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-events');
        queryClient.invalidateQueries('events');
      },
    }
  );

  const deleteEvent = useMutation(
    (id) => apiClient.delete(`/dashboard/admin/events/${id}/`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-events');
        queryClient.invalidateQueries('events');
      },
    }
  );

  // TESTIMONIALS
  const createTestimonial = useMutation(
    (data) => apiClient.post('/dashboard/admin/testimonials/', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-testimonials');
        queryClient.invalidateQueries('testimonials');
      },
    }
  );

  const updateTestimonial = useMutation(
    ({ id, data }) => apiClient.put(`/dashboard/admin/testimonials/${id}/`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-testimonials');
        queryClient.invalidateQueries('testimonials');
      },
    }
  );

  const deleteTestimonial = useMutation(
    (id) => apiClient.delete(`/dashboard/admin/testimonials/${id}/`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-testimonials');
        queryClient.invalidateQueries('testimonials');
      },
    }
  );

  // CAMPUS LIFE
  const createCampusLife = useMutation(
    (data) => apiClient.post('/dashboard/admin/campus-life/', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-campus-life');
        queryClient.invalidateQueries('campus-life');
      },
    }
  );

  const updateCampusLife = useMutation(
    ({ id, data }) => apiClient.put(`/dashboard/admin/campus-life/${id}/`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-campus-life');
        queryClient.invalidateQueries('campus-life');
      },
    }
  );

  const deleteCampusLife = useMutation(
    (id) => apiClient.delete(`/dashboard/admin/campus-life/${id}/`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-campus-life');
        queryClient.invalidateQueries('campus-life');
      },
    }
  );

  /* =========================
     CONTEXT VALUE
  ========================== */
  const value = {
    // Data
    stats,
    news: newsQuery.data,
    events: eventsQuery.data,
    testimonials: testimonialsQuery.data,
    campusLife: campusLifeQuery.data,

    // Books data
    books: booksQuery.data?.data?.books || booksQuery.data?.books || booksQuery.data || [],

    adminNews: adminNewsQuery.data,
    adminEvents: adminEventsQuery.data,
    adminTestimonials: adminTestimonialsQuery.data,
    adminCampusLife: adminCampusLifeQuery.data,

    // Loading states
    statsLoading,
    newsLoading: newsQuery.isLoading,
    eventsLoading: eventsQuery.isLoading,
    testimonialsLoading: testimonialsQuery.isLoading,
    campusLifeLoading: campusLifeQuery.isLoading,

    // Books loading states
    booksLoading: booksQuery.isLoading,
    creatingBook: createBookMutation.isLoading,
    updatingBook: updateBookMutation.isLoading,
    deletingBook: deleteBookMutation.isLoading,

    adminNewsLoading: adminNewsQuery.isLoading,
    adminEventsLoading: adminEventsQuery.isLoading,
    adminTestimonialsLoading: adminTestimonialsQuery.isLoading,
    adminCampusLifeLoading: adminCampusLifeQuery.isLoading,

    // Mutations
    createNews: createNews.mutateAsync,
    updateNews: updateNews.mutateAsync,
    deleteNews: deleteNews.mutateAsync,

    createEvent: createEvent.mutateAsync,
    updateEvent: updateEvent.mutateAsync,
    deleteEvent: deleteEvent.mutateAsync,

    createTestimonial: createTestimonial.mutateAsync,
    updateTestimonial: updateTestimonial.mutateAsync,
    deleteTestimonial: deleteTestimonial.mutateAsync,

    createCampusLife: createCampusLife.mutateAsync,
    updateCampusLife: updateCampusLife.mutateAsync,
    deleteCampusLife: deleteCampusLife.mutateAsync,

    // Books mutations
    createBook: createBookMutation.mutateAsync,
    updateBook: updateBookMutation.mutateAsync,
    deleteBook: deleteBookMutation.mutate,
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
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
