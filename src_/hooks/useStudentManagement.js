import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../config';

export const useStudentManagement = () => {
  const queryClient = useQueryClient();

  // Get all students with enhanced data
  const {
    data: students,
    isLoading: studentsLoading,
    error: studentsError
  } = useQuery(
    'students-management',
    async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.USERS}?role=student&include_progress=true`);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Get student analytics data
  const {
    data: studentAnalytics,
    isLoading: analyticsLoading,
    error: analyticsError
  } = useQuery(
    'student-analytics',
    async () => {
      const response = await apiClient.get('/api/students/analytics/');
      return response.data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Get student progress data
  const {
    data: studentProgress,
    isLoading: progressLoading,
    error: progressError
  } = useQuery(
    'student-progress',
    async () => {
      const response = await apiClient.get('/api/students/progress/');
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Create student mutation
  const createStudentMutation = useMutation(
    async (studentData) => {
      const response = await apiClient.post(API_ENDPOINTS.USERS, {
        ...studentData,
        role: 'student'
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students-management');
        queryClient.invalidateQueries('users');
      },
    }
  );

  // Update student mutation
  const updateStudentMutation = useMutation(
    async ({ id, data }) => {
      const response = await apiClient.put(`${API_ENDPOINTS.USERS}${id}/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students-management');
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries('student-progress');
      },
    }
  );

  // Delete student mutation
  const deleteStudentMutation = useMutation(
    async (id) => {
      await apiClient.delete(`${API_ENDPOINTS.USERS}${id}/`);
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students-management');
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries('student-progress');
      },
    }
  );

  // Update student status mutation
  const updateStudentStatusMutation = useMutation(
    async ({ id, status }) => {
      const response = await apiClient.patch(`${API_ENDPOINTS.USERS}${id}/`, {
        is_active: status === 'active',
        status: status
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students-management');
      },
    }
  );

  // Get student enrollments
  const getStudentEnrollments = async (studentId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.ACADEMICS.ENROLLMENTS}?student=${studentId}&include_course=true`);
    return response.data;
  };

  // Get student assignments
  const getStudentAssignments = async (studentId) => {
    const enrollments = await getStudentEnrollments(studentId);
    const courseIds = enrollments.map(enrollment => enrollment.course);
    
    if (courseIds.length === 0) return [];
    
    const response = await apiClient.get(`${API_ENDPOINTS.ACADEMICS.ASSIGNMENTS}?course__in=${courseIds.join(',')}&include_submissions=true&student=${studentId}`);
    return response.data;
  };

  // Update student progress
  const updateStudentProgressMutation = useMutation(
    async ({ studentId, courseId, progress }) => {
      const response = await apiClient.patch(`/api/students/${studentId}/progress/`, {
        course: courseId,
        progress: progress
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('student-progress');
        queryClient.invalidateQueries('students-management');
      },
    }
  );

  // Bulk update students
  const bulkUpdateStudentsMutation = useMutation(
    async ({ studentIds, updates }) => {
      const promises = studentIds.map(id => 
        apiClient.patch(`${API_ENDPOINTS.USERS}${id}/`, updates)
      );
      const responses = await Promise.all(promises);
      return responses.map(response => response.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students-management');
        queryClient.invalidateQueries('student-progress');
      },
    }
  );

  return {
    // Data
    students: students || [],
    studentAnalytics: studentAnalytics || {},
    studentProgress: studentProgress || {},
    
    // Loading states
    studentsLoading,
    analyticsLoading,
    progressLoading,
    
    // Error states
    studentsError,
    analyticsError,
    progressError,
    
    // Actions
    createStudent: createStudentMutation.mutateAsync,
    updateStudent: updateStudentMutation.mutateAsync,
    deleteStudent: deleteStudentMutation.mutateAsync,
    updateStudentStatus: updateStudentStatusMutation.mutateAsync,
    updateStudentProgress: updateStudentProgressMutation.mutateAsync,
    bulkUpdateStudents: bulkUpdateStudentsMutation.mutateAsync,
    getStudentEnrollments,
    getStudentAssignments,
    
    // Mutation states
    creatingStudent: createStudentMutation.isLoading,
    updatingStudent: updateStudentMutation.isLoading,
    deletingStudent: deleteStudentMutation.isLoading,
    updatingStatus: updateStudentStatusMutation.isLoading,
    updatingProgress: updateStudentProgressMutation.isLoading,
    bulkUpdating: bulkUpdateStudentsMutation.isLoading,
    
    // Mutation errors
    createStudentError: createStudentMutation.error,
    updateStudentError: updateStudentMutation.error,
    deleteStudentError: deleteStudentMutation.error,
    updateStudentStatusError: updateStudentStatusMutation.error,
    updateStudentProgressError: updateStudentProgressMutation.error,
    bulkUpdateError: bulkUpdateStudentsMutation.error,
  };
};
