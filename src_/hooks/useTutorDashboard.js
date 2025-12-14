
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../config';

export const useTutorDashboard = () => {
  const queryClient = useQueryClient();

  // Get tutor's courses
  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError
  } = useQuery(
    'tutor-courses',
    async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.TUTOR.COURSES}?include_enrollments=true&include_assignments=true`);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Get tutor's assignments
  const {
    data: assignments,
    isLoading: assignmentsLoading,
    error: assignmentsError
  } = useQuery(
    'tutor-assignments',
    async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.TUTOR.ASSIGNMENTS}?include_submissions=true&include_course=true`);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );


  // Get tutor's students (from course enrollments)
  const {
    data: students,
    isLoading: studentsLoading,
    error: studentsError
  } = useQuery(
    'tutor-students',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.TUTOR.STUDENTS_API);
      return response.data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Get class schedules
  const {
    data: schedules,
    isLoading: schedulesLoading,
    error: schedulesError
  } = useQuery(
    'tutor-schedules',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.TUTOR.SCHEDULES_API);
      return response.data;
    },
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
    }
  );

  // Get messages and communications
  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError
  } = useQuery(
    'tutor-messages',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.TUTOR.MESSAGES_API);
      return response.data;
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
    }
  );

  // Get performance analytics
  const {
    data: performanceAnalytics,
    isLoading: performanceLoading,
    error: performanceError
  } = useQuery(
    'tutor-performance',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.TUTOR.PERFORMANCE_API);
      return response.data;
    },
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  // Create assignment mutation
  const createAssignmentMutation = useMutation(
    async (assignmentData) => {
      const response = await apiClient.post(API_ENDPOINTS.TUTOR.ASSIGNMENTS, assignmentData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutor-assignments');
        queryClient.invalidateQueries('tutor-courses');
      },
    }
  );

  // Update assignment mutation
  const updateAssignmentMutation = useMutation(
    async ({ id, data }) => {
      const response = await apiClient.put(`${API_ENDPOINTS.TUTOR.ASSIGNMENTS}${id}/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutor-assignments');
      },
    }
  );

  // Grade submission mutation
  const gradeSubmissionMutation = useMutation(
    async ({ submissionId, grade, feedback }) => {
      const endpoint = API_ENDPOINTS.GENERAL.SUBMISSIONS_GRADE.replace('{id}', submissionId);
      const response = await apiClient.patch(endpoint, {
        grade,
        feedback
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutor-assignments');
        queryClient.invalidateQueries('tutor-performance');
      },
    }
  );

  // Create schedule mutation
  const createScheduleMutation = useMutation(
    async (scheduleData) => {
      const response = await apiClient.post(API_ENDPOINTS.TUTOR.SCHEDULES_API, scheduleData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutor-schedules');
      },
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    async (messageData) => {
      const response = await apiClient.post(API_ENDPOINTS.TUTOR.MESSAGES_API, messageData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutor-messages');
      },
    }
  );

  // Mark message as read mutation
  const markMessageAsReadMutation = useMutation(
    async (messageId) => {
      const endpoint = API_ENDPOINTS.GENERAL.MESSAGES_READ.replace('{id}', messageId);
      const response = await apiClient.patch(endpoint);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutor-messages');
      },
    }
  );

  // Calculate dashboard stats
  const calculateStats = () => {
    const totalCourses = courses?.length || 0;
    const totalStudents = students?.length || 0;
    const totalAssignments = assignments?.length || 0;
    const gradedSubmissions = assignments?.reduce((total, assignment) => {
      return total + (assignment.submissions?.filter(s => s.grade).length || 0);
    }, 0) || 0;
    const totalSubmissions = assignments?.reduce((total, assignment) => {
      return total + (assignment.submissions?.length || 0);
    }, 0) || 0;
    const completionRate = totalSubmissions > 0 ? Math.round((gradedSubmissions / totalSubmissions) * 100) : 0;

    return {
      totalCourses,
      totalStudents,
      totalAssignments,
      gradedSubmissions,
      totalSubmissions,
      completionRate,
      pendingGrading: totalSubmissions - gradedSubmissions
    };
  };

  // Get recent activity
  const getRecentActivity = () => {
    const activities = [];
    
    // Recent submissions
    assignments?.forEach(assignment => {
      assignment.submissions?.forEach(submission => {
        if (submission.created_at) {
          activities.push({
            id: `submission-${submission.id}`,
            type: 'submission',
            title: `New submission for ${assignment.title}`,
            student: submission.student_name || 'Unknown Student',
            course: assignment.course?.title || 'Unknown Course',
            timestamp: submission.created_at,
            priority: 'normal'
          });
        }
      });
    });

    // Recent messages
    messages?.forEach(message => {
      if (message.created_at && !message.is_read) {
        activities.push({
          id: `message-${message.id}`,
          type: 'message',
          title: `New message from ${message.sender_name || 'Unknown'}`,
          content: message.content?.substring(0, 50) + '...',
          timestamp: message.created_at,
          priority: 'high'
        });
      }
    });

    // Sort by timestamp
    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
  };

  const stats = calculateStats();
  const recentActivity = getRecentActivity();

  return {
    // Data
    courses: courses || [],
    assignments: assignments || [],
    students: students || [],
    schedules: schedules || [],
    messages: messages || [],
    performanceAnalytics: performanceAnalytics || {},
    stats,
    recentActivity,
    
    // Loading states
    coursesLoading,
    assignmentsLoading,
    studentsLoading,
    schedulesLoading,
    messagesLoading,
    performanceLoading,
    
    // Error states
    coursesError,
    assignmentsError,
    studentsError,
    schedulesError,
    messagesError,
    performanceError,
    
    // Actions
    createAssignment: createAssignmentMutation.mutateAsync,
    updateAssignment: updateAssignmentMutation.mutateAsync,
    gradeSubmission: gradeSubmissionMutation.mutateAsync,
    createSchedule: createScheduleMutation.mutateAsync,
    sendMessage: sendMessageMutation.mutateAsync,
    markMessageAsRead: markMessageAsReadMutation.mutateAsync,
    
    // Mutation states
    creatingAssignment: createAssignmentMutation.isLoading,
    updatingAssignment: updateAssignmentMutation.isLoading,
    gradingSubmission: gradeSubmissionMutation.isLoading,
    creatingSchedule: createScheduleMutation.isLoading,
    sendingMessage: sendMessageMutation.isLoading,
    markingMessageAsRead: markMessageAsReadMutation.isLoading,
    
    // Mutation errors
    createAssignmentError: createAssignmentMutation.error,
    updateAssignmentError: updateAssignmentMutation.error,
    gradeSubmissionError: gradeSubmissionMutation.error,
    createScheduleError: createScheduleMutation.error,
    sendMessageError: sendMessageMutation.error,
    markMessageAsReadError: markMessageAsReadMutation.error,
    
    // Overall loading state
    isLoading: coursesLoading || assignmentsLoading || studentsLoading || 
               schedulesLoading || messagesLoading || performanceLoading,
  };
};

