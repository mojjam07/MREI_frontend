import React, { useState } from 'react';
import { BookOpen, Users, Plus, Edit2, Trash2, Eye, Search, Filter } from 'lucide-react';
import { useTutorDashboard } from '../../hooks/useTutorDashboard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import FormModal from '../ui/FormModal';
import ProgressBar from '../ui/ProgressBar';




const CourseManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [_showCreateModal, setShowCreateModal] = useState(false);


  const {
    courses,
    students,
    assignments,
    coursesLoading,
    studentsLoading,
    assignmentsLoading
  } = useTutorDashboard();

  // Filter courses
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && course.is_active) ||
                         (filterStatus === 'inactive' && !course.is_active);
    return matchesSearch && matchesFilter;
  }) || [];

  // Calculate course stats
  const getCourseStats = (course) => {
    const courseStudents = students?.filter(s => s.enrollments?.some(e => e.course === course.id)) || [];
    const courseAssignments = assignments?.filter(a => a.course === course.id) || [];
    const completedAssignments = courseAssignments.filter(a => a.submissions?.some(s => s.grade)).length;
    const totalAssignments = courseAssignments.length;
    const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

    return {
      studentsCount: courseStudents.length,
      assignmentsCount: totalAssignments,
      completionRate,
      gradedAssignments: completedAssignments
    };
  };

  if (coursesLoading || studentsLoading || assignmentsLoading) {
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
        <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
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
            <option value="all">All Courses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const stats = getCourseStats(course);
          
          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Course Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.code}</p>
                    <p className="text-xs text-gray-500 mt-1">{course.description?.substring(0, 80)}...</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course);
                        // Handle view course details
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowCreateModal(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-lg font-bold text-gray-900">{stats.studentsCount}</span>
                    </div>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BookOpen className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-gray-900">{stats.assignmentsCount}</span>
                    </div>
                    <p className="text-xs text-gray-600">Assignments</p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium">{stats.completionRate}%</span>
                  </div>
                  <ProgressBar progress={stats.completionRate} color="blue" />
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.gradedAssignments} of {stats.assignmentsCount} assignments graded
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      // Handle view students
                    }}
                  >
                    View Students
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      // Handle view assignments
                    }}
                  >
                    View Work
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first course.'}
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <FormModal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={`Course Details: ${selectedCourse.title}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Course Information */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Course Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                  <p className="text-gray-900">{selectedCourse.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs rounded ${
                    selectedCourse.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedCourse.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900">{selectedCourse.description}</p>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Enrolled Students</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {students?.filter(s => s.enrollments?.some(e => e.course === selectedCourse.id)).map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{student.first_name} {student.last_name}</p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Enrolled: {student.enrollments?.find(e => e.course === selectedCourse.id)?.enrollment_date ? 
                          new Date(student.enrollments.find(e => e.course === selectedCourse.id).enrollment_date).toLocaleDateString() : 
                          'Unknown'}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-600 text-center py-4">No students enrolled</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Recent Activity</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {assignments?.filter(a => a.course === selectedCourse.id).slice(0, 5).map(assignment => (
                  <div key={assignment.id} className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(assignment.due_date).toLocaleDateString()} • 
                      {assignment.submissions?.length || 0} submissions
                    </p>
                  </div>
                )) || (
                  <p className="text-gray-600 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default CourseManagement;

