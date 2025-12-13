import React from 'react';
import { BookOpen, Users, FileText, TrendingUp, Calendar, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';

const TutorDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { courses, assignments, coursesLoading, assignmentsLoading } = useDashboard();

  // Calculate stats
  const totalCourses = courses?.length || 0;
  const totalStudents = courses?.reduce((sum, course) => sum + (course.enrollments?.length || 0), 0) || 0;
  const totalAssignments = assignments?.length || 0;
  const completedAssignments = assignments?.filter(a => a.submissions?.some(s => s.grade)).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pt-6 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('tutor.dashboard')}</h1>
          <p className="text-gray-600">{t('tutor.welcome')}, {user?.first_name || user?.username}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title={t('tutor.courses')}
            value={totalCourses.toString()}
            change="Courses teaching"
            color="blue"
          />
          <StatCard
            icon={Users}
            title={t('tutor.students')}
            value={totalStudents.toString()}
            change="Total enrolled"
            color="green"
          />
          <StatCard
            icon={FileText}
            title={t('tutor.assignments')}
            value={totalAssignments.toString()}
            change="Assignments created"
            color="orange"
          />
          <StatCard
            icon={TrendingUp}
            title={t('tutor.completion')}
            value={totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) + '%' : '0%'}
            change="Assignment completion rate"
            color="purple"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card title={t('tutor.myCourses')}>
            <div className="space-y-4">
              {coursesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading courses...</p>
                </div>
              ) : courses && courses.length > 0 ? (
                courses.map(course => (
                  <div key={course.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{course.title}</h4>
                      <span className="text-sm text-gray-600">{course.code}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {course.enrollments?.length || 0} students enrolled
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">No courses assigned</p>
              )}
            </div>
            <Button className="w-full mt-4" variant="outline">
              {t('tutor.manageCourses')}
            </Button>
          </Card>

          <Card title={t('tutor.recentAssignments')}>
            <div className="space-y-3">
              {assignmentsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading assignments...</p>
                </div>
              ) : assignments && assignments.length > 0 ? (
                assignments.slice(0, 5).map(assignment => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">
                        {assignment.course?.title || 'Course'} • Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">
                        {assignment.submissions?.length || 0} submissions
                      </span>
                      <div className="text-xs text-gray-500">
                        {assignment.submissions?.filter(s => s.grade).length || 0} graded
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">No assignments created</p>
              )}
            </div>
            <Button className="w-full mt-4" variant="outline">
              {t('tutor.manageAssignments')}
            </Button>
          </Card>
        </div>

        <Card title={t('tutor.performance')}>
          <div className="space-y-4">
            {courses && courses.length > 0 ? (
              courses.map(course => {
                const courseAssignments = assignments?.filter(a => a.course === course.id) || [];
                const completed = courseAssignments.filter(a => a.submissions?.some(s => s.grade)).length;
                const total = courseAssignments.length;
                const progress = total > 0 ? (completed / total) * 100 : 0;

                return (
                  <div key={course.id}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{course.title}</span>
                      <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <ProgressBar progress={progress} color="green" />
                    <p className="text-xs text-gray-500 mt-1">
                      {completed} of {total} assignments graded
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600 text-center py-4">No course performance data available</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TutorDashboard;
