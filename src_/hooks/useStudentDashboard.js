

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export const useStudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Core data states
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [progress, setProgress] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Loading states for different operations
  const [enrolling, setEnrolling] = useState(false);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);



  // Fetch enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    try {
      const response = await apiClient.get('/students/enrollments/');
      setEnrolledCourses(response.data);
    } catch {
      setError('Failed to fetch enrolled courses');
    }
  }, []);

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    try {
      const response = await apiClient.get('/students/assignments/');
      setAssignments(response.data);
    } catch {
      setError('Failed to fetch assignments');
    }
  }, []);

  // Fetch submissions
  const fetchSubmissions = useCallback(async () => {
    try {
      const response = await apiClient.get('/students/submissions/');
      setSubmissions(response.data);
    } catch {
      setError('Failed to fetch submissions');
    }
  }, []);

  // Fetch tutors
  const fetchTutors = useCallback(async () => {
    try {
      const response = await apiClient.get('/students/tutors/');
      setTutors(response.data);
    } catch {
      setError('Failed to fetch tutors');
    }
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await apiClient.get('/students/messages/');
      setMessages(response.data);
    } catch {
      setError('Failed to fetch messages');
    }
  }, []);

  // Fetch schedule
  const fetchSchedule = useCallback(async () => {
    try {
      const response = await apiClient.get('/students/schedule/');
      setSchedule(response.data);
    } catch {
      setError('Failed to fetch schedule');
    }
  }, []);

  // Fetch progress
  const fetchProgress = useCallback(async () => {
    try {
      const response = await apiClient.get('/students/progress/');
      setProgress(response.data);
    } catch {
      setError('Failed to fetch progress');
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await apiClient.get('/students/notifications/');
      setNotifications(response.data);
    } catch {
      setError('Failed to fetch notifications');
    }
  }, []);


  // Enroll in a course
  const enrollInCourse = async (courseId) => {
    setEnrolling(true);
    try {
      await apiClient.post('/students/enrollments/', { course_id: courseId });
      await fetchEnrolledCourses();
      return true;


    } catch {
      setError('Failed to enroll in course');
      return false;
    } finally {
      setEnrolling(false);
    }
  };

  // Unenroll from a course
  const unenrollFromCourse = async (enrollmentId) => {
    setEnrolling(true);
    try {
      await apiClient.delete(`/students/enrollments/${enrollmentId}/`);
      await fetchEnrolledCourses();
      return true;


    } catch {
      setError('Failed to unenroll from course');
      return false;
    } finally {
      setEnrolling(false);
    }
  };

  // Submit assignment
  const submitAssignment = async (assignmentId, submissionData) => {
    setSubmittingAssignment(true);
    try {
      await apiClient.post(`/students/assignments/${assignmentId}/submit/`, submissionData);
      await fetchAssignments();
      await fetchSubmissions();
      return true;


    } catch {
      setError('Failed to submit assignment');
      return false;
    } finally {
      setSubmittingAssignment(false);
    }
  };

  // Upload file
  const uploadFile = async (file, type = 'assignment') => {
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await apiClient.post('/students/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;

    } catch {
      setError('Failed to upload file');
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  // Send message to tutor
  const sendMessage = async (messageData) => {
    setSendingMessage(true);
    try {
      await apiClient.post('/students/messages/', messageData);
      await fetchMessages();
      return true;

    } catch {
      setError('Failed to send message');
      return false;
    } finally {
      setSendingMessage(false);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await apiClient.patch(`/students/notifications/${notificationId}/`, { is_read: true });
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ));

    } catch {
      setError('Failed to mark notification as read');
    }
  };

  // Get assignment status
  const getAssignmentStatus = (assignmentId) => {
    const submission = submissions.find(s => s.assignment === assignmentId);
    if (!submission) return 'not_submitted';
    
    switch (submission.status) {
      case 'submitted':
        return 'submitted';
      case 'graded':
        return 'graded';
      case 'late':
        return 'late';
      default:
        return 'submitted';
    }
  };

  // Calculate course progress
  const calculateCourseProgress = (courseId) => {
    const courseAssignments = assignments.filter(a => a.course === courseId);
    const submittedAssignments = courseAssignments.filter(a => 
      submissions.some(s => s.assignment === a.id)
    );
    
    if (courseAssignments.length === 0) return 0;
    return Math.round((submittedAssignments.length / courseAssignments.length) * 100);
  };

  // Get upcoming assignments
  const getUpcomingAssignments = (limit = 5) => {
    const now = new Date();
    const upcoming = assignments
      .filter(a => new Date(a.due_date) > now)
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, limit);
    
    return upcoming.map(assignment => ({
      ...assignment,
      status: getAssignmentStatus(assignment.id),
      daysUntilDue: Math.ceil((new Date(assignment.due_date) - now) / (1000 * 60 * 60 * 24))
    }));
  };

  // Get recent activity
  const getRecentActivity = () => {
    const activities = [];
    
    // Add submission activities
    submissions.forEach(submission => {
      const assignment = assignments.find(a => a.id === submission.assignment);
      if (assignment) {
        activities.push({
          id: `submission-${submission.id}`,
          type: 'submission',
          title: `Submitted ${assignment.title}`,
          description: `Assignment for ${assignment.course?.title}`,
          timestamp: submission.submitted_at,
          status: submission.status
        });
      }
    });

    // Add enrollment activities
    enrolledCourses.forEach(enrollment => {
      activities.push({
        id: `enrollment-${enrollment.id}`,
        type: 'enrollment',
        title: `Enrolled in ${enrollment.course?.title}`,
        description: `Course enrollment`,
        timestamp: enrollment.enrolled_at,
        status: 'active'
      });
    });

    // Sort by timestamp and return recent ones
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  };

  // Get dashboard statistics
  const getDashboardStats = () => {
    const totalCourses = enrolledCourses.length;
    const totalAssignments = assignments.length;
    const submittedAssignments = submissions.length;
    const completedAssignments = submissions.filter(s => s.status === 'graded').length;
    
    const upcomingClasses = schedule.filter(s => {
      const classDate = new Date(s.date);
      const now = new Date();
      const diffDays = Math.ceil((classDate - now) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length;

    const unreadMessages = messages.filter(m => !m.is_read).length;
    const unreadNotifications = notifications.filter(n => !n.is_read).length;

    return {
      totalCourses,
      totalAssignments,
      submittedAssignments,
      completedAssignments,
      upcomingClasses,
      unreadMessages,
      unreadNotifications,
      completionRate: totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0
    };
  };




  // Load all data
  const loadDashboardData = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchEnrolledCourses(),
        fetchAssignments(),
        fetchSubmissions(),
        fetchTutors(),
        fetchMessages(),
        fetchSchedule(),
        fetchProgress(),
        fetchNotifications()
      ]);

    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [
    fetchEnrolledCourses,
    fetchAssignments,
    fetchSubmissions,
    fetchTutors,
    fetchMessages,
    fetchSchedule,
    fetchProgress,
    fetchNotifications
  ]);

  // Refresh specific data
  const refreshData = async (dataType) => {
    switch (dataType) {
      case 'courses':
        await fetchEnrolledCourses();
        break;
      case 'assignments':
        await fetchAssignments();
        await fetchSubmissions();
        break;
      case 'messages':
        await fetchMessages();
        break;
      case 'schedule':
        await fetchSchedule();
        break;
      case 'notifications':
        await fetchNotifications();
        break;
      default:
        await loadDashboardData();
    }
  };



  // Initialize data on mount
  useEffect(() => {
    if (user && user.role === 'student') {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  return {
    // Data
    enrolledCourses,
    assignments,
    submissions,
    tutors,
    messages,
    schedule,
    progress,
    notifications,
    
    // Loading states
    loading,
    error,
    enrolling,
    submittingAssignment,
    sendingMessage,
    uploadingFile,
    
    // Actions
    enrollInCourse,
    unenrollFromCourse,
    submitAssignment,
    uploadFile,
    sendMessage,
    markNotificationAsRead,
    refreshData,
    
    // Computed data
    getAssignmentStatus,
    calculateCourseProgress,
    getUpcomingAssignments,
    getRecentActivity,
    getDashboardStats
  };
};
