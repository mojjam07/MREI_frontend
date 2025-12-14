import React, { useState } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, Search, Filter, Download, Eye, Edit, Save } from 'lucide-react';
import { useTutorDashboard } from '../../hooks/useTutorDashboard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import FormModal from '../ui/FormModal';
import ProgressBar from '../ui/ProgressBar';

const AssignmentGrading = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingData, setGradingData] = useState({ grade: '', feedback: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignment, setFilterAssignment] = useState('all');


  const {
    assignments,
    students,
    assignmentsLoading,
    coursesLoading,
    studentsLoading,
    gradeSubmission,
    gradingSubmission
  } = useTutorDashboard();

  // Get all submissions from assignments
  const getAllSubmissions = () => {
    const submissions = [];
    assignments?.forEach(assignment => {
      assignment.submissions?.forEach(submission => {
        submissions.push({
          ...submission,
          assignment: {
            ...assignment,
            course: assignment.course
          }
        });
      });
    });
    return submissions;
  };

  // Filter submissions
  const filteredSubmissions = getAllSubmissions().filter(submission => {
    const matchesSearch = 
      submission.assignment?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.assignment?.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      students?.find(s => s.id === submission.student)?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      students?.find(s => s.id === submission.student)?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'pending' && !submission.grade) ||
      (filterStatus === 'graded' && submission.grade) ||
      (filterStatus === 'late' && new Date(submission.assignment?.due_date) < new Date(submission.created_at) && !submission.grade);
    
    const matchesAssignment = filterAssignment === 'all' || submission.assignment?.id === parseInt(filterAssignment);
    
    return matchesSearch && matchesStatus && matchesAssignment;
  }).sort((a, b) => {
    // Sort by due date first, then by submission date
    if (a.assignment?.due_date !== b.assignment?.due_date) {
      return new Date(a.assignment?.due_date) - new Date(b.assignment?.due_date);
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Get grading statistics
  const getGradingStats = () => {
    const total = filteredSubmissions.length;
    const graded = filteredSubmissions.filter(s => s.grade).length;
    const pending = total - graded;
    const overdue = filteredSubmissions.filter(s => 
      !s.grade && new Date(s.assignment?.due_date) < new Date()
    ).length;
    
    return { total, graded, pending, overdue };
  };

  const stats = getGradingStats();

  // Handle grading submission
  const handleGrading = async () => {
    if (!selectedSubmission || !gradingData.grade.trim()) return;
    
    try {
      await gradeSubmission({
        submissionId: selectedSubmission.id,
        grade: gradingData.grade,
        feedback: gradingData.feedback
      });
      setShowGradingModal(false);
      setSelectedSubmission(null);
      setGradingData({ grade: '', feedback: '' });
    } catch (error) {
      console.error('Error grading submission:', error);
    }
  };

  // Get student name
  const getStudentName = (studentId) => {
    const student = students?.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown Student';
  };

  // Get submission status
  const getSubmissionStatus = (submission) => {
    if (submission.grade) return 'graded';
    if (new Date(submission.assignment?.due_date) < new Date(submission.created_at)) return 'late';
    if (new Date(submission.assignment?.due_date) < new Date()) return 'overdue';
    return 'pending';
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'graded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (assignmentsLoading || coursesLoading || studentsLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Assignment Grading</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search submissions..."
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
            <option value="pending">Pending</option>
            <option value="graded">Graded</option>
            <option value="late">Late</option>
            <option value="overdue">Overdue</option>
          </select>
          <select
            value={filterAssignment}
            onChange={(e) => setFilterAssignment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Assignments</option>
            {assignments?.map(assignment => (
              <option key={assignment.id} value={assignment.id}>{assignment.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Graded</p>
              <p className="text-2xl font-bold text-green-600">{stats.graded}</p>
              <p className="text-xs text-gray-500">
                {stats.total > 0 ? Math.round((stats.graded / stats.total) * 100) : 0}% complete
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Grading Progress</span>
            <span className="font-medium">{stats.graded}/{stats.total} graded</span>
          </div>
          <ProgressBar 
            progress={stats.total > 0 ? (stats.graded / stats.total) * 100 : 0} 
            color="blue" 
          />
        </div>
      </Card>

      {/* Submissions Table */}
      <Card title="Submissions to Grade">
        <DataTable
          data={filteredSubmissions}
          columns={[
            { 
              key: 'student', 
              label: 'Student', 
              render: (_, submission) => {
                const studentName = getStudentName(submission.student);
                return (
                  <div>
                    <p className="font-medium text-gray-900">{studentName}</p>
                    <p className="text-sm text-gray-500">
                      {students?.find(s => s.id === submission.student)?.email}
                    </p>
                  </div>
                );
              }
            },
            { 
              key: 'assignment', 
              label: 'Assignment', 
              render: (_, submission) => (
                <div>
                  <p className="font-medium text-gray-900">{submission.assignment?.title}</p>
                  <p className="text-sm text-gray-500">{submission.assignment?.course?.title}</p>
                </div>
              )
            },
            { 
              key: 'dueDate', 
              label: 'Due Date', 
              render: (_, submission) => (
                <span className={`${
                  new Date(submission.assignment?.due_date) < new Date(submission.created_at) ? 'text-red-600' : 
                  new Date(submission.assignment?.due_date) < new Date() ? 'text-orange-600' : 'text-gray-900'
                }`}>
                  {new Date(submission.assignment?.due_date).toLocaleDateString()}
                </span>
              )
            },
            { 
              key: 'submittedDate', 
              label: 'Submitted', 
              render: (_, submission) => (
                <span className={`
                  ${new Date(submission.assignment?.due_date) < new Date(submission.created_at) ? 'text-red-600' : 'text-gray-900'}
                `}>
                  {new Date(submission.created_at).toLocaleDateString()}
                </span>
              )
            },
            { 
              key: 'status', 
              label: 'Status', 
              render: (_, submission) => {
                const status = getSubmissionStatus(submission);
                return (
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                );
              }
            },
            { 
              key: 'grade', 
              label: 'Grade', 
              render: (_, submission) => (
                submission.grade ? (
                  <span className="font-bold text-green-600">{submission.grade}</span>
                ) : (
                  <span className="text-gray-400">Not graded</span>
                )
              )
            },
            { 
              key: 'actions', 
              label: 'Actions', 
              render: (_, submission) => (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setShowGradingModal(true);
                      if (submission.grade) {
                        setGradingData({ 
                          grade: submission.grade, 
                          feedback: submission.feedback || '' 
                        });
                      } else {
                        setGradingData({ grade: '', feedback: '' });
                      }
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Handle download submission
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' || filterAssignment !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No student submissions to review yet.'}
          </p>
        </div>
      )}

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <FormModal
          isOpen={showGradingModal}
          onClose={() => {
            setShowGradingModal(false);
            setSelectedSubmission(null);
            setGradingData({ grade: '', feedback: '' });
          }}
          title={`Grade Submission - ${selectedSubmission.assignment?.title}`}
          size="lg"
          onSubmit={handleGrading}
        >
          <div className="space-y-6">
            {/* Student and Assignment Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Submission Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <p className="text-gray-900">{getStudentName(selectedSubmission.student)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment</label>
                  <p className="text-gray-900">{selectedSubmission.assignment?.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <p className="text-gray-900">{selectedSubmission.assignment?.course?.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <p className="text-gray-900">
                    {new Date(selectedSubmission.assignment?.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                  <p className="text-gray-900">
                    {new Date(selectedSubmission.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Submission
                  </Button>
                </div>
              </div>
            </div>

            {/* Grading Form */}
            <div>
              <h4 className="font-semibold mb-3">Grade Submission</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                  <input
                    type="text"
                    value={gradingData.grade}
                    onChange={(e) => setGradingData({...gradingData, grade: e.target.value})}
                    placeholder="Enter grade (e.g., A, 85%, 4.0)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                  <textarea
                    value={gradingData.feedback}
                    onChange={(e) => setGradingData({...gradingData, feedback: e.target.value})}
                    placeholder="Provide feedback to the student..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            {/* Previous Grade (if exists) */}
            {selectedSubmission.grade && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">Previous Grade</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Previous Grade</label>
                    <p className="text-blue-900 font-bold">{selectedSubmission.grade}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Previous Feedback</label>
                    <p className="text-blue-900">{selectedSubmission.feedback || 'No feedback provided'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowGradingModal(false);
                  setSelectedSubmission(null);
                  setGradingData({ grade: '', feedback: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGrading}
                disabled={gradingSubmission || !gradingData.grade.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                {gradingSubmission ? 'Saving...' : (selectedSubmission.grade ? 'Update Grade' : 'Submit Grade')}
              </Button>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default AssignmentGrading;

