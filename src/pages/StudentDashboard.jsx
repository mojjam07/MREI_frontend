

import React, { useState } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import DashboardFooter from '../components/layout/DashboardFooter';

const StudentDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
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

  // Transform backend data to component format
  const courses = enrollments?.map(enrollment => ({
    id: enrollment.course?.id || enrollment.id,
    name: enrollment.course?.title || 'Course',
    code: enrollment.course?.code || '',
    progress: enrollment.progress || 0,
    grade: enrollment.grade || null,
    status: enrollment.status || 'enrolled',
    nextClass: classSchedules?.find(cs => cs.course === enrollment.course?.id)?.scheduled_date || 'TBD'
  })) || [];

  const transformedAssignments = assignments?.map(assignment => ({
    id: assignment.id,
    title: assignment.title,
    course: assignment.course?.title || 'Course',
    due: assignment.due_date,
    status: assignment.submissions?.[0]?.grade ? 'completed' : 
            assignment.submissions?.[0] ? 'inProgress' : 'pending',
    grade: assignment.submissions?.[0]?.grade || null,
    feedback: assignment.submissions?.[0]?.feedback || null,
    type: assignment.assignment_type || 'general'
  })) || [];

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
          title="Enrolled Courses"
          value={totalCourses.toString()}
          change={`${completedCourses} completed`}
          color="blue"
        />
        <StatCard
          icon={FileText}
          title="Pending Assignments"
          value={pendingAssignments.toString()}
          change="Due this week"
          color="orange"
        />
        <StatCard
          icon={Target}
          title="Overall Progress"
          value={`${overallProgress}%`}
          change="Course completion"
          color="green"
        />
        <StatCard
          icon={Award}
          title="Average Grade"
          value={avgGrade > 0 ? `${avgGrade}%` : 'N/A'}
          change="Assignment average"
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Clock}
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          change="Class attendance"
          color="indigo"
        />
        <StatCard
          icon={Calendar}
          title="Upcoming Classes"
          value={upcomingClasses.length.toString()}
          change="Next 7 days"
          color="cyan"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed Tasks"
          value={recentSubmissions.length.toString()}
          change="This month"
          color="emerald"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Progress */}
        <Card 
          title="Course Progress" 
          action={
            <Button variant="outline" size="sm">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >
          {coursesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading courses...</p>
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
                    <span>Status: {course.status}</span>
                    {course.grade && <span>Grade: {course.grade}%</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No courses enrolled</p>
            </div>
          )}
        </Card>

        {/* Recent Assignments */}
        <Card 
          title="Assignment Status" 
          action={
            <Button variant="outline" size="sm">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >
          {assignmentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading assignments...</p>
            </div>
          ) : transformedAssignments.length > 0 ? (
            <div className="space-y-3">
              {transformedAssignments.slice(0, 5).map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">{assignment.course}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(assignment.due).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      assignment.status === 'inProgress' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {assignment.status}
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
              <p>No assignments found</p>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card 
          title="Upcoming Classes"
          action={
            <Button variant="outline" size="sm">
              View Schedule <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >
          {classSchedulesLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading schedule...</p>
            </div>
          ) : upcomingClasses.length > 0 ? (
            <div className="space-y-3">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{cls.course_title || 'Course'}</p>
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
              <p>No upcoming classes</p>
            </div>
          )}
        </Card>

        {/* News & Updates */}
        <Card 
          title="News & Updates"
          action={
            <Button variant="outline" size="sm">
              View All <ChevronRight className="w-4 h-4 ml-1" />
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
              <p>No recent updates</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  const renderAssignmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Assignment Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Submit Assignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Assignments */}
        <Card title="Pending Assignments">
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
                      Due: {new Date(assignment.due).toLocaleDateString()}
                    </span>
                    <Button size="sm">
                      Submit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <p>All assignments completed!</p>
            </div>
          )}
        </Card>

        {/* Recent Submissions */}
        <Card title="Recent Submissions">
          {recentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {recentSubmissions.map(assignment => (
                <div key={assignment.id} className="border border-green-200 bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{assignment.title}</h4>
                    {assignment.grade && (
                      <span className="text-sm font-medium text-green-700">
                        Grade: {assignment.grade}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                  {assignment.feedback && (
                    <p className="text-sm text-gray-600 italic">"{assignment.feedback}"</p>
                  )}
                  <span className="inline-flex mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No submissions yet</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  const renderAttendanceTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Overview</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Overall Attendance Rate</p>
          <p className="text-2xl font-bold text-blue-600">{attendanceRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Attendance Summary">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Classes</span>
              <span className="font-semibold">{attendance?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Present</span>
              <span className="font-semibold text-green-600">
                {attendance?.filter(a => a.status === 'present').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Late</span>
              <span className="font-semibold text-yellow-600">
                {attendance?.filter(a => a.status === 'late').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Absent</span>
              <span className="font-semibold text-red-600">
                {attendance?.filter(a => a.status === 'absent').length || 0}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Recent Attendance">
          {attendanceLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading attendance...</p>
            </div>
          ) : attendance && attendance.length > 0 ? (
            <div className="space-y-3">
              {attendance.slice(0, 5).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">
                      {record.class_schedule?.course_title || 'Course'}
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
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No attendance records</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  if (studentDashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--accent-color)'}}>
      {/* Header */}
      <header className="shadow-sm border-b" style={{backgroundColor: 'var(--primary-color)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8" style={{color: 'var(--tertiary-color)'}} />
              <h1 className="text-2xl font-bold" style={{color: 'var(--light-text)'}}>Student Dashboard</h1>
            </div>
            <button className="p-2 rounded-lg transition-all hover:scale-105 hover-glow" style={{color: 'var(--tertiary-color)'}}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
            Overview
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
            Assignments
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
            Attendance
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'assignments' && renderAssignmentsTab()}
        {activeTab === 'attendance' && renderAttendanceTab()}
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
};

export default StudentDashboard;
