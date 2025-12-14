import React, { useState } from 'react';
import { 
  BookOpen, Users, FileText, TrendingUp, Calendar, Award, 
  MessageSquare, Settings, Plus, Search, Filter, Eye,
  Clock, CheckCircle, AlertCircle
} from 'lucide-react';

import { useTutorDashboard } from '../hooks/useTutorDashboard';

import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import ContentCard from '../components/ui/ContentCard';
import FormModal from '../components/ui/FormModal';

// Import tutor components
import CourseManagement from '../components/tutor/CourseManagement';
import StudentProgress from '../components/tutor/StudentProgress';
import AssignmentGrading from '../components/tutor/AssignmentGrading';
import ClassScheduling from '../components/tutor/ClassScheduling';
import MessageCenter from '../components/tutor/MessageCenter';

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { user } = useAuth();

  const {
    courses,
    assignments,
    students,
    schedules,
    messages,
    _performanceAnalytics,
    stats,
    recentActivity,
    _coursesLoading,
    assignmentsLoading,
    _studentsLoading,
    _schedulesLoading,
    messagesLoading,
    _performanceLoading,
    createAssignment,
    updateAssignment,
    _gradeSubmission,
    _createSchedule,
    _sendMessage,
    markMessageAsRead,
    _creatingAssignment,
    _updatingAssignment,
    _gradingSubmission,
    _creatingSchedule,
    _sendingMessage,
    _markingMessageAsRead,
    isLoading
  } = useTutorDashboard();

  // Filter functions
  const filteredAssignments = assignments?.filter(assignment => {
    const matchesSearch = assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'pending' && !assignment.submissions?.some(s => s.grade)) ||
                         (filterStatus === 'graded' && assignment.submissions?.some(s => s.grade)) ||
                         (filterStatus === 'overdue' && new Date(assignment.due_date) < new Date() && !assignment.submissions?.some(s => s.grade));
    return matchesSearch && matchesFilter;
  }) || [];

  const filteredMessages = messages?.filter(message => {
    const matchesSearch = message.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'unread' && !message.is_read) ||
                         (filterStatus === 'read' && message.is_read);
    return matchesSearch && matchesFilter;
  }) || [];

  // Render overview tab
  const renderOverviewTab = () => {
    if (isLoading) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={BookOpen}
            title="Active Courses"
            value={stats.totalCourses.toString()}
            change={`${students.length} total students`}
            color="blue"
          />
          <StatCard
            icon={Users}
            title="Students"
            value={stats.totalStudents.toString()}
            change="Across all courses"
            color="green"
          />
          <StatCard
            icon={FileText}
            title="Assignments"
            value={stats.totalAssignments.toString()}
            change={`${stats.pendingGrading} pending grading`}
            color="orange"
          />
          <StatCard
            icon={TrendingUp}
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            change="Assignments graded"
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setModalType('assignment');
                  setShowCreateModal(true);
                }}
                className="w-full" 
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
              <Button 
                onClick={() => setActiveTab('courses')}
                className="w-full" 
                variant="outline"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Courses
              </Button>
              <Button 
                onClick={() => setActiveTab('schedule')}
                className="w-full" 
                variant="outline"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Class
              </Button>
            </div>
          </Card>

          <Card title="Pending Tasks">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium">Grading</span>
                </div>
                <span className="text-sm font-bold text-orange-600">{stats.pendingGrading}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Messages</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {messages?.filter(m => !m.is_read).length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Classes Today</span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {schedules?.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).length || 0}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {activity.type === 'message' && (
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  )}
                  {activity.type === 'submission' && (
                    <FileText className="w-4 h-4 text-orange-600" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Assignment Overview */}
        <Card title="Assignment Overview">
          <div className="space-y-4">
            {assignmentsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>

            ) : assignments && assignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {assignments.slice(0, 6).map(currentAssignment => {
                  const gradedCount = currentAssignment.submissions?.filter(s => s.grade).length || 0;
                  const totalCount = currentAssignment.submissions?.length || 0;
                  const isOverdue = new Date(currentAssignment.due_date) < new Date() && totalCount === 0;
                  
                  return (
                    <div key={currentAssignment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 truncate">{currentAssignment.title}</h4>
                        {isOverdue && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {currentAssignment.course?.title || 'No course'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Due: {new Date(currentAssignment.due_date).toLocaleDateString()}</span>
                        <span>{gradedCount}/{totalCount} graded</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{totalCount > 0 ? Math.round((gradedCount / totalCount) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${totalCount > 0 ? (gradedCount / totalCount) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No assignments created yet</p>
            )}
          </div>
        </Card>
      </div>
    );
  };

  // Render assignments tab
  const renderAssignmentsTab = () => {
    return (
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Assignments Management</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Grading</option>
              <option value="graded">Graded</option>
              <option value="overdue">Overdue</option>
            </select>
            <Button
              onClick={() => {
                setModalType('assignment');
                setShowCreateModal(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Assignment
            </Button>
          </div>
        </div>

        {/* Assignment list */}
        <div className="bg-white rounded-lg shadow-md">
          {assignmentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading assignments...</p>
            </div>
          ) : (
            <DataTable
              data={filteredAssignments}
              columns={[
                { 
                  key: 'title', 
                  label: 'Assignment', 
                  render: (value, item) => (
                    <div>
                      <p className="font-medium">{value}</p>
                      <p className="text-sm text-gray-500">{item.course?.title || 'No course'}</p>
                    </div>
                  )
                },
                { 
                  key: 'due_date', 
                  label: 'Due Date', 
                  type: 'date',
                  render: (value) => (
                    <span className={`${
                      new Date(value) < new Date() ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {new Date(value).toLocaleDateString()}
                    </span>
                  )
                },
                { 
                  key: 'submissions', 
                  label: 'Submissions', 
                  render: (submissions) => {
                    const graded = submissions?.filter(s => s.grade).length || 0;
                    const total = submissions?.length || 0;
                    return (
                      <div className="text-sm">
                        <span className="font-medium">{graded}/{total}</span>
                        <div className="text-gray-500">graded</div>
                      </div>
                    );
                  }
                },
                { 
                  key: 'status', 
                  label: 'Status', 
                  render: (_, item) => {
                    const graded = item.submissions?.filter(s => s.grade).length || 0;
                    const total = item.submissions?.length || 0;
                    const isOverdue = new Date(item.due_date) < new Date() && total === 0;
                    
                    if (isOverdue) return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Overdue</span>;
                    if (graded === total && total > 0) return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Complete</span>;
                    if (total > 0) return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">In Progress</span>;
                    return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">No Submissions</span>;
                  }
                }
              ]}
              onView={(assignment) => {
                setSelectedItem(assignment);
                setModalType('view-assignment');
                setShowCreateModal(true);
              }}
              onEdit={(assignment) => {
                setSelectedItem(assignment);
                setModalType('assignment');
                setShowCreateModal(true);
              }}

              onDelete={() => {
                if (window.confirm('Are you sure you want to delete this assignment?')) {
                  // Handle delete
                }
              }}
            />
          )}
        </div>
      </div>
    );
  };

  // Render messages tab
  const renderMessagesTab = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Messages & Communication</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {/* Messages list */}
        <div className="bg-white rounded-lg shadow-md">
          {messagesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading messages...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.length > 0 ? (
                filteredMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !message.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => !message.is_read && markMessageAsRead(message.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{message.sender_name || 'Unknown Sender'}</h4>
                          {!message.is_read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{message.content?.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(message);
                          setModalType('reply');
                          setShowCreateModal(true);
                        }}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No messages found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Tutor Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.first_name || user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{stats.totalCourses} Courses</p>
                <p className="text-xs text-gray-500">{stats.totalStudents} Students</p>
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'courses' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Courses
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'assignments' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'students' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Students
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'messages' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Messages
            {messages?.filter(m => !m.is_read).length > 0 && (
              <span className="ml-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {messages.filter(m => !m.is_read).length}
              </span>
            )}
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'courses' && <CourseManagement />}
        {activeTab === 'assignments' && renderAssignmentsTab()}
        {activeTab === 'students' && <StudentProgress />}
        {activeTab === 'schedule' && <ClassScheduling />}
        {activeTab === 'messages' && renderMessagesTab()}

        {/* Modals */}
        {showCreateModal && modalType === 'assignment' && (
          <FormModal
            isOpen={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedItem(null);
              setModalType(null);
            }}
            title={selectedItem ? 'Edit Assignment' : 'Create Assignment'}
            onSubmit={async (data) => {
              try {
                if (selectedItem) {
                  await updateAssignment({ id: selectedItem.id, data });
                } else {
                  await createAssignment(data);
                }
                setShowCreateModal(false);
                setSelectedItem(null);
                setModalType(null);
              } catch (error) {
                console.error('Error saving assignment:', error);
              }
            }}
          >
            {/* Assignment form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedItem?.title || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  defaultValue={selectedItem?.description || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="datetime-local"
                  name="due_date"
                  defaultValue={selectedItem?.due_date ? new Date(selectedItem.due_date).toISOString().slice(0, 16) : ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  name="course"
                  defaultValue={selectedItem?.course || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a course</option>
                  {courses?.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </FormModal>
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;

