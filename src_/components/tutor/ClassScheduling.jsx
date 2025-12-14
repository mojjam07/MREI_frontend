
import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useTutorDashboard } from '../../hooks/useTutorDashboard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import FormModal from '../ui/FormModal';
import ProgressBar from '../ui/ProgressBar';

const ClassScheduling = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    course: '',
    max_students: '',
    recurring: false,
    recurring_pattern: 'weekly'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'


  const {
    schedules,
    courses,
    students,
    schedulesLoading,
    coursesLoading,
    studentsLoading,
    createSchedule,
    creatingSchedule
  } = useTutorDashboard();

  // Filter schedules
  const filteredSchedules = schedules?.filter(schedule => {
    const matchesSearch = schedule.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'upcoming' && new Date(schedule.date) >= new Date()) ||
      (filterStatus === 'past' && new Date(schedule.date) < new Date()) ||
      (filterStatus === 'today' && new Date(schedule.date).toDateString() === new Date().toDateString());
    
    const matchesCourse = filterCourse === 'all' || schedule.course === parseInt(filterCourse);
    
    return matchesSearch && matchesStatus && matchesCourse;
  }).sort((a, b) => new Date(a.date) - new Date(b.date)) || [];

  // Calculate scheduling stats
  const getScheduleStats = () => {
    const today = new Date();
    const upcoming = schedules?.filter(s => new Date(s.date) >= today).length || 0;
    const todayClasses = schedules?.filter(s => 
      new Date(s.date).toDateString() === today.toDateString()
    ).length || 0;
    const thisWeek = schedules?.filter(s => {
      const scheduleDate = new Date(s.date);
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      return scheduleDate >= weekStart && scheduleDate <= weekEnd;
    }).length || 0;

    return { upcoming, todayClasses, thisWeek, total: schedules?.length || 0 };
  };

  const stats = getScheduleStats();

  // Handle schedule creation/update
  const handleScheduleSubmit = async () => {
    if (!scheduleData.title || !scheduleData.date || !scheduleData.start_time || !scheduleData.end_time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createSchedule(scheduleData);
      setShowCreateModal(false);
      resetScheduleData();
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const resetScheduleData = () => {
    setScheduleData({
      title: '',
      description: '',
      date: '',
      start_time: '',
      end_time: '',
      location: '',
      course: '',
      max_students: '',
      recurring: false,
      recurring_pattern: 'weekly'
    });
  };

  // Get enrolled students count
  const getEnrolledStudentsCount = (schedule) => {
    return students?.filter(s => 
      s.enrollments?.some(e => e.course === schedule.course)
    ).length || 0;
  };

  // Get course name
  const getCourseName = (courseId) => {
    const course = courses?.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  // Group schedules by date for calendar view
  const groupSchedulesByDate = () => {
    const grouped = {};
    filteredSchedules.forEach(schedule => {
      const dateKey = new Date(schedule.date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(schedule);
    });
    return grouped;
  };

  const groupedSchedules = groupSchedulesByDate();

  // Get upcoming schedule
  const getNextSchedule = () => {
    const upcoming = schedules?.filter(s => new Date(s.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    return upcoming;
  };

  const nextSchedule = getNextSchedule();

  if (schedulesLoading || coursesLoading || studentsLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Class Scheduling</h2>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Calendar View
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search schedules..."
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
            <option value="upcoming">Upcoming</option>
            <option value="today">Today</option>
            <option value="past">Past</option>
          </select>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Courses</option>
            {courses?.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Class
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-green-600">{stats.thisWeek}</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-purple-600">{stats.todayClasses}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-orange-600">{stats.upcoming}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Next Class Alert */}
      {nextSchedule && new Date(nextSchedule.date) >= new Date() && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Next Class</h3>
              <p className="text-blue-800 font-medium">{nextSchedule.title}</p>
              <p className="text-sm text-blue-700">
                {getCourseName(nextSchedule.course)} • {new Date(nextSchedule.date).toLocaleDateString()} • 
                {nextSchedule.start_time} - {nextSchedule.end_time}
              </p>
              {nextSchedule.location && (
                <p className="text-sm text-blue-600">📍 {nextSchedule.location}</p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSchedule(nextSchedule);
                setScheduleData(nextSchedule);
                setShowCreateModal(true);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </Card>
      )}

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <Card title="Class Schedule">
          <DataTable
            data={filteredSchedules}
            columns={[
              { 
                key: 'title', 
                label: 'Class', 
                render: (value, schedule) => (
                  <div>
                    <p className="font-medium text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{getCourseName(schedule.course)}</p>
                  </div>
                )
              },
              { 
                key: 'date', 
                label: 'Date & Time', 
                render: (_, schedule) => (
                  <div>
                    <p className="font-medium">{new Date(schedule.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">
                      {schedule.start_time} - {schedule.end_time}
                    </p>
                  </div>
                )
              },
              { 
                key: 'location', 
                label: 'Location', 
                render: (value) => (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{value || 'Not specified'}</span>
                  </div>
                )
              },
              { 
                key: 'students', 
                label: 'Students', 
                render: (_, schedule) => {
                  const enrolled = getEnrolledStudentsCount(schedule);
                  const max = schedule.max_students;
                  return (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{enrolled}</span>
                      {max && <span className="text-sm text-gray-500">/ {max}</span>}
                    </div>
                  );
                }
              },
              { 
                key: 'status', 
                label: 'Status', 
                render: (_, schedule) => {
                  const date = new Date(schedule.date);
                  const now = new Date();
                  const status = date < now ? 'past' : 
                                date.toDateString() === now.toDateString() ? 'today' : 'upcoming';
                  const color = status === 'past' ? 'gray' : 
                               status === 'today' ? 'blue' : 'green';
                  return (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      color === 'green' ? 'bg-green-100 text-green-800' :
                      color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  );
                }
              },
              { 
                key: 'actions', 
                label: 'Actions', 
                render: (_, schedule) => (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setScheduleData(schedule);
                        setShowCreateModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this schedule?')) {
                          // Handle delete
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )
              }
            ]}
          />
        </Card>
      ) : (
        <Card title="Calendar View">
          <div className="grid grid-cols-7 gap-4">
            {/* Calendar header */}
            <div className="col-span-7 grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-700 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="col-span-7 grid grid-cols-7 gap-2">

              {/* Get first day of month and number of days */}
              {(() => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay());
                
                const days = [];
                const currentDate = new Date(startDate);
                
                for (let i = 0; i < 42; i++) {
                  const daySchedules = groupedSchedules[currentDate.toDateString()] || [];
                  const isCurrentMonth = currentDate.getMonth() === today.getMonth();
                  const isToday = currentDate.toDateString() === new Date().toDateString();
                  
                  days.push(
                    <div
                      key={i}
                      className={`min-h-24 p-2 border border-gray-200 rounded-lg ${
                        !isCurrentMonth ? 'bg-gray-50 text-gray-400' :
                        isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {currentDate.getDate()}
                      </div>
                      <div className="space-y-1">
                        {daySchedules.slice(0, 2).map((schedule, idx) => (
                          <div
                            key={idx}
                            className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                            title={schedule.title}
                          >
                            {schedule.title}
                          </div>
                        ))}
                        {daySchedules.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{daySchedules.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                  
                  currentDate.setDate(currentDate.getDate() + 1);
                }
                
                return days;
              })()}
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredSchedules.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes scheduled</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' || filterCourse !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by scheduling your first class.'}
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Class
          </Button>
        </div>
      )}

      {/* Create/Edit Schedule Modal */}
      {showCreateModal && (
        <FormModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedSchedule(null);
            resetScheduleData();
          }}
          title={selectedSchedule ? 'Edit Class Schedule' : 'Create Class Schedule'}
          size="lg"
          onSubmit={handleScheduleSubmit}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Title *</label>
                <input
                  type="text"
                  value={scheduleData.title}
                  onChange={(e) => setScheduleData({...scheduleData, title: e.target.value})}
                  placeholder="e.g., Introduction to Biology"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                <select
                  value={scheduleData.course}
                  onChange={(e) => setScheduleData({...scheduleData, course: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a course</option>
                  {courses?.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={scheduleData.location}
                  onChange={(e) => setScheduleData({...scheduleData, location: e.target.value})}
                  placeholder="e.g., Room 101, Online"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                <input
                  type="time"
                  value={scheduleData.start_time}
                  onChange={(e) => setScheduleData({...scheduleData, start_time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                <input
                  type="time"
                  value={scheduleData.end_time}
                  onChange={(e) => setScheduleData({...scheduleData, end_time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
                <input
                  type="number"
                  value={scheduleData.max_students}
                  onChange={(e) => setScheduleData({...scheduleData, max_students: e.target.value})}
                  placeholder="Optional"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={scheduleData.description}
                onChange={(e) => setScheduleData({...scheduleData, description: e.target.value})}
                placeholder="Class description or agenda..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            {/* Recurring Options */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={scheduleData.recurring}
                  onChange={(e) => setScheduleData({...scheduleData, recurring: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                  Make this a recurring class
                </label>
              </div>
              {scheduleData.recurring && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recurring Pattern</label>
                  <select
                    value={scheduleData.recurring_pattern}
                    onChange={(e) => setScheduleData({...scheduleData, recurring_pattern: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedSchedule(null);
                  resetScheduleData();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleSubmit}
                disabled={creatingSchedule}
              >
                {creatingSchedule ? 'Saving...' : (selectedSchedule ? 'Update Schedule' : 'Create Schedule')}
              </Button>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default ClassScheduling;
