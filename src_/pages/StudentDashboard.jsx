

import React, { useState } from 'react';
import { BookOpen, Calendar, FileText, TrendingUp, MessageSquare, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';

// Import student components
import CourseEnrollment from '../components/student/CourseEnrollment';
import AssignmentSubmission from '../components/student/AssignmentSubmission';
import ProgressTracking from '../components/student/ProgressTracking';
import TutorCommunication from '../components/student/TutorCommunication';

// Import UI components
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';

const StudentDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    courses: enrollments, 
    assignments, 
    coursesLoading, 
    assignmentsLoading 
  } = useDashboard();

  // Transform enrollments to match expected course structure
  const courses = enrollments?.map(enrollment => ({
    id: enrollment.course?.id || enrollment.id,
    name: enrollment.course?.title || 'Course',
    progress: enrollment.grade ? Math.min(enrollment.grade, 100) : 0,
    nextClass: enrollment.course?.start_date || 'TBD',
    code: enrollment.course?.code || ''
  })) || [];

  // Transform assignments to match expected structure
  const transformedAssignments = assignments?.map(assignment => ({
    id: assignment.id,
    title: assignment.title,
    course: assignment.course?.title || 'Course',
    due: assignment.due_date,
    status: assignment.submissions?.[0]?.grade ? 'completed' : 
            assignment.submissions?.[0] ? 'inProgress' : 'pending'
  })) || [];

  const totalCourses = courses.length;
  const totalAssignments = transformedAssignments.length;
  const completedAssignments = transformedAssignments.filter(a => a.status === 'completed').length;
  const upcomingAssignments = transformedAssignments.filter(a => a.status !== 'completed').length;

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      type: 'assignment',
      title: 'Submitted "Data Structures Project"',
      course: 'Introduction to Programming',
      timestamp: '2 hours ago',
      status: 'submitted'
    },
    {
      id: 2,
      type: 'course',
      title: 'Enrolled in "Advanced Mathematics"',
      course: 'Advanced Mathematics',
      timestamp: '1 day ago',
      status: 'enrolled'
    },
    {
      id: 3,
      type: 'message',
      title: 'Received feedback from Dr. Smith',
      course: 'Database Systems',
      timestamp: '2 days ago',
      status: 'feedback'
    }
  ];

  // Upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Quiz: Chapter 5',
      course: 'Introduction to Programming',
      date: 'Tomorrow, 10:00 AM',
      type: 'quiz'
    },
    {
      id: 2,
      title: 'Project Deadline: Final Report',
      course: 'Advanced Mathematics',
      date: 'Dec 15, 11:59 PM',
      type: 'assignment'
    },
    {
      id: 3,
      title: 'Office Hours with Prof. Johnson',
      course: 'Database Systems',
      date: 'Dec 16, 2:00 PM',
      type: 'meeting'
    }
  ];

  const getStatusIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'course':
        return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderOverview = () => (
    <>
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          title={t('student.courses')}
          value={totalCourses.toString()}
          change="Enrolled courses"
          color="blue"
        />
        <StatCard
          icon={Calendar}
          title={t('student.upcoming')}
          value={upcomingAssignments.toString()}
          change="Due assignments"
          color="green"
        />
        <StatCard
          icon={FileText}
          title={t('student.assignments')}
          value={totalAssignments.toString()}
          change={`${completedAssignments} completed`}
          color="orange"
        />
        <StatCard
          icon={TrendingUp}
          title={t('student.progress')}
          value={totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) + '%' : '0%'}
          change="Assignment completion"
          color="purple"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Recent Courses */}
        <Card title="My Courses">
          {coursesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading courses...</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="space-y-4">
              {courses.slice(0, 4).map(course => (
                <div key={course.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{course.name}</h4>
                    <span className="text-sm text-gray-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Next class: {course.nextClass}</p>
                </div>
              ))}
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => setActiveTab('courses')}
              >
                View All Courses
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses enrolled</p>
              <Button onClick={() => setActiveTab('courses')}>Browse Courses</Button>
            </div>
          )}
        </Card>

        {/* Upcoming Assignments */}
        <Card title="Upcoming Assignments">
          {assignmentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading assignments...</p>
            </div>
          ) : transformedAssignments.length > 0 ? (
            <div className="space-y-3">
              {transformedAssignments.slice(0, 4).map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">{assignment.course}</p>
                    <p className="text-xs text-gray-500">Due: {assignment.due}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                    assignment.status === 'inProgress' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {assignment.status === 'completed' ? 'Completed' : 
                     assignment.status === 'inProgress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              ))}
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => setActiveTab('assignments')}
              >
                View All Assignments
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No assignments</p>
              <Button variant="outline" disabled>Check Back Later</Button>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity and Upcoming Events */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.course}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Upcoming Events">
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.course}</p>
                  <p className="text-xs text-blue-600 font-medium">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pt-6 px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('student.dashboard')}</h1>
          <p className="text-gray-600">{t('student.welcome')}, {user.first_name || user.username}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'courses' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Course Enrollment
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'assignments' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Assignment Submission
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'progress' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Progress Tracking
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
              activeTab === 'communication' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Tutor Communication
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'courses' && <CourseEnrollment />}
        {activeTab === 'assignments' && <AssignmentSubmission />}
        {activeTab === 'progress' && <ProgressTracking />}
        {activeTab === 'communication' && <TutorCommunication />}
      </div>
    </div>
  );
};

export default StudentDashboard;
