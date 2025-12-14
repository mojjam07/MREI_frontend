import React, { useState } from 'react';
import { Upload, FileText, Clock, CheckCircle, AlertCircle, Download, Eye, Send } from 'lucide-react';
import { useStudentDashboard } from '../../hooks/useStudentDashboard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import FormModal from '../ui/FormModal';
import ProgressBar from '../ui/ProgressBar';

const AssignmentSubmission = () => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    content: '',
    files: [],
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');

  const {
    assignments,
    submissions,
    enrolledCourses,
    submittingAssignment,
    uploadingFile,
    submitAssignment,
    uploadFile,
    getAssignmentStatus,
    loading
  } = useStudentDashboard();

  // Filter assignments
  const filteredAssignments = assignments?.filter(assignment => {
    const status = getAssignmentStatus(assignment.id);
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesCourse = filterCourse === 'all' || assignment.course === parseInt(filterCourse);
    
    return matchesStatus && matchesCourse;
  }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date)) || [];

  // Handle file upload
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const uploadedFiles = [];

    for (const file of files) {
      const result = await uploadFile(file, 'assignment');
      if (result) {
        uploadedFiles.push({
          id: result.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: result.url
        });
      }
    }

    setSubmissionData(prev => ({
      ...prev,
      files: [...prev.files, ...uploadedFiles]
    }));
  };

  // Remove file from submission
  const removeFile = (fileId) => {
    setSubmissionData(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  };

  // Handle assignment submission
  const handleSubmitAssignment = async () => {
    if (!submissionData.content.trim() && submissionData.files.length === 0) {
      alert('Please provide either text content or upload files');
      return;
    }

    const success = await submitAssignment(selectedAssignment.id, submissionData);
    if (success) {
      setShowSubmissionModal(false);
      setSubmissionData({
        content: '',
        files: [],
        notes: ''
      });
      setSelectedAssignment(null);
    }
  };

  // Get assignment status icon and color
  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'graded':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'late':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get course name
  const getCourseName = (courseId) => {
    const course = enrolledCourses?.find(c => c.course?.id === courseId);
    return course?.course?.title || 'Unknown Course';
  };

  // Calculate submission statistics
  const getSubmissionStats = () => {
    const total = assignments?.length || 0;
    const submitted = assignments?.filter(a => getAssignmentStatus(a.id) === 'submitted').length || 0;
    const graded = assignments?.filter(a => getAssignmentStatus(a.id) === 'graded').length || 0;
    const overdue = assignments?.filter(a => {
      const dueDate = new Date(a.due_date);
      const now = new Date();
      return dueDate < now && getAssignmentStatus(a.id) === 'not_submitted';
    }).length || 0;

    return { total, submitted, graded, overdue };
  };

  const stats = getSubmissionStats();

  if (loading) {
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
        <h2 className="text-2xl font-bold text-gray-800">Assignment Submissions</h2>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Assignments</option>
            <option value="not_submitted">Not Submitted</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
            <option value="late">Late</option>
          </select>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Courses</option>
            {enrolledCourses?.map(course => (
              <option key={course.course?.id} value={course.course?.id}>
                {course.course?.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Graded</p>
              <p className="text-2xl font-bold text-green-600">{stats.graded}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
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

      {/* Assignments Table */}
      <Card title="Assignments">
        <DataTable
          data={filteredAssignments}
          columns={[
            { 
              key: 'title', 
              label: 'Assignment', 
              render: (value, assignment) => (
                <div>
                  <p className="font-medium text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500">{getCourseName(assignment.course)}</p>
                </div>
              )
            },
            { 
              key: 'due_date', 
              label: 'Due Date', 
              render: (value) => {
                const dueDate = new Date(value);
                const now = new Date();
                const isOverdue = dueDate < now;
                return (
                  <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {dueDate.toLocaleDateString()}
                    {isOverdue && ' (Overdue)'}
                  </span>
                );
              }
            },
            { 
              key: 'status', 
              label: 'Status', 
              render: (_, assignment) => {
                const status = getAssignmentStatus(assignment.id);
                return (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(status)}`}>
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                );
              }
            },
            { 
              key: 'grade', 
              label: 'Grade', 
              render: (_, assignment) => {
                const submission = submissions?.find(s => s.assignment === assignment.id);
                if (submission?.grade) {
                  return (
                    <div className="text-center">
                      <span className="font-bold text-green-600">{submission.grade}%</span>
                      {submission.feedback && (
                        <p className="text-xs text-gray-500 mt-1">Feedback available</p>
                      )}
                    </div>
                  );
                }
                return <span className="text-gray-400">-</span>;
              }
            },
            { 
              key: 'actions', 
              label: 'Actions', 
              render: (_, assignment) => {
                const status = getAssignmentStatus(assignment.id);
                const canSubmit = status === 'not_submitted';
                const canView = status === 'submitted' || status === 'graded';
                
                return (
                  <div className="flex gap-2">
                    {canSubmit && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmissionModal(true);
                        }}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Submit
                      </Button>
                    )}
                    {canView && (
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                );
              }
            }
          ]}
        />
      </Card>

      {/* Empty State */}
      {filteredAssignments.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600 mb-6">
            {filterStatus !== 'all' || filterCourse !== 'all'
              ? 'Try adjusting your filters to see more assignments.'
              : 'You don\'t have any assignments yet.'}
          </p>
          {(filterStatus !== 'all' || filterCourse !== 'all') && (
            <Button 
              variant="outline"
              onClick={() => {
                setFilterStatus('all');
                setFilterCourse('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Submission Modal */}
      {showSubmissionModal && selectedAssignment && (
        <FormModal
          isOpen={showSubmissionModal}
          onClose={() => {
            setShowSubmissionModal(false);
            setSelectedAssignment(null);
            setSubmissionData({
              content: '',
              files: [],
              notes: ''
            });
          }}
          title={`Submit Assignment: ${selectedAssignment.title}`}
          size="lg"
          onSubmit={handleSubmitAssignment}
        >
          <div className="space-y-6">
            {/* Assignment Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedAssignment.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedAssignment.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Course: {getCourseName(selectedAssignment.course)}</span>
                <span>Due: {new Date(selectedAssignment.due_date).toLocaleDateString()}</span>
                <span>Points: {selectedAssignment.points || 'N/A'}</span>
              </div>
            </div>

            {/* Text Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Content (Optional)
              </label>
              <textarea
                value={submissionData.content}
                onChange={(e) => setSubmissionData({...submissionData, content: e.target.value})}
                placeholder="Write your assignment content here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="6"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Files
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop files here, or click to select files
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={uploadingFile}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" disabled={uploadingFile} as="span">
                      {uploadingFile ? 'Uploading...' : 'Choose Files'}
                    </Button>
                  </label>
                </div>
              </div>

              {/* Uploaded Files */}
              {submissionData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">Uploaded Files:</h5>
                  {submissionData.files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={submissionData.notes}
                onChange={(e) => setSubmissionData({...submissionData, notes: e.target.value})}
                placeholder="Any additional notes for your tutor..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSubmissionModal(false);
                  setSelectedAssignment(null);
                  setSubmissionData({
                    content: '',
                    files: [],
                    notes: ''
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAssignment}
                disabled={submittingAssignment || (!submissionData.content.trim() && submissionData.files.length === 0)}
              >
                {submittingAssignment ? 'Submitting...' : 'Submit Assignment'}
              </Button>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default AssignmentSubmission;
