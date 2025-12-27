import React, { useState, useEffect } from 'react';
import { BookOpen, Users, FileText, TrendingUp, Calendar, Award, LayoutDashboard, Settings, BarChart3, ClipboardList, GraduationCap, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import SubmissionCard from '../components/tutor/SubmissionCard';
import DashboardFooter from '../components/layout/DashboardFooter';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import DashboardSkeleton from '../components/ui/DashboardSkeleton';

const TutorDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Active tab state for navigation
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null); // Add error state

  const {
    tutorDashboard,
    pendingSubmissions,
    tutorClassSchedules,
    courses,
    assignments,
    coursesLoading,
    assignmentsLoading,
    tutorDashboardLoading,
    pendingSubmissionsLoading,
    tutorClassSchedulesLoading,
    gradeSubmission,
    gradingSubmission
  } = useDashboard();

  // Add error handling effect with timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      const stillLoading = tutorDashboardLoading ||
                          coursesLoading ||
                          assignmentsLoading ||
                          pendingSubmissionsLoading ||
                          tutorClassSchedulesLoading;

      if (stillLoading) {
        setError('Failed to load dashboard data. Please check your connection.');
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [tutorDashboardLoading, coursesLoading, assignmentsLoading, pendingSubmissionsLoading, tutorClassSchedulesLoading]);

  // Clear error when data loads successfully
  useEffect(() => {
    if (!tutorDashboardLoading && !coursesLoading && !assignmentsLoading) {
      setError(null);
    }
  }, [tutorDashboardLoading, coursesLoading, assignmentsLoading]);

  // Transform backend data to component format
  const transformedTutorData = tutorDashboard?.data ? {
    totalCourses: tutorDashboard.data.statistics?.total_courses || tutorDashboard.data.totalCourses || 0,
    totalStudents: tutorDashboard.data.statistics?.total_students || tutorDashboard.data.totalStudents || 0,
    totalAssignments: tutorDashboard.data.statistics?.total_assignments || tutorDashboard.data.totalAssignments || 0,
    totalSubmissions: tutorDashboard.data.statistics?.total_submissions || tutorDashboard.data.totalSubmissions || 0,
    pendingGrading: tutorDashboard.data.statistics?.pending_submissions || tutorDashboard.data.pendingGrading || 0,
    averageScore: Math.round((tutorDashboard.data.statistics?.average_score || tutorDashboard.data.averageScore || 0) * 10) / 10,
    coursesTaught: tutorDashboard.data.courses || tutorDashboard.data.coursesTaught || [],
    pendingSubmissionsList: tutorDashboard.data.pending_submissions || tutorDashboard.data.pendingSubmissionsList || [],
    upcomingAssignments: tutorDashboard.data.upcoming_assignments || tutorDashboard.data.upcomingAssignments || [],
    recentActivity: tutorDashboard.data.recent_activity || tutorDashboard.data.recentActivity || []
  } : {
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
    pendingGrading: 0,
    averageScore: 0,
    coursesTaught: [],
    pendingSubmissionsList: [],
    upcomingAssignments: [],
    recentActivity: []
  };

  // Enhanced stats from backend analytics
  const stats = [
    {
      icon: BookOpen,
      title: t('tutor.stats.courses'),
      value: transformedTutorData.totalCourses.toString(),
      change: t('tutor.statChanges.coursesTeaching'),
      color: 'blue'
    },
    {
      icon: Users,
      title: t('tutor.stats.students'),
      value: transformedTutorData.totalStudents.toString(),
      change: t('tutor.statChanges.totalEnrolled'),
      color: 'green'
    },
    {
      icon: FileText,
      title: t('tutor.pendingGrading'),
      value: transformedTutorData.pendingGrading.toString(),
      change: t('tutor.statChanges.submissionsToGrade'),
      color: 'orange'
    },
    {
      icon: Calendar,
      title: t('tutor.upcomingClasses'),
      value: transformedTutorData.upcomingAssignments.length.toString(),
      change: t('tutor.statChanges.classesScheduled'),
      color: 'purple'
    }
  ];

  // Handler for grade submission
  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    await gradeSubmission(submissionId, grade, feedback);
  };

  // Student Performance Analytics
  const calculateCoursePerformance = (course, assignments, submissions) => {
    const courseAssignments = assignments?.filter(a => a.course === course.id) || [];
    const courseSubmissions = submissions?.filter(s => 
      courseAssignments.some(a => a.id === s.assignment)
    ) || [];
    
    const gradedSubmissions = courseSubmissions.filter(s => s.grade !== null);
    const completionRate = courseAssignments.length > 0 
      ? (gradedSubmissions.length / courseAssignments.length) * 100 
      : 0;
    
    const avgGrade = gradedSubmissions.length > 0
      ? gradedSubmissions.reduce((sum, s) => sum + parseFloat(s.grade), 0) / gradedSubmissions.length
      : 0;
    
    return {
      totalAssignments: courseAssignments.length,
      submittedAssignments: courseSubmissions.length,
      gradedAssignments: gradedSubmissions.length,
      completionRate: Math.round(completionRate),
      avgGrade: Math.round(avgGrade)
    };
  };


  // Main loading state with dark masking
  const isMainLoading = coursesLoading || assignmentsLoading || tutorDashboardLoading;

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--accent-color)'}}>
      {/* Header */}
      <header className="shadow-sm border-b" style={{backgroundColor: 'var(--primary-color)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8" style={{color: 'var(--tertiary-color)'}} />
              <h1 className="text-2xl font-bold" style={{color: 'var(--light-text)'}}>{t('tutor.dashboard')}</h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button className="p-2 rounded-lg transition-all hover:scale-105 hover-glow" style={{color: 'var(--tertiary-color)'}}>
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Main Content */}
      {isMainLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Navigation Tabs */}
            <div className="rounded-lg shadow-sm mb-6 p-2 flex flex-wrap gap-2 hover-lift" style={{backgroundColor: 'var(--tertiary-color)'}}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'overview' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'overview' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'overview' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'overview') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'overview') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <BarChart3 className="w-4 h-4" />
            {t('tutor.tabs.overview')}
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'courses' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'courses' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'courses' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'courses') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'courses') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <BookOpen className="w-4 h-4" />
            {t('tutor.tabs.courses')}
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'assignments' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'assignments' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'assignments' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'assignments') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'assignments') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <ClipboardList className="w-4 h-4" />
            {t('tutor.tabs.assignments')}
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'submissions' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'submissions' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'submissions' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'submissions') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'submissions') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <FileText className="w-4 h-4" />
            {t('tutor.tabs.submissions')}
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'schedule' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'schedule' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'schedule' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'schedule') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'schedule') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <Calendar className="w-4 h-4" />
            {t('tutor.tabs.schedule')}
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'students' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'students' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'students' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'students') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'students') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <Users className="w-4 h-4" />
            {t('tutor.tabs.students')}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
              activeTab === 'analytics' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'analytics' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'analytics' ? 'var(--light-text)' : 'var(--text-color)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'analytics') {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.color = 'var(--primary-color)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'analytics') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-color)';
              }
            }}
          >
            <TrendingUp className="w-4 h-4" />
            {t('tutor.tabs.analytics')}
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--tertiary-color)'}}>
              <h2 className="text-2xl font-bold mb-4 animate-scale-in" style={{color: 'var(--primary-color)'}}>
                {t('tutor.welcome.title', { name: user?.first_name?.split(' ')[0] || user?.username })}
              </h2>
              <p style={{color: 'var(--text-color)'}}>
                {t('tutor.welcome.description')}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  icon={stat.icon}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  color={stat.color}
                />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--tertiary-color)'}}>
              <h3 className="text-xl font-bold mb-4" style={{color: 'var(--primary-color)'}}>{t('tutor.quickActions.title')}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="p-4 rounded-lg border-2 hover:scale-105 transition-all hover-glow" style={{borderColor: 'var(--primary-color)'}}>
                  <BookOpen className="w-6 h-6 mx-auto mb-2" style={{color: 'var(--primary-color)'}} />
                  <span style={{color: 'var(--text-color)'}}>{t('tutor.quickActions.createAssignment')}</span>
                </button>
                <button className="p-4 rounded-lg border-2 hover:scale-105 transition-all hover-glow" style={{borderColor: 'var(--primary-color)'}}>
                  <FileText className="w-6 h-6 mx-auto mb-2" style={{color: 'var(--primary-color)'}} />
                  <span style={{color: 'var(--text-color)'}}>{t('tutor.quickActions.gradeSubmissions')}</span>
                </button>
                <button className="p-4 rounded-lg border-2 hover:scale-105 transition-all hover-glow" style={{borderColor: 'var(--primary-color)'}}>
                  <Calendar className="w-6 h-6 mx-auto mb-2" style={{color: 'var(--primary-color)'}} />
                  <span style={{color: 'var(--text-color)'}}>{t('tutor.quickActions.scheduleClass')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--tertiary-color)'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('tutor.courses.title')}</h2>
              <button className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow" style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}>
                <BookOpen className="w-4 h-4" />
                {t('tutor.courses.manageCourses')}
              </button>
            </div>

            <div className="space-y-4">
              {coursesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto" style={{borderColor: 'var(--primary-color)'}}></div>
                  <p className="mt-2" style={{color: 'var(--text-color)'}}>{t('tutor.courses.loading')}</p>
                </div>
              ) : courses && courses.length > 0 ? (
                courses.map(course => (
                  <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-all hover-lift" style={{borderColor: 'var(--primary-color)'}}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold" style={{color: 'var(--primary-color)'}}>{course.title}</h4>
                      <span className="text-sm" style={{color: 'var(--text-color)'}}>{course.code}</span>
                    </div>
                    <p className="text-sm mb-3" style={{color: 'var(--text-color)'}}>{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{color: 'var(--text-color)'}}>
                        {t('tutor.courses.enrolledStudents', { count: course.enrollments?.length || 0 })}
                      </span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm rounded hover:scale-105 transition-all" style={{backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)'}}>
                          {t('tutor.courses.viewDetails')}
                        </button>
                        <button className="px-3 py-1 text-sm rounded hover:scale-105 transition-all" style={{backgroundColor: 'var(--tertiary-color)', color: 'var(--primary-color)'}}>
                          {t('tutor.courses.edit')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p style={{color: 'var(--text-color)'}}>{t('tutor.courses.noCourses')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--tertiary-color)'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('tutor.assignments.title')}</h2>
              <button className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow" style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}>
                <ClipboardList className="w-4 h-4" />
                {t('tutor.assignments.createAssignment')}
              </button>
            </div>

            <div className="space-y-4">
              {assignmentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto" style={{borderColor: 'var(--primary-color)'}}></div>
                  <p className="mt-2" style={{color: 'var(--text-color)'}}>{t('tutor.assignments.loading')}</p>
                </div>
              ) : assignments && assignments.length > 0 ? (
                assignments.map(assignment => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all hover-lift" style={{borderColor: 'var(--primary-color)'}}>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1" style={{color: 'var(--primary-color)'}}>{assignment.title}</h4>
                      <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                        {assignment.course?.title || t('tutor.assignments.course')} • {t('tutor.assignments.due')}: {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs" style={{color: 'var(--text-color)'}}>
                        {t('tutor.assignments.stats.submitted', { count: assignment.submissions?.length || 0 })} • {t('tutor.assignments.stats.graded', { count: assignment.submissions?.filter(s => s.grade).length || 0 })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm rounded hover:scale-105 transition-all" style={{backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)'}}>
                        {t('tutor.assignments.view')}
                      </button>
                      <button className="px-3 py-1 text-sm rounded hover:scale-105 transition-all" style={{backgroundColor: 'var(--tertiary-color)', color: 'var(--primary-color)'}}>
                        {t('tutor.assignments.edit')}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p style={{color: 'var(--text-color)'}}>{t('tutor.assignments.noAssignments')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--tertiary-color)'}}>
            <h2 className="text-2xl font-bold mb-6 animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('tutor.submissions.title')}</h2>
            
            {pendingSubmissionsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto" style={{borderColor: 'var(--primary-color)'}}></div>
                <p className="mt-2" style={{color: 'var(--text-color)'}}>{t('tutor.submissions.loading')}</p>
              </div>
            ) : pendingSubmissions && pendingSubmissions.length > 0 ? (
              <div className="space-y-4">
                {pendingSubmissions.map(submission => (
                  <SubmissionCard 
                    key={submission.id} 
                    submission={submission}
                    onGrade={handleGradeSubmission}
                    grading={gradingSubmission}
                  />
                ))}
              </div>
            ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p style={{color: 'var(--text-color)'}}>{t('tutor.submissions.noPending')}</p>
                  <p className="text-sm" style={{color: 'var(--text-color)'}}>{t('tutor.submissions.allCaughtUp')}</p>
                </div>
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--tertiary-color)'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('tutor.schedule.title')}</h2>
              <button className="px-4 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2 hover-glow" style={{backgroundColor: 'var(--primary-color)', color: 'var(--light-text)'}}>
                <Calendar className="w-4 h-4" />
                {t('tutor.schedule.scheduleClass')}
              </button>
            </div>

            <div className="space-y-4">
              {tutorClassSchedulesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto" style={{borderColor: 'var(--primary-color)'}}></div>
                  <p className="mt-2" style={{color: 'var(--text-color)'}}>{t('tutor.schedule.loading')}</p>
                </div>
              ) : tutorClassSchedules && tutorClassSchedules.length > 0 ? (
                tutorClassSchedules.map(schedule => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all hover-lift" style={{borderColor: 'var(--primary-color)'}}>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1" style={{color: 'var(--primary-color)'}}>{schedule.course?.title}</h4>
                      <p className="text-sm mb-1" style={{color: 'var(--text-color)'}}>
                        {new Date(schedule.date).toLocaleDateString()} at {schedule.time}
                      </p>
                      <p className="text-xs" style={{color: 'var(--text-color)'}}>
                        {t('tutor.schedule.room')}: {schedule.room} • {t('tutor.schedule.duration')}: {schedule.duration} {t('tutor.schedule.minutes')} • {schedule.students?.length || 0} {t('tutor.schedule.students')}
                      </p>
                    </div>
                    <button className="px-3 py-1 text-sm rounded hover:scale-105 transition-all" style={{backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)'}}>
                      {t('tutor.schedule.viewDetails')}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p style={{color: 'var(--text-color)'}}>{t('tutor.schedule.noUpcoming')}</p>
                  <p className="text-sm" style={{color: 'var(--text-color)'}}>{t('tutor.schedule.scheduleSome')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--tertiary-color)'}}>
            <h2 className="text-2xl font-bold mb-6 animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('tutor.students.management')}</h2>
            
            <div className="space-y-4">
              {courses && courses.length > 0 ? (
                courses.map(course => (
                  <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-all hover-lift" style={{borderColor: 'var(--primary-color)'}}>
                    <h3 className="font-semibold mb-3" style={{color: 'var(--primary-color)'}}>{course.title}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('tutor.students.enrolledStudents', { count: course.enrollments?.length || 0 })}</h4>
                        {course.enrollments && course.enrollments.length > 0 ? (
                          <div className="space-y-2">
                            {course.enrollments.slice(0, 5).map(enrollment => (
                              <div key={enrollment.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{backgroundColor: 'var(--primary-color)'}}>
                                  {enrollment.student?.first_name?.charAt(0) || 'S'}
                                </div>
                                <span className="text-sm" style={{color: 'var(--text-color)'}}>
                                  {enrollment.student?.first_name} {enrollment.student?.last_name}
                                </span>
                              </div>
                            ))}
                            {course.enrollments.length > 5 && (
                              <p className="text-xs" style={{color: 'var(--text-color)'}}>{t('tutor.students.more', { count: course.enrollments.length - 5 })}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm" style={{color: 'var(--text-color)'}}>{t('tutor.students.noStudents')}</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium mb-2" style={{color: 'var(--text-color)'}}>{t('tutor.students.quickActions')}</h4>
                        <div className="space-y-2">
                          <button className="w-full px-3 py-2 text-sm rounded hover:scale-105 transition-all" style={{backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)'}}>
                            {t('tutor.students.viewAll')}
                          </button>
                          <button className="w-full px-3 py-2 text-sm rounded hover:scale-105 transition-all" style={{backgroundColor: 'var(--tertiary-color)', color: 'var(--primary-color)'}}>
                            {t('tutor.students.sendMessage')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p style={{color: 'var(--text-color)'}}>{t('tutor.students.noCourses')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="rounded-lg shadow-md p-6 hover-lift animate-fade-in-up" style={{backgroundColor: 'var(--tertiary-color)'}}>
            <h2 className="text-2xl font-bold mb-6 animate-scale-in" style={{color: 'var(--primary-color)'}}>{t('tutor.analytics.title')}</h2>
            
            <div className="space-y-4">
              {courses && courses.length > 0 ? (
                courses.map(course => {
                  const performance = calculateCoursePerformance(course, assignments, pendingSubmissions);
                  
                  return (
                    <div key={course.id} className="p-4 rounded-lg" style={{backgroundColor: 'var(--accent-color)'}}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold" style={{color: 'var(--primary-color)'}}>{course.title}</h4>
                          <p className="text-sm" style={{color: 'var(--text-color)'}}>{course.code}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold" style={{color: 'var(--primary-color)'}}>{performance.avgGrade || 0}%</div>
                          <div className="text-xs" style={{color: 'var(--text-color)'}}>{t('tutor.analytics.averageGrade')}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{performance.completionRate}%</div>
                          <div className="text-xs" style={{color: 'var(--text-color)'}}>{t('tutor.analytics.completionRate')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{performance.gradedAssignments}</div>
                          <div className="text-xs" style={{color: 'var(--text-color)'}}>{t('tutor.analytics.graded')}</div>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1" style={{color: 'var(--text-color)'}}>
                          <span>{t('tutor.analytics.assignmentProgress')}</span>
                          <span>{performance.submittedAssignments}/{performance.totalAssignments}</span>
                        </div>
                        <ProgressBar progress={performance.completionRate} color="green" />
                      </div>
                      
                      <div className="text-xs" style={{color: 'var(--text-color)'}}>
                        {performance.totalAssignments} {t('tutor.analytics.totalAssignments')} • {performance.submittedAssignments} {t('tutor.analytics.submittedAssignments')} • {performance.gradedAssignments} {t('tutor.analytics.gradedAssignments')}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p style={{color: 'var(--text-color)'}}>{t('tutor.analytics.noData')}</p>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </>
    )}

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
};

export default TutorDashboard;
