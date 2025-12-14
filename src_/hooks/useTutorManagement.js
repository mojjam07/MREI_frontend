import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../config';

export const useTutorManagement = () => {
  const queryClient = useQueryClient();

  // Get all tutors with enhanced data
  const {
    data: tutors,
    isLoading: tutorsLoading,
    error: tutorsError
  } = useQuery(
    'tutors-management',
    async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.USERS}?role=tutor&include_stats=true`);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Get tutor performance metrics
  const {
    data: tutorPerformance,
    isLoading: performanceLoading,
    error: performanceError
  } = useQuery(
    'tutor-performance',
    async () => {
      const response = await apiClient.get('/api/tutors/performance/');
      return response.data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Create tutor mutation
  const createTutorMutation = useMutation(
    async (tutorData) => {
      const response = await apiClient.post(API_ENDPOINTS.USERS, {
        ...tutorData,
        role: 'tutor'
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutors-management');
        queryClient.invalidateQueries('users');
      },
    }
  );

  // Update tutor mutation
  const updateTutorMutation = useMutation(
    async ({ id, data }) => {
      const response = await apiClient.put(`${API_ENDPOINTS.USERS}${id}/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutors-management');
        queryClient.invalidateQueries('users');
      },
    }
  );

  // Delete tutor mutation
  const deleteTutorMutation = useMutation(
    async (id) => {
      await apiClient.delete(`${API_ENDPOINTS.USERS}${id}/`);
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutors-management');
        queryClient.invalidateQueries('users');
      },
    }
  );

  // Update tutor status mutation
  const updateTutorStatusMutation = useMutation(
    async ({ id, status }) => {
      const response = await apiClient.patch(`${API_ENDPOINTS.USERS}${id}/`, {
        is_active: status === 'active',
        status: status
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutors-management');
      },
    }
  );

  // Get tutor courses
  const getTutorCourses = async (tutorId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.ACADEMICS.COURSES}?tutor=${tutorId}`);
    return response.data;
  };

  // Get tutor students
  const getTutorStudents = async (tutorId) => {
    const courses = await getTutorCourses(tutorId);
    const courseIds = courses.map(course => course.id);
    
    if (courseIds.length === 0) return [];
    
    const response = await apiClient.get(`${API_ENDPOINTS.ACADEMICS.ENROLLMENTS}?course__in=${courseIds.join(',')}&include_student=true`);
    return response.data;
  };

  return {
    // Data
    tutors: tutors || [],
    tutorPerformance: tutorPerformance || {},
    
    // Loading states
    tutorsLoading,
    performanceLoading,
    
    // Error states
    tutorsError,
    performanceError,
    
    // Actions
    createTutor: createTutorMutation.mutateAsync,
    updateTutor: updateTutorMutation.mutateAsync,
    deleteTutor: deleteTutorMutation.mutateAsync,
    updateTutorStatus: updateTutorStatusMutation.mutateAsync,
    getTutorCourses,
    getTutorStudents,
    
    // Mutation states
    creatingTutor: createTutorMutation.isLoading,
    updatingTutor: updateTutorMutation.isLoading,
    deletingTutor: deleteTutorMutation.isLoading,
    updatingStatus: updateTutorStatusMutation.isLoading,
    
    // Mutation errors
    createTutorError: createTutorMutation.error,
    updateTutorError: updateTutorMutation.error,
    deleteTutorError: deleteTutorMutation.error,
    updateTutorStatusError: updateTutorStatusMutation.error,
  };
};
