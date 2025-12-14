import React, { useState } from 'react';
import { Users, BookOpen, TrendingUp, Award, Activity } from 'lucide-react';
import { useStudentManagement } from '../../hooks/useStudentManagement';
import DataTable from '../ui/DataTable';
import Button from '../ui/Button';
import FormModal from '../ui/FormModal';
import ProgressBar from '../ui/ProgressBar';

const StudentAnalytics = () => {

  const {
    students,
    studentsLoading,
    analyticsLoading,
    progressLoading,
    updateStudentStatus,
    updatingStatus,
    getStudentEnrollments,
    getStudentAssignments
  } = useStudentManagement();

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [filterGrade, setFilterGrade] = useState('all');

  // Filter students based on grade/performance
  const filteredStudents = students.filter(student => {
    if (filterGrade === 'all') return true;
    if (filterGrade === 'excellent') return student.average_grade >= 85;
    if (filterGrade === 'good') return student.average_grade >= 70 && student.average_grade < 85;
    if (filterGrade === 'average') return student.average_grade >= 60 && student.average_grade < 70;
    if (filterGrade === 'needs-improvement') return student.average_grade < 60;
    return true;
  });

  // Handle status update
  const handleStatusUpdate = async (studentId, newStatus) => {
    try {
      await updateStudentStatus({ id: studentId, status: newStatus });
      alert('Student status updated successfully!');
    } catch (error) {
      console.error('Error updating student status:', error);
      alert('Failed to update student status');
    }
  };

  // Handle student details view
  const handleViewStudentDetails = async (student) => {
    try {
      const [enrollments, assignments] = await Promise.all([
        getStudentEnrollments(student.id),
        getStudentAssignments(student.id)
      ]);
      
      setSelectedStudent({
        ...student,
        enrollments,
        assignments
      });
      setShowStudentModal(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
      alert('Failed to load student details');
    }
  };

  // Table columns configuration
  const columns = [
    { 
      key: 'name', 
      label: 'Name',
      render: (student) => (
        <div>
          <div className="font-medium text-gray-900">
            {student.first_name} {student.last_name}
          </div>
          <div className="text-sm text-gray-500">@{student.username}</div>
        </div>
      )
    },
    { key: 'email', label: 'Email' },
    { 
      key: 'enrolled_courses', 
      label: 'Courses',
      render: (student) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
          {student.enrolled_courses || 0}
        </span>
      )
    },
    { 
      key: 'average_grade', 
      label: 'Average Grade',
      render: (student) => (
        <div className="flex items-center">
          <ProgressBar 
            progress={student.average_grade || 0} 
            color={
              student.average_grade >= 85 ? 'green' :
              student.average_grade >= 70 ? 'blue' :
              student.average_grade >= 60 ? 'yellow' : 'red'
            }
            size="sm"
          />
          <span className="ml-2 text-sm font-medium">
            {student.average_grade || 0}%
          </span>
        </div>
      )
    },
    { 
      key: 'completion_rate', 
      label: 'Completion Rate',
      render: (student) => (
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          (student.completion_rate || 0) >= 80 ? 'bg-green-100 text-green-800' :
          (student.completion_rate || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {student.completion_rate || 0}%
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (student) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          student.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {student.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (student) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewStudentDetails(student)}
          >
            View Details
          </Button>
          <select
            value={student.is_active ? 'active' : 'inactive'}
            onChange={(e) => handleStatusUpdate(student.id, e.target.value)}
            disabled={updatingStatus}
            className="text-xs px-2 py-1 border border-gray-300 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )
    }
  ];

  if (studentsLoading || analyticsLoading || progressLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading student analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Student Analytics & Management</h2>
        <div className="flex gap-4">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Students</option>
            <option value="excellent">Excellent (85%+)</option>
            <option value="good">Good (70-84%)</option>
            <option value="average">Average (60-69%)</option>

            <option value="needs-improvement">Needs Improvement (less than 60%)</option>
          </select>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-900">{students.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Active Students</p>
              <p className="text-2xl font-bold text-green-900">
                {students.filter(s => s.is_active).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Avg Grade</p>
              <p className="text-2xl font-bold text-purple-900">
                {(students.reduce((sum, s) => sum + (s.average_grade || 0), 0) / students.length || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Avg Completion</p>
              <p className="text-2xl font-bold text-orange-900">
                {(students.reduce((sum, s) => sum + (s.completion_rate || 0), 0) / students.length || 0).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Distribution Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Performance Distribution</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {students.filter(s => (s.average_grade || 0) >= 85).length}
            </p>
            <p className="text-sm text-gray-600">Excellent (85%+)</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {students.filter(s => (s.average_grade || 0) >= 70 && (s.average_grade || 0) < 85).length}
            </p>
            <p className="text-sm text-gray-600">Good (70-84%)</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {students.filter(s => (s.average_grade || 0) >= 60 && (s.average_grade || 0) < 70).length}
            </p>
            <p className="text-sm text-gray-600">Average (60-69%)</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {students.filter(s => (s.average_grade || 0) < 60).length}
            </p>
            <p className="text-sm text-gray-600">Needs Improvement</p>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <DataTable
        data={filteredStudents}
        columns={columns}
        searchable
        pagination
        itemsPerPage={10}
      />

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <FormModal
          isOpen={showStudentModal}
          onClose={() => {
            setShowStudentModal(false);
            setSelectedStudent(null);
          }}
          title={`Student Details - ${selectedStudent.first_name} ${selectedStudent.last_name}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-gray-900">{selectedStudent.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedStudent.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="text-gray-900">{selectedStudent.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="text-gray-900">{selectedStudent.last_name}</p>
                </div>
              </div>
            </div>

            {/* Academic Performance */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Academic Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedStudent.enrollments?.length || 0}</p>
                  <p className="text-sm text-gray-600">Enrolled Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedStudent.average_grade || 0}%</p>
                  <p className="text-sm text-gray-600">Average Grade</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedStudent.completion_rate || 0}%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            {selectedStudent.enrollments && selectedStudent.enrollments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Enrolled Courses</h3>
                <div className="space-y-2">
                  {selectedStudent.enrollments.map(enrollment => (
                    <div key={enrollment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{enrollment.course?.title}</p>
                        <p className="text-sm text-gray-600">{enrollment.course?.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Grade: {enrollment.grade || 'N/A'}</p>
                        <p className="text-xs text-gray-500">
                          Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Assignments */}
            {selectedStudent.assignments && selectedStudent.assignments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Assignments</h3>
                <div className="space-y-2">
                  {selectedStudent.assignments.slice(0, 5).map(assignment => {
                    const submission = assignment.submissions?.find(s => s.student === selectedStudent.id);
                    return (
                      <div key={assignment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-gray-600">{assignment.course?.title}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            submission?.grade ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {submission?.grade ? `Graded: ${submission.grade}` : 'Pending'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default StudentAnalytics;
