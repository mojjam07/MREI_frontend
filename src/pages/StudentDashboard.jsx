import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Award,
  Target,
  Bell,
  ChevronRight,
  Download,
  Upload,
  LayoutDashboard,
  Settings
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';


import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import DashboardFooter from '../components/layout/DashboardFooter';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import DashboardSkeleton from '../components/ui/DashboardSkeleton';

const StudentDashboard = () => {

  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null); // Add error state
  
  const {
    studentDashboard,
    studentDashboardLoading,
    courses: enrollments,
    assignments,
    classSchedules,
    attendance,
    coursesLoading,
    assignmentsLoading,
    classSchedulesLoading,
    attendanceLoading,
    news,
    events
  } = useDashboard();

  // Add error handling effect with timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      const stillLoading = studentDashboardLoading ||
                          coursesLoading ||
                          assignmentsLoading ||
                          classSchedulesLoading ||
                          attendanceLoading;

      if (stillLoading) {
        setError('Failed to load dashboard data. Please check your connection.');
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [studentDashboardLoading, coursesLoading, assignmentsLoading, classSchedulesLoading, attendanceLoading]);

  // Clear error when data loads successfully
  useEffect(() => {
    if (!studentDashboardLoading && !coursesLoading && !assignmentsLoading) {
      setError(null);
    }
  }, [studentDashboardLoading, coursesLoading, assignmentsLoading]);

  // Transform backend data to component format
  const courses = enrollments?.map(enrollment => {
    // Handle different possible response formats
    const course = enrollment.course || enrollment;
    return {
      id: course?.id || enrollment.id,
      name: course?.title || course?.name || t('student.fallbacks.course'),
      code: course?.code || '',
      progress: enrollment.progress || 0,
      grade: enrollment.grade || null,
      status: enrollment.status || 'enrolled',
      nextClass: classSchedules?.find(cs => cs.course === course?.id)?.scheduled_date ||
                 classSchedules?.find(cs => cs.course_id === course?.id)?.date ||
                 t('student.fallbacks.toBeDetermined')
    };
  }) || [];

  const transformedAssignments = assignments?.map(assignment => {
    // Handle nested submission data
    const submission = assignment.submissions?.[0] || {};
    return {
      id: assignment.id,
      title: assignment.title || assignment.name,
      course: assignment.course?.title || assignment.course?.name || t('student.fallbacks.course'),
      due: assignment.due_date || assignment.due || assignment.deadline,
      status: submission.grade ? 'completed' :
              submission.submitted_at ? 'inProgress' : 'pending',
      grade: submission.grade || null,
      feedback: submission.feedback || null,
      type: assignment.assignment_type || assignment.type || t('student.fallbacks.general')
    };
  }) || [];

  const upcomingClasses = classSchedules?.filter(cs => {
    const classDate = new Date(cs.scheduled_date);
    const now = new Date();
    return classDate >= now;
  }).slice(0, 3) || [];

  const recentNews = news?.filter(n => n.published).slice(0, 3) || [];
  const upcomingEvents = events?.filter(e => e.published && new Date(e.event_date) >= new Date()).slice(0, 3) || [];

  // Calculate dashboard metrics from backend analytics
  const dashboardData = studentDashboard || {
    enrolled_courses: courses.length,
    completed_courses: courses.filter(c => c.status === 'completed').length,
    pending_assignments: transformedAssignments.filter(a => a.status === 'pending').length,
    overall_progress: courses.length > 0 ? courses.reduce((sum, c) => sum + c.progress, 0) / courses.length : 0,
    avg_grade: transformedAssignments.filter(a => a.grade).reduce((sum, a, _, arr) => sum + a.grade / arr.length, 0) || 0,
    attendance_rate: attendance?.filter(a => a.status === 'present' || a.status === 'late').length / (attendance?.length || 1) * 100 || 0
  };

  const totalCourses = dashboardData.enrolled_courses || 0;
  const completedCourses = dashboardData.completed_courses || 0;
  const pendingAssignments = dashboardData.pending_assignments || 0;
  const overallProgress = Math.round(dashboardData.overall_progress || 0);
  const avgGrade = Math.round((dashboardData.avg_grade || 0) * 10) / 10;
  const attendanceRate = Math.round(dashboardData.attendance_rate || 0);

  const upcomingAssignments = transformedAssignments.filter(a => 
    new Date(a.due) >= new Date() && a.status !== 'completed'
  ).slice(0, 5);

  const recentSubmissions = transformedAssignments.filter(a => a.status === 'completed').slice(0, 5);

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          icon={BookOpen}
          title={t('student.enrolledCourses')}
          value={totalCourses.toString()}
          change={`${completedCourses} ${t('student.completedCourses').toLowerCase()}`}
          color="blue"
        />
        <StatCard
          icon={FileText}
          title={t('student.pendingAssignments')}
          value={pendingAssignments.toString()}
          change={t('student.dueThisWeek')}
          color="orange"
        />
        <StatCard
          icon={Target}
          title={t('student.overallProgress')}
          value={`${overallProgress}%`}
          change={t('student.courseCompletion')}
          color="green"
        />
        <StatCard
          icon={Award}
          title={t('student.averageGrade')}

          value={avgGrade > 0 ? `${avgGrade}%` : t('student.fallbacks.notAvailable')}
          change={t('student.assignmentAverage')}
          color="purple"
        />
      </div>


      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Clock}
          title={t('student.attendanceRate')}
          value={`${attendanceRate}%`}
          change={t('student.classAttendance')}
          color="indigo"
        />
        <StatCard
          icon={Calendar}
          title={t('student.upcomingClasses')}
          value={upcomingClasses.length.toString()}
          change={t('student.next7Days')}
          color="cyan"
        />
        <StatCard
          icon={CheckCircle}
          title={t('student.completedTasks')}
          value={recentSubmissions.length.toString()}
          change={t('student.thisMonth')}
          color="emerald"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Course Progress */}
        <Card 
          title={t('student.courseProgress')} 
          action={
            <Button variant="outline" size="sm">
              {t('student.viewAll')} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >

          {coursesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">{t('student.loadingCourses')}</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="space-y-4">
              {courses.slice(0, 4).map(course => (
                <div key={course.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{course.name}</h4>
                      <p className="text-sm text-gray-600">{course.code}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
                  </div>
                  <ProgressBar 
                    progress={course.progress} 
                    className="mb-2"
                    color={course.status === 'completed' ? 'green' : 'blue'}
                  />

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('student.status')}: {course.status}</span>
                    {course.grade && <span>{t('student.grade')}: {course.grade}%</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{t('student.noCoursesEnrolled')}</p>
            </div>
          )}
        </Card>


        {/* Recent Assignments */}
        <Card 
          title={t('student.assignmentStatus')} 
          action={
            <Button variant="outline" size="sm">
              {t('student.viewAll')} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >

          {assignmentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">{t('student.loadingAssignments')}</p>
            </div>
          ) : transformedAssignments.length > 0 ? (
            <div className="space-y-3">
              {transformedAssignments.slice(0, 5).map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">{assignment.course}</p>
                    <p className="text-xs text-gray-500">{t('student.due')}: {new Date(assignment.due).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">

                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      assignment.status === 'inProgress' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {t(`student.${assignment.status}`)}
                    </span>
                    {assignment.grade && (
                      <p className="text-sm font-medium text-gray-700 mt-1">{assignment.grade}%</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{t('student.noAssignmentsFound')}</p>
            </div>
          )}
        </Card>
      </div>


      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card 
          title={t('student.upcomingClasses')}
          action={
            <Button variant="outline" size="sm">
              {t('student.viewSchedule')} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >

          {classSchedulesLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">{t('student.loadingSchedule')}</p>
            </div>
          ) : upcomingClasses.length > 0 ? (
            <div className="space-y-3">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div className="flex-1">

                    <p className="font-medium text-gray-800">{cls.course_title || t('student.fallbacks.course')}</p>
                    <p className="text-sm text-gray-600">{new Date(cls.scheduled_date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">
                    {cls.start_time} - {cls.end_time}
                  </span>
                </div>
              ))}
            </div>

          ) : (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{t('student.noUpcomingClasses')}</p>
            </div>
          )}
        </Card>

        {/* News & Updates */}
        <Card 
          title={t('student.newsUpdates')}
          action={
            <Button variant="outline" size="sm">
              {t('student.viewAll')} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >
          {recentNews.length > 0 || upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {recentNews.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingEvents.map((event, index) => (
                <div key={`event-${index}`} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{event.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.event_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <div className="text-center py-6 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{t('student.noRecentUpdates')}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );


  const renderAssignmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('student.assignmentManagement')}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            {t('student.submitAssignment')}
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Assignments */}
        <Card title={t('student.pendingAssignments')}>
          {upcomingAssignments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAssignments.map(assignment => (
                <div key={assignment.id} className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{assignment.title}</h4>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      {assignment.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {t('student.due')}: {new Date(assignment.due).toLocaleDateString()}
                    </span>
                    <Button size="sm">
                      {t('student.submit')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <p>{t('student.allAssignmentsCompleted')}</p>
            </div>
          )}
        </Card>


        {/* Recent Submissions */}
        <Card title={t('student.recentSubmissions')}>
          {recentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {recentSubmissions.map(assignment => (
                <div key={assignment.id} className="border border-green-200 bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{assignment.title}</h4>

                    {assignment.grade && (
                      <span className="text-sm font-medium text-green-700">
                        {t('student.grade')}: {assignment.grade}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                  {assignment.feedback && (
                    <p className="text-sm text-gray-600 italic">"{assignment.feedback}"</p>
                  )}
                  <span className="inline-flex mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    {t('student.completed')}
                  </span>
                </div>
              ))}
            </div>
          ) : (

            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{t('student.noSubmissionsYet')}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );


  const renderAttendanceTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('student.attendanceOverview')}</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">{t('student.overallAttendanceRate')}</p>
          <p className="text-2xl font-bold text-blue-600">{attendanceRate}%</p>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={t('student.attendanceSummary')}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('student.totalClasses')}</span>
              <span className="font-semibold">{attendance?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('student.present')}</span>
              <span className="font-semibold text-green-600">
                {attendance?.filter(a => a.status === 'present').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('student.late')}</span>
              <span className="font-semibold text-yellow-600">
                {attendance?.filter(a => a.status === 'late').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('student.absent')}</span>
              <span className="font-semibold text-red-600">
                {attendance?.filter(a => a.status === 'absent').length || 0}
              </span>
            </div>
          </div>
        </Card>


        <Card title={t('student.recentAttendance')}>
          {attendanceLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">{t('student.loadingAttendance')}</p>
            </div>
          ) : attendance && attendance.length > 0 ? (
            <div className="space-y-3">
              {attendance.slice(0, 5).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">

                      {record.class_schedule?.course_title || t('student.fallbacks.course')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === 'present' ? 'bg-green-100 text-green-700' :
                    record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {t(`student.${record.status}`)}
                  </span>
                </div>
              ))}
            </div>

          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{t('student.noAttendanceRecords')}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );


  // Main loading state with skeleton
  const isMainLoading = studentDashboardLoading;

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--accent-color)'}}>
      {/* Header */}
      <header className="shadow-sm border-b" style={{backgroundColor: 'var(--primary-color)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8" style={{color: 'var(--tertiary-color)'}} />
              <h1 className="text-2xl font-bold" style={{color: 'var(--light-text)'}}>{t('student.dashboard')}</h1>
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
            <div className="rounded-lg shadow-sm mb-6 p-2 flex flex-wrap gap-2 hover-lift" style={{backgroundColor: 'var(--light-text)'}}>
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
                <TrendingUp className="w-4 h-4" />
                {t('student.tabs.overview')}
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
                <FileText className="w-4 h-4" />
                {t('student.tabs.assignments')}
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105 ${
                  activeTab === 'attendance' ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: activeTab === 'attendance' ? 'var(--primary-color)' : 'transparent',
                  color: activeTab === 'attendance' ? 'var(--light-text)' : 'var(--text-color)'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'attendance') {
                    e.target.style.backgroundColor = 'var(--accent-color)';
                    e.target.style.color = 'var(--primary-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'attendance') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--text-color)';
                  }
                }}
              >
                <Users className="w-4 h-4" />
                {t('student.tabs.attendance')}
              </button>
            </div>

            {/* Content Area */}
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'assignments' && renderAssignmentsTab()}
            {activeTab === 'attendance' && renderAttendanceTab()}
          </div>
        </>
      )}

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
};

export default StudentDashboard;
