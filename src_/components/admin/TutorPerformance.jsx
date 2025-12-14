import React, { useState } from 'react';
import { Users, BookOpen, Award, TrendingUp, Activity } from 'lucide-react';
import { useTutorManagement } from '../../hooks/useTutorManagement';
import DataTable from '../ui/DataTable';
import Button from '../ui/Button';
import FormModal from '../ui/FormModal';

const TutorPerformance = () => {

  const {
    tutors,
    tutorsLoading,
    performanceLoading,
    updateTutorStatus,
    updatingStatus,
    getTutorCourses,
    getTutorStudents
  } = useTutorManagement();

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter tutors based on status
  const filteredTutors = tutors.filter(tutor => {
    if (filterStatus === 'all') return true;
    return tutor.status === filterStatus;
  });

  // Handle status update
  const handleStatusUpdate = async (tutorId, newStatus) => {
    try {
      await updateTutorStatus({ id: tutorId, status: newStatus });
      alert('Tutor status updated successfully!');
    } catch (error) {
      console.error('Error updating tutor status:', error);
      alert('Failed to update tutor status');
    }
  };

  // Handle tutor details view
  const handleViewTutorDetails = async (tutor) => {
    try {
      const [courses, students] = await Promise.all([
        getTutorCourses(tutor.id),
        getTutorStudents(tutor.id)
      ]);
      
      setSelectedTutor({
        ...tutor,
        courses,
        students
      });
      setShowTutorModal(true);
    } catch (error) {
      console.error('Error fetching tutor details:', error);
      alert('Failed to load tutor details');
    }
  };

  // Table columns configuration
  const columns = [
    { 
      key: 'name', 
      label: 'Name',
      render: (tutor) => (
        <div>
          <div className="font-medium text-gray-900">
            {tutor.first_name} {tutor.last_name}
          </div>
          <div className="text-sm text-gray-500">@{tutor.username}</div>
        </div>
      )
    },
    { key: 'email', label: 'Email' },
    { 
      key: 'courses_taught', 
      label: 'Courses',
      render: (tutor) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
          {tutor.courses_taught || 0}
        </span>
      )
    },
    { 
      key: 'students_count', 
      label: 'Students',
      render: (tutor) => (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
          {tutor.students_count || 0}
        </span>
      )
    },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (tutor) => (
        <div className="flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < (tutor.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({tutor.rating || 0})
          </span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (tutor) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          tutor.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {tutor.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (tutor) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewTutorDetails(tutor)}
          >
            View Details
          </Button>
          <select
            value={tutor.is_active ? 'active' : 'inactive'}
            onChange={(e) => handleStatusUpdate(tutor.id, e.target.value)}
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

  if (tutorsLoading || performanceLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading tutor performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tutor Performance Management</h2>
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tutors</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Tutors</p>
              <p className="text-2xl font-bold text-blue-900">{tutors.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Active Tutors</p>
              <p className="text-2xl font-bold text-green-900">
                {tutors.filter(t => t.is_active).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Total Courses</p>
              <p className="text-2xl font-bold text-purple-900">
                {tutors.reduce((sum, tutor) => sum + (tutor.courses_taught || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Avg Rating</p>
              <p className="text-2xl font-bold text-orange-900">
                {(tutors.reduce((sum, tutor) => sum + (tutor.rating || 0), 0) / tutors.length || 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tutors Data Table */}
      <DataTable
        data={filteredTutors}
        columns={columns}
        searchable
        pagination
        itemsPerPage={10}
      />

      {/* Tutor Details Modal */}
      {showTutorModal && selectedTutor && (
        <FormModal
          isOpen={showTutorModal}
          onClose={() => {
            setShowTutorModal(false);
            setSelectedTutor(null);
          }}
          title={`Tutor Details - ${selectedTutor.first_name} ${selectedTutor.last_name}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-gray-900">{selectedTutor.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedTutor.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="text-gray-900">{selectedTutor.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="text-gray-900">{selectedTutor.last_name}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedTutor.courses?.length || 0}</p>
                  <p className="text-sm text-gray-600">Courses Taught</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedTutor.students?.length || 0}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedTutor.rating || 0}</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            </div>

            {/* Courses */}
            {selectedTutor.courses && selectedTutor.courses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Teaching Courses</h3>
                <div className="space-y-2">
                  {selectedTutor.courses.map(course => (
                    <div key={course.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-600">{course.code}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {course.enrollments?.length || 0} students
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default TutorPerformance;
