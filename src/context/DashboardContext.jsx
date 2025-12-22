import React, { createContext, useContext } from 'react';
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
      try {
        const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.STATISTICS);
        return Array.isArray(response.data) ? response.data[0] : response.data;
      } catch (error) {
        console.warn(`Dashboard stats endpoint not available: ${error.message}. Returning default data.`);
        return {
          active_students: 0,
          courses: 0,
          success_rate: 0,
          tutors: 0
        };
      }
    },
    {
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Student Dashboard Analytics (Student role only)
  const { data: studentDashboard, isLoading: studentDashboardLoading } = useQuery(
    'student-dashboard',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.STUDENT);
        return response.data;
      } catch (error) {
        console.warn(`Student dashboard endpoint not available: ${error.message}. Returning default data.`);
        return {
          total_courses: 0,
          completed_assignments: 0,
          pending_assignments: 0,
          upcoming_classes: []
        }; // Fallback for missing endpoint
      }
    },
    {
      enabled: user?.role === 'student',
      staleTime: 2 * 60 * 1000, // 2 minutes for student dashboard
    }
  );

  // Courses Query (role-based)
  const { data: courses, isLoading: coursesLoading } = useQuery(
    'courses',
    async () => {
      try {
        let endpoint = API_ENDPOINTS.ACADEMICS.COURSES;
        if (user?.role === 'student') {
          endpoint = API_ENDPOINTS.ACADEMICS.STUDENT_ENROLLMENTS;
        } else if (user?.role === 'tutor') {
          endpoint = `${API_ENDPOINTS.ACADEMICS.COURSES}?tutor=${user.id}`;
        }
        const response = await apiClient.get(endpoint);
        // Handle different response formats
        if (user?.role === 'student') {
          return response.data.success ? response.data.data : response.data;
        }
        return response.data;
      } catch (error) {
        console.warn(`Courses endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: !!user,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Class Schedules Query (Student role only)
  const { data: classSchedules, isLoading: classSchedulesLoading } = useQuery(
    'class-schedules',
    async () => {
      try {
        const endpoint = user?.role === 'student' 
          ? API_ENDPOINTS.ACADEMICS.STUDENT_CLASS_SCHEDULES
          : API_ENDPOINTS.ACADEMICS.CLASS_SCHEDULES;
        const response = await apiClient.get(endpoint);
        return response.data.success ? response.data.data : response.data;
      } catch (error) {
        console.warn(`Class schedules endpoint not available: ${error.message}. Returning empty array.`);
        return []; // Fallback for missing endpoint
      }
    },
    {
      enabled: !!user,
      staleTime: 10 * 60 * 1000,
    }
  );

  // Attendance Query (Student role only)
  const { data: attendance, isLoading: attendanceLoading } = useQuery(
    'attendance',
    async () => {
      try {
        const endpoint = user?.role === 'student' 
          ? API_ENDPOINTS.ACADEMICS.STUDENT_ATTENDANCE
          : API_ENDPOINTS.ACADEMICS.ATTENDANCE;
        const response = await apiClient.get(endpoint);
        return response.data.success ? response.data.data : response.data;
      } catch (error) {
        console.warn(`Attendance endpoint not available: ${error.message}. Returning empty array.`);
        return []; // Fallback for missing endpoint
      }
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
      try {
        let endpoint = API_ENDPOINTS.ACADEMICS.ASSIGNMENTS;
        if (user?.role === 'student') {
          // Use student-specific endpoint that returns assignments for enrolled courses
          endpoint = API_ENDPOINTS.ACADEMICS.STUDENT_ASSIGNMENTS;
          const response = await apiClient.get(endpoint);
          return response.data.success ? response.data.data : response.data;
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
      } catch (error) {
        console.warn(`Assignments endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: !!user,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  // Separate content type queries
  const { data: news, isLoading: newsLoading } = useQuery(
    'news',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.NEWS);
        return response.data;
      } catch (error) {
        console.warn(`News endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: !!user,
      staleTime: 10 * 60 * 1000,
    }
  );

  const { data: events, isLoading: eventsLoading } = useQuery(
    'events',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.EVENTS);
        return response.data;
      } catch (error) {
        console.warn(`Events endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: !!user,
      staleTime: 10 * 60 * 1000,
    }
  );

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery(
    'testimonials',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.TESTIMONIALS);
        return response.data;
      } catch (error) {
        console.warn(`Testimonials endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: !!user,
      staleTime: 10 * 60 * 1000,
    }
  );

  // All testimonials for admin (including pending)
  const { data: allTestimonials, isLoading: allTestimonialsLoading } = useQuery(
    'all-testimonials',
    async () => {
      try {
        const response = await apiClient.get(`${API_ENDPOINTS.COMMUNICATION.TESTIMONIALS}`);
        return response.data;
      } catch (error) {
        console.warn(`All testimonials endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: user?.role === 'admin',
      staleTime: 2 * 60 * 1000,
    }
  );

  // Pending testimonials for admin approval
  const { data: pendingTestimonials, isLoading: pendingTestimonialsLoading } = useQuery(
    'pending-testimonials',
    async () => {
      try {
        const response = await apiClient.get(`${API_ENDPOINTS.COMMUNICATION.TESTIMONIALS}?approved=false`);
        return response.data;
      } catch (error) {
        console.warn(`Pending testimonials endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: user?.role === 'admin',
      staleTime: 1 * 60 * 1000,
    }
  );

  const { data: campusLife, isLoading: campusLifeLoading } = useQuery(
    'campus-life',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.CAMPUS_LIFE);
        return response.data;
      } catch (error) {
        console.warn(`Campus life endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: !!user,
      staleTime: 10 * 60 * 1000,
    }
  );

  // Legacy combined announcements for backward compatibility
  const announcements = React.useMemo(() => {
    if (!news || !events || !testimonials || !campusLife) return [];
    
    return [
      ...news.map(item => ({ ...item, type: 'news' })),
      ...events.map(item => ({ ...item, type: 'event' })),
      ...testimonials.map(item => ({ ...item, type: 'testimonial' })),
      ...campusLife.map(item => ({ ...item, type: 'campus_life' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [news, events, testimonials, campusLife]);

  const announcementsLoading = newsLoading || eventsLoading || testimonialsLoading || campusLifeLoading;

  // Users Query (admin only)
  const { data: users, isLoading: usersLoading } = useQuery(
    'users',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.USERS);
        return response.data;
      } catch (error) {
        console.warn(`Users endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: user?.role === 'admin',
      staleTime: 5 * 60 * 1000,
    }
  );

  // Student Profiles Query (admin only)
  const { data: studentProfiles, isLoading: studentProfilesLoading } = useQuery(
    'student-profiles',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.STUDENTS.PROFILES);
        return response.data;
      } catch (error) {
        console.warn(`Student profiles endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: user?.role === 'admin',
      staleTime: 5 * 60 * 1000,
    }
  );

  // Tutor Profiles Query (admin only)
  const { data: tutorProfiles, isLoading: tutorProfilesLoading } = useQuery(
    'tutor-profiles',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.TUTORS.PROFILES);
        return response.data;
      } catch (error) {
        console.warn(`Tutor profiles endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
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

  // Tutor Dashboard Analytics Query
  const { data: tutorDashboard, isLoading: tutorDashboardLoading } = useQuery(
    'tutor-dashboard',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.TUTOR);
        return response.data;
      } catch (error) {
        console.warn(`Tutor dashboard endpoint not available: ${error.message}. Returning default data.`);
        return {
          total_courses: 0,
          total_students: 0,
          pending_assignments: 0,
          recent_submissions: []
        }; // Fallback for missing endpoint
      }
    },
    {
      enabled: user?.role === 'tutor',
      staleTime: 2 * 60 * 1000,
    }
  );

  // Pending Submissions Query  
  const { data: pendingSubmissions, isLoading: pendingSubmissionsLoading } = useQuery(
    'pending-submissions',
    async () => {
      try {
        const response = await apiClient.get(`${API_ENDPOINTS.ACADEMICS.SUBMISSIONS}?grade__isnull=true`);
        return response.data;
      } catch (error) {
        console.warn(`Pending submissions endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: user?.role === 'tutor',
      staleTime: 1 * 60 * 1000,
    }
  );

  // Grade Submission Mutation
  const gradeSubmissionMutation = useMutation(
    async ({ submissionId, grade, feedback }) => {
      const response = await apiClient.post(`${API_ENDPOINTS.ACADEMICS.SUBMISSIONS}${submissionId}/grade/`, {
        grade,
        feedback
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pending-submissions');
        queryClient.invalidateQueries('submissions');
        queryClient.invalidateQueries('tutor-dashboard');
      },
    }
  );

  // Class Schedules Query (Tutor role only)
  const { data: tutorClassSchedules, isLoading: tutorClassSchedulesLoading } = useQuery(
    'class-schedules-tutor',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ACADEMICS.CLASS_SCHEDULES);
        return response.data;
      } catch (error) {
        console.warn(`Tutor class schedules endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: user?.role === 'tutor',
      staleTime: 10 * 60 * 1000,
    }
  );

  // Student mutations
  const createStudentMutation = useMutation(
    async (studentData) => {
      const response = await apiClient.post(API_ENDPOINTS.STUDENTS.PROFILES, studentData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('student-profiles');
        queryClient.invalidateQueries('users');
      },
    }
  );

  const updateStudentMutation = useMutation(
    async ({ id, data }) => {
      const response = await apiClient.put(`${API_ENDPOINTS.STUDENTS.PROFILES}${id}/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('student-profiles');
        queryClient.invalidateQueries('users');
      },
    }
  );

  const deleteStudentMutation = useMutation(
    async (id) => {
      await apiClient.delete(`${API_ENDPOINTS.STUDENTS.PROFILES}${id}/`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('student-profiles');
        queryClient.invalidateQueries('users');
      },
    }
  );

  // Tutor mutations
  const createTutorMutation = useMutation(
    async (tutorData) => {
      const response = await apiClient.post(API_ENDPOINTS.TUTORS.PROFILES, tutorData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutor-profiles');
        queryClient.invalidateQueries('users');
      },
    }
  );

  const updateTutorMutation = useMutation(
    async ({ id, data }) => {
      const response = await apiClient.put(`${API_ENDPOINTS.TUTORS.PROFILES}${id}/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutor-profiles');
        queryClient.invalidateQueries('users');
      },
    }
  );

  const deleteTutorMutation = useMutation(
    async (id) => {
      await apiClient.delete(`${API_ENDPOINTS.TUTORS.PROFILES}${id}/`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tutor-profiles');
        queryClient.invalidateQueries('users');
      },
    }
  );

  // Testimonial approval mutations
  const approveTestimonialMutation = useMutation(
    async (id) => {
      const response = await apiClient.post(`${API_ENDPOINTS.COMMUNICATION.TESTIMONIALS}${id}/approve/`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('testimonials');
        queryClient.invalidateQueries('pending-testimonials');
        queryClient.invalidateQueries('all-testimonials');
      },
    }
  );

  const unapproveTestimonialMutation = useMutation(
    async (id) => {
      const response = await apiClient.post(`${API_ENDPOINTS.COMMUNICATION.TESTIMONIALS}${id}/unapprove/`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('testimonials');
        queryClient.invalidateQueries('pending-testimonials');
        queryClient.invalidateQueries('all-testimonials');
      },
    }
  );

  const toggleTestimonialApprovalMutation = useMutation(
    async (id) => {
      const response = await apiClient.patch(`${API_ENDPOINTS.COMMUNICATION.TESTIMONIALS}${id}/toggle_approval/`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('testimonials');
        queryClient.invalidateQueries('pending-testimonials');
        queryClient.invalidateQueries('all-testimonials');
      },
    }
  );

  // Contact messages management (for admin)
  const { data: contactMessages, isLoading: contactMessagesLoading } = useQuery(
    'contact-messages',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.CONTACT);
        return response.data;
      } catch (error) {
        console.warn(`Contact messages endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: user?.role === 'admin',
      staleTime: 2 * 60 * 1000,
    }
  );


  const { data: unreadMessages, isLoading: unreadMessagesLoading } = useQuery(
    'unread-messages',
    async () => {
      try {
        const response = await apiClient.get(`${API_ENDPOINTS.COMMUNICATION.CONTACT}?read=false`);
        return response.data;
      } catch (error) {
        console.warn(`Unread messages endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: user?.role === 'admin',
      staleTime: 1 * 60 * 1000,
    }
  );

  // Books Query (for all authenticated users to ensure DigitalBookshelf sync)
  const { data: books, isLoading: booksLoading } = useQuery(
    'books',
    async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COMMUNICATION.BOOKS);
        return response.data;
      } catch (error) {
        console.warn(`Books endpoint not available: ${error.message}. Returning empty array.`);
        return [];
      }
    },
    {
      enabled: !!user,  // Enable for all authenticated users
      staleTime: 5 * 60 * 1000,
    }
  );

  // Contact message mutations
  const markMessageReadMutation = useMutation(
    async (id) => {
      const response = await apiClient.post(`${API_ENDPOINTS.COMMUNICATION.CONTACT}${id}/mark_read/`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('contact-messages');
        queryClient.invalidateQueries('unread-messages');
      },
    }
  );

  const markMessageRepliedMutation = useMutation(
    async (id) => {
      const response = await apiClient.post(`${API_ENDPOINTS.COMMUNICATION.CONTACT}${id}/mark_replied/`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('contact-messages');
        queryClient.invalidateQueries('unread-messages');
      },
    }
  );


  const deleteContactMessageMutation = useMutation(
    async (id) => {
      await apiClient.delete(`${API_ENDPOINTS.COMMUNICATION.CONTACT}${id}/`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('contact-messages');
        queryClient.invalidateQueries('unread-messages');
      },
    }
  );

  // Book mutations
  const createBookMutation = useMutation(
    async (bookData) => {
      const response = await apiClient.post(API_ENDPOINTS.COMMUNICATION.BOOKS, bookData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books');
      },
    }
  );

  const updateBookMutation = useMutation(
    async ({ id, data }) => {
      const response = await apiClient.put(`${API_ENDPOINTS.COMMUNICATION.BOOKS}${id}/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books');
      },
    }
  );

  const deleteBookMutation = useMutation(
    async (id) => {
      await apiClient.delete(`${API_ENDPOINTS.COMMUNICATION.BOOKS}${id}/`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books');
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
    
    // Student Dashboard Analytics
    studentDashboard,
    classSchedules,
    attendance,
    
    // Separate content data
    news,
    events,
    testimonials,
    campusLife,

    // Student and Tutor data
    studentProfiles,
    tutorProfiles,

    // Tutor-specific data
    tutorDashboard,
    pendingSubmissions,
    tutorClassSchedules,


    // Admin-specific data
    allTestimonials,
    pendingTestimonials,
    contactMessages,
    unreadMessages,
    books,

    // Loading states
    statsLoading,
    coursesLoading,
    assignmentsLoading,
    announcementsLoading,
    usersLoading,
    newsLoading,
    eventsLoading,
    testimonialsLoading,
    campusLifeLoading,
    studentProfilesLoading,
    tutorProfilesLoading,
    studentDashboardLoading,
    classSchedulesLoading,
    attendanceLoading,
    tutorDashboardLoading,
    pendingSubmissionsLoading,
    tutorClassSchedulesLoading,
    allTestimonialsLoading,
    pendingTestimonialsLoading,
    contactMessagesLoading,

    unreadMessagesLoading,
    booksLoading,

    // Mutations
    updateStats: updateStatsMutation.mutateAsync,
    createAnnouncement: createAnnouncementMutation.mutateAsync,
    updateAnnouncement: updateAnnouncementMutation.mutateAsync,
    deleteAnnouncement: deleteAnnouncementMutation.mutateAsync,
    
    // Student mutations
    createStudent: createStudentMutation.mutateAsync,
    updateStudent: updateStudentMutation.mutateAsync,
    deleteStudent: deleteStudentMutation.mutateAsync,
    
    // Tutor mutations
    createTutor: createTutorMutation.mutateAsync,
    updateTutor: updateTutorMutation.mutateAsync,
    deleteTutor: deleteTutorMutation.mutateAsync,
    gradeSubmission: gradeSubmissionMutation.mutateAsync,

    // Testimonial approval mutations
    approveTestimonial: approveTestimonialMutation.mutateAsync,
    unapproveTestimonial: unapproveTestimonialMutation.mutateAsync,
    toggleTestimonialApproval: toggleTestimonialApprovalMutation.mutateAsync,


    // Contact message mutations
    markMessageRead: markMessageReadMutation.mutateAsync,
    markMessageReplied: markMessageRepliedMutation.mutateAsync,
    deleteContactMessage: deleteContactMessageMutation.mutateAsync,

    // Book mutations
    createBook: createBookMutation.mutateAsync,
    updateBook: updateBookMutation.mutateAsync,
    deleteBook: deleteBookMutation.mutateAsync,


    // Mutation states
    updatingStats: updateStatsMutation.isLoading,
    creatingAnnouncement: createAnnouncementMutation.isLoading,
    updatingAnnouncement: updateAnnouncementMutation.isLoading,
    deletingAnnouncement: deleteAnnouncementMutation.isLoading,
    creatingStudent: createStudentMutation.isLoading,
    updatingStudent: updateStudentMutation.isLoading,
    deletingStudent: deleteStudentMutation.isLoading,
    creatingTutor: createTutorMutation.isLoading,
    updatingTutor: updateTutorMutation.isLoading,
    deletingTutor: deleteTutorMutation.isLoading,
    gradingSubmission: gradeSubmissionMutation.isLoading,
    approvingTestimonial: approveTestimonialMutation.isLoading,
    unapprovingTestimonial: unapproveTestimonialMutation.isLoading,
    togglingTestimonialApproval: toggleTestimonialApprovalMutation.isLoading,
    markingMessageRead: markMessageReadMutation.isLoading,
    markingMessageReplied: markMessageRepliedMutation.isLoading,
    deletingContactMessage: deleteContactMessageMutation.isLoading,
    creatingBook: createBookMutation.isLoading,
    updatingBook: updateBookMutation.isLoading,
    deletingBook: deleteBookMutation.isLoading,
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
