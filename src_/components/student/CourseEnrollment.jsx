import React, { useState } from 'react';
import { BookOpen, Search, Filter, Plus, Minus, Clock, Users, Star, MapPin } from 'lucide-react';
import { useStudentDashboard } from '../../hooks/useStudentDashboard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import FormModal from '../ui/FormModal';
import ProgressBar from '../ui/ProgressBar';


const CourseEnrollment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [viewMode, setViewMode] = useState('enrolled'); // 'enrolled' or 'available'

  const {
    enrolledCourses,
    submittingAssignment,
    enrollInCourse,
    unenrollFromCourse,
    calculateCourseProgress,
    loading
  } = useStudentDashboard();

  // Mock available courses (would come from API)
  const availableCourses = [
    {
      id: 101,
      title: 'Advanced Mathematics',
      description: 'Calculus, linear algebra, and differential equations',
      instructor: 'Dr. Sarah Johnson',
      schedule: 'Mon, Wed, Fri 10:00 AM',
      location: 'Room 301',
      capacity: 25,
      enrolled: 18,
      level: 'Advanced',
      subject: 'Mathematics',
      rating: 4.8,
      duration: '12 weeks'
    },
    {
      id: 102,
      title: 'Introduction to Programming',
      description: 'Python programming fundamentals for beginners',
      instructor: 'Prof. Mike Chen',
      schedule: 'Tue, Thu 2:00 PM',
      location: 'Computer Lab 1',
      capacity: 30,
      enrolled: 25,
      level: 'Beginner',
      subject: 'Computer Science',
      rating: 4.6,
      duration: '10 weeks'
    },
    {
      id: 103,
      title: 'Organic Chemistry',
      description: 'Advanced organic chemistry principles and lab work',
      instructor: 'Dr. Emily Davis',
      schedule: 'Mon, Wed 3:00 PM',
      location: 'Chemistry Lab 2',
      capacity: 20,
      enrolled: 15,
      level: 'Intermediate',
      subject: 'Chemistry',
      rating: 4.9,
      duration: '14 weeks'
    },
    {
      id: 104,
      title: 'Modern Literature',
      description: 'Analysis of contemporary literary works and themes',
      instructor: 'Prof. Robert Wilson',
      schedule: 'Tue, Thu 11:00 AM',
      location: 'Literature Hall 201',
      capacity: 35,
      enrolled: 28,
      level: 'Intermediate',
      subject: 'English',
      rating: 4.5,
      duration: '12 weeks'
    }
  ];

  // Get all subjects for filter
  const subjects = [...new Set(availableCourses.map(course => course.subject))];

  // Filter available courses
  const filteredAvailableCourses = availableCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === 'all' || course.subject === filterSubject;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    
    // Check if not already enrolled
    const isEnrolled = enrolledCourses.some(ec => ec.course?.id === course.id);
    
    return matchesSearch && matchesSubject && matchesLevel && !isEnrolled;
  });

  // Handle enrollment
  const handleEnroll = async (courseId) => {
    const success = await enrollInCourse(courseId);
    if (success) {
      alert('Successfully enrolled in course!');
    }
  };

  // Handle unenrollment
  const handleUnenroll = async (enrollmentId) => {
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      const success = await unenrollFromCourse(enrollmentId);
      if (success) {
        alert('Successfully unenrolled from course!');
      }
    }
  };

  // Get enrollment statistics
  const getEnrollmentStats = () => {
    const totalEnrolled = enrolledCourses.length;
    const totalCapacity = enrolledCourses.reduce((sum, ec) => sum + (ec.course?.capacity || 0), 0);
    const averageProgress = enrolledCourses.length > 0 
      ? Math.round(enrolledCourses.reduce((sum, ec) => sum + calculateCourseProgress(ec.course?.id), 0) / enrolledCourses.length)
      : 0;

    return { totalEnrolled, totalCapacity, averageProgress };
  };

  const stats = getEnrollmentStats();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Course Enrollment</h2>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('enrolled')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'enrolled' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              My Courses ({enrolledCourses.length})
            </button>
            <button
              onClick={() => setViewMode('available')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'available' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Available Courses
            </button>
          </div>

          {viewMode === 'available' && (
            <Button onClick={() => setViewMode('available')}>
              <Plus className="w-4 h-4 mr-2" />
              Browse Courses
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalEnrolled}</p>
              <p className="text-xs text-gray-500 mt-1">Active enrollments</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Progress</p>
              <p className="text-2xl font-bold text-green-600">{stats.averageProgress}%</p>
              <p className="text-xs text-gray-500 mt-1">Course completion</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Seats</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalCapacity - stats.totalEnrolled}</p>
              <p className="text-xs text-gray-500 mt-1">Remaining capacity</p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'enrolled' ? (
        <Card title="My Enrolled Courses">
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(enrollment => {
                const progress = calculateCourseProgress(enrollment.course?.id);
                return (
                  <div key={enrollment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{enrollment.course?.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        enrollment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollment.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{enrollment.course?.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{enrollment.course?.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{enrollment.course?.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{enrollment.course?.location}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <ProgressBar progress={progress} color="blue" />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUnenroll(enrollment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled</h3>
              <p className="text-gray-600 mb-6">Browse available courses to start your learning journey.</p>
              <Button onClick={() => setViewMode('available')}>
                <Plus className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card title="Available Courses">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Available Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAvailableCourses.map(course => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {course.level}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {course.subject}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{course.schedule} • {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{course.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    {course.enrolled}/{course.capacity} enrolled
                  </span>
                  <span className={`text-sm font-medium ${
                    course.enrolled >= course.capacity ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {course.enrolled >= course.capacity ? 'Full' : 'Available'}
                  </span>
                </div>
                
                <Button 
                  onClick={() => handleEnroll(course.id)}
                  disabled={course.enrolled >= course.capacity || submittingAssignment}
                  className="w-full"
                >
                  {course.enrolled >= course.capacity ? 'Course Full' : 'Enroll Now'}
                </Button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAvailableCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterSubject !== 'all' || filterLevel !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'All available courses are already enrolled.'}
              </p>
              {(searchTerm || filterSubject !== 'all' || filterLevel !== 'all') && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterSubject('all');
                    setFilterLevel('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default CourseEnrollment;
