import React, { useState } from 'react';
import { Users, TrendingUp, Award, Search, Filter, Eye, Mail, Phone, Calendar } from 'lucide-react';
import { useTutorDashboard } from '../../hooks/useTutorDashboard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import FormModal from '../ui/FormModal';
import ProgressBar from '../ui/ProgressBar';

const StudentProgress = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [sortBy, setSortBy] = useState('name');


  const {
    students,
    courses,
    assignments,
    studentsLoading,
    coursesLoading,
    assignmentsLoading,
    sendingMessage
  } = useTutorDashboard();

  // Calculate student progress
  const getStudentProgress = (student) => {
    const studentEnrollments = student.enrollments || [];
    const studentAssignments = assignments?.filter(assignment => 
      assignment.submissions?.some(submission => submission.student === student.id)
    ) || [];

    let totalAssignments = 0;
    let gradedAssignments = 0;
    let totalScore = 0;
    let gradedCount = 0;

    studentAssignments.forEach(assignment => {
      totalAssignments++;
      const submission = assignment.submissions?.find(s => s.student === student.id);
      if (submission?.grade) {
        gradedAssignments++;
        totalScore += parseFloat(submission.grade);
        gradedCount++;
      }
    });

    const averageGrade = gradedCount > 0 ? (totalScore / gradedCount).toFixed(1) : 0;
    const completionRate = totalAssignments > 0 ? Math.round((gradedAssignments / totalAssignments) * 100) : 0;

    return {
      totalAssignments,
      gradedAssignments,
      averageGrade,
      completionRate,
      coursesCount: studentEnrollments.length
    };
  };

  // Filter and sort students
  const filteredStudents = students?.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filterCourse === 'all' || 
                         student.enrollments?.some(e => e.course === parseInt(filterCourse));
    
    return matchesSearch && matchesCourse;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
    }
    if (sortBy === 'grade') {
      const aProgress = getStudentProgress(a);
      const bProgress = getStudentProgress(b);
      return parseFloat(bProgress.averageGrade) - parseFloat(aProgress.averageGrade);
    }
    if (sortBy === 'completion') {
      const aProgress = getStudentProgress(a);
      const bProgress = getStudentProgress(b);
      return bProgress.completionRate - aProgress.completionRate;
    }
    return 0;
  }) || [];

  // Student performance data for charts
  const getStudentPerformanceData = () => {
    const gradeRanges = {
      'A (90-100)': 0,
      'B (80-89)': 0,
      'C (70-79)': 0,
      'D (60-69)': 0,
      'F (0-59)': 0
    };

    filteredStudents.forEach(student => {
      const progress = getStudentProgress(student);
      const grade = parseFloat(progress.averageGrade);
      
      if (grade >= 90) gradeRanges['A (90-100)']++;
      else if (grade >= 80) gradeRanges['B (80-89)']++;
      else if (grade >= 70) gradeRanges['C (70-79)']++;
      else if (grade >= 60) gradeRanges['D (60-69)']++;
      else if (grade > 0) gradeRanges['F (0-59)']++;
    });

    return gradeRanges;
  };

  const performanceData = getStudentPerformanceData();

  if (studentsLoading || coursesLoading || assignmentsLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Student Progress Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="grade">Sort by Grade</option>
            <option value="completion">Sort by Completion</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold text-gray-900">
                {(filteredStudents.reduce((sum, s) => sum + parseFloat(getStudentProgress(s).averageGrade), 0) / filteredStudents.length || 0).toFixed(1)}
              </p>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(filteredStudents.reduce((sum, s) => sum + getStudentProgress(s).completionRate, 0) / filteredStudents.length || 0)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Performers</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStudents.filter(s => parseFloat(getStudentProgress(s).averageGrade) >= 90).length}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Student Performance Chart */}
      <Card title="Grade Distribution">
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(performanceData).map(([range, count]) => (
            <div key={range} className="text-center">
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full border-4 border-blue-200 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">{count}</span>
                </div>
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 bg-blue-600 rounded-full"
                  style={{ height: `${Math.max(count * 8, 8)}px` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">{range}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Students Table */}
      <Card title="Student Progress Details">
        <DataTable
          data={filteredStudents}
          columns={[
            { 
              key: 'name', 
              label: 'Student', 
              render: (_, student) => (
                <div>
                  <p className="font-medium text-gray-900">{student.first_name} {student.last_name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              )
            },
            { 
              key: 'courses', 
              label: 'Courses', 
              render: (_, student) => {
                const progress = getStudentProgress(student);
                return <span className="font-medium">{progress.coursesCount}</span>;
              }
            },
            { 
              key: 'assignments', 
              label: 'Assignments', 
              render: (_, student) => {
                const progress = getStudentProgress(student);
                return (
                  <div className="text-sm">
                    <span className="font-medium">{progress.gradedAssignments}/{progress.totalAssignments}</span>
                    <div className="text-gray-500">completed</div>
                  </div>
                );
              }
            },
            { 
              key: 'averageGrade', 
              label: 'Average Grade', 
              render: (_, student) => {
                const progress = getStudentProgress(student);
                const grade = parseFloat(progress.averageGrade);
                const gradeColor = grade >= 90 ? 'text-green-600' : 
                                 grade >= 80 ? 'text-blue-600' : 
                                 grade >= 70 ? 'text-yellow-600' : 
                                 grade >= 60 ? 'text-orange-600' : 'text-red-600';
                return <span className={`font-bold ${gradeColor}`}>{progress.averageGrade}</span>;
              }
            },
            { 
              key: 'completionRate', 
              label: 'Completion Rate', 
              render: (_, student) => {
                const progress = getStudentProgress(student);
                return (
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{progress.completionRate}%</span>
                    </div>
                    <ProgressBar progress={progress.completionRate} color="blue" />
                  </div>
                );
              }
            },
            { 
              key: 'actions', 
              label: 'Actions', 
              render: (_, student) => (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowStudentModal(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Handle send message
                    }}
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <FormModal
          isOpen={showStudentModal}
          onClose={() => {
            setShowStudentModal(false);
            setSelectedStudent(null);
          }}
          title={`Student Details: ${selectedStudent.first_name} ${selectedStudent.last_name}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Student Information */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Student Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedStudent.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{selectedStudent.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <p className="text-gray-900">
                    {selectedStudent.date_joined ? new Date(selectedStudent.date_joined).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Progress Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Average Grade</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {getStudentProgress(selectedStudent).averageGrade}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Completion Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {getStudentProgress(selectedStudent).completionRate}%
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Courses Enrolled</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {getStudentProgress(selectedStudent).coursesCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Recent Submissions</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {assignments?.filter(a => 
                  a.submissions?.some(s => s.student === selectedStudent.id)
                ).slice(0, 10).map(assignment => {
                  const submission = assignment.submissions?.find(s => s.student === selectedStudent.id);
                  return (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600">
                          Course: {assignment.course?.title || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted: {submission?.created_at ? new Date(submission.created_at).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        {submission?.grade ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                            {submission.grade}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                            Pending
                          </span>
                        )}
                        {submission?.feedback && (
                          <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                            {submission.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }) || (
                  <p className="text-gray-600 text-center py-4">No submissions yet</p>
                )}
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Button
                onClick={() => {
                  // Handle send message
                }}
                disabled={sendingMessage}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              {selectedStudent.phone && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Handle call
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Student
                </Button>
              )}
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default StudentProgress;

