import React, { useState, useMemo } from 'react';
import { TrendingUp, Award, Target, Calendar, BookOpen, BarChart3, PieChart } from 'lucide-react';
import { useStudentDashboard } from '../../hooks/useStudentDashboard';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import StatCard from '../ui/StatCard';

const ProgressTracking = () => {
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'courses', 'analytics'
  const [timeRange, setTimeRange] = useState('semester'); // 'week', 'month', 'semester', 'year'


  const {
    enrolledCourses,
    assignments,
    submissions,
    calculateCourseProgress,
    loading
  } = useStudentDashboard();

  // Calculate overall progress data
  const overallProgress = useMemo(() => {
    if (!enrolledCourses || !assignments || !submissions) return null;

    const totalCourses = enrolledCourses.length;
    const totalAssignments = assignments.length;
    const completedSubmissions = submissions.filter(s => s.status === 'graded').length;
    
    // Calculate average course progress
    const averageCourseProgress = totalCourses > 0 
      ? Math.round(enrolledCourses.reduce((sum, course) => 
          sum + calculateCourseProgress(course.course?.id), 0) / totalCourses)
      : 0;

    // Calculate assignment completion rate
    const assignmentCompletionRate = totalAssignments > 0 
      ? Math.round((completedSubmissions / totalAssignments) * 100)
      : 0;

    // Calculate GPA (if grades are available)
    const gradedSubmissions = submissions.filter(s => s.grade && s.status === 'graded');
    const gpa = gradedSubmissions.length > 0 
      ? (gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / gradedSubmissions.length)
      : 0;

    return {
      totalCourses,
      totalAssignments,
      completedSubmissions,
      averageCourseProgress,
      assignmentCompletionRate,
      gpa: Math.round(gpa * 10) / 10,
      gradedSubmissions: gradedSubmissions.length
    };
  }, [enrolledCourses, assignments, submissions, calculateCourseProgress]);

  // Course progress breakdown
  const courseProgressBreakdown = useMemo(() => {
    if (!enrolledCourses) return [];

    return enrolledCourses.map(enrollment => {
      const progress = calculateCourseProgress(enrollment.course?.id);
      const courseAssignments = assignments?.filter(a => a.course === enrollment.course?.id) || [];
      const courseSubmissions = submissions?.filter(s => {
        const assignment = assignments?.find(a => a.id === s.assignment);
        return assignment?.course === enrollment.course?.id;
      }) || [];

      const completedAssignments = courseSubmissions.filter(s => s.status === 'graded').length;
      const averageGrade = courseSubmissions.length > 0 
        ? courseSubmissions.filter(s => s.grade).reduce((sum, s) => sum + s.grade, 0) / 
          courseSubmissions.filter(s => s.grade).length
        : 0;

      return {
        id: enrollment.course?.id,
        title: enrollment.course?.title,
        code: enrollment.course?.code,
        progress,
        totalAssignments: courseAssignments.length,
        completedAssignments,
        averageGrade: Math.round(averageGrade * 10) / 10,
        lastActivity: enrollment.updated_at || enrollment.enrolled_at,
        instructor: enrollment.course?.instructor
      };
    }).sort((a, b) => b.progress - a.progress);
  }, [enrolledCourses, assignments, submissions, calculateCourseProgress]);

  // Performance trends (mock data for visualization)
  const performanceTrends = useMemo(() => {
    // In a real app, this would come from the backend
    return [
      { period: 'Week 1', progress: 20, grade: 75 },
      { period: 'Week 2', progress: 35, grade: 78 },
      { period: 'Week 3', progress: 45, grade: 82 },
      { period: 'Week 4', progress: 60, grade: 85 },
      { period: 'Week 5', progress: 75, grade: 88 },
      { period: 'Week 6', progress: 85, grade: 90 },
    ];
  }, []);

  // Achievement milestones
  const achievements = useMemo(() => {
    const milestoneData = [];
    
    if (overallProgress?.completedSubmissions >= 5) {
      milestoneData.push({
        title: 'Assignment Master',
        description: 'Completed 5 assignments',
        icon: '🏆',
        achieved: true
      });
    }
    
    if (overallProgress?.averageCourseProgress >= 50) {
      milestoneData.push({
        title: 'Halfway Hero',
        description: '50% course completion',
        icon: '🎯',
        achieved: true
      });
    }
    
    if (overallProgress?.gpa >= 3.5) {
      milestoneData.push({
        title: 'Academic Excellence',
        description: 'GPA above 3.5',
        icon: '⭐',
        achieved: true
      });
    }

    // Future milestones
    if (overallProgress?.completedSubmissions < 10) {
      milestoneData.push({
        title: 'Dedicated Learner',
        description: 'Complete 10 assignments',
        icon: '📚',
        achieved: false,
        progress: Math.min((overallProgress.completedSubmissions / 10) * 100, 100)
      });
    }

    return milestoneData;
  }, [overallProgress]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Progress Tracking</h2>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'overview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('courses')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'courses' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Course Progress
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'analytics' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Analytics
            </button>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Overall Stats */}
      {overallProgress && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={BookOpen}
            title="Courses Enrolled"
            value={overallProgress.totalCourses.toString()}
            change={`${courseProgressBreakdown.filter(c => c.progress > 0).length} active`}
            color="blue"
          />
          <StatCard
            icon={Target}
            title="Assignment Progress"
            value={`${overallProgress.assignmentCompletionRate}%`}
            change={`${overallProgress.completedSubmissions}/${overallProgress.totalAssignments} completed`}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            title="Average Course Progress"
            value={`${overallProgress.averageCourseProgress}%`}
            change="Across all courses"
            color="purple"
          />
          <StatCard
            icon={Award}
            title="Current GPA"
            value={overallProgress.gpa.toString()}
            change={`${overallProgress.gradedSubmissions} graded assignments`}
            color="orange"
          />
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Progress */}
          <Card title="Course Progress Overview">
            {courseProgressBreakdown.length > 0 ? (
              <div className="space-y-4">
                {courseProgressBreakdown.slice(0, 5).map(course => (
                  <div key={course.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">{course.instructor}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">{course.progress}%</span>
                        <p className="text-xs text-gray-500">{course.completedAssignments}/{course.totalAssignments} assignments</p>
                      </div>
                    </div>
                    <ProgressBar progress={course.progress} color="blue" />
                    {course.averageGrade > 0 && (
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>Average Grade: {course.averageGrade}%</span>
                        <span>Last Activity: {new Date(course.lastActivity).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No course data available</p>
            )}
          </Card>

          {/* Achievements */}
          <Card title="Achievements & Milestones">
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${achievement.achieved ? 'text-green-700' : 'text-gray-700'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    {!achievement.achieved && achievement.progress !== undefined && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{Math.round(achievement.progress)}% complete</p>
                      </div>
                    )}
                  </div>
                  {achievement.achieved && (
                    <Award className="w-5 h-5 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {viewMode === 'courses' && (
        <Card title="Detailed Course Progress">
          {courseProgressBreakdown.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseProgressBreakdown.map(course => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600">{course.code}</p>
                      <p className="text-sm text-gray-500">{course.instructor}</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{course.progress}%</span>
                  </div>
                  
                  <ProgressBar progress={course.progress} color="blue" className="mb-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assignments</span>
                      <span className="font-medium">{course.completedAssignments}/{course.totalAssignments}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average Grade</span>
                      <span className="font-medium">{course.averageGrade || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Activity</span>
                      <span className="font-medium">{new Date(course.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-12">No courses enrolled</p>
          )}
        </Card>
      )}

      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <Card title="Performance Trends">
            <div className="space-y-4">
              {performanceTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{trend.period}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="font-medium">{trend.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Grade:</span>
                      <span className="font-medium">{trend.grade}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Summary */}
          <Card title="Performance Summary">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Strengths</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Consistent assignment submission</li>
                  <li>• High engagement in course discussions</li>
                  <li>• Strong performance in practical assignments</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Areas for Improvement</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Increase participation in group projects</li>
                  <li>• Review theoretical concepts more thoroughly</li>
                  <li>• Improve time management for assignments</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Recommendations</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Schedule regular study sessions</li>
                  <li>• Attend office hours for challenging topics</li>
                  <li>• Form study groups with peers</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProgressTracking;
