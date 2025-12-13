
import React from 'react';
import { BookOpen, Calendar, FileText, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';


const StudentDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { 
    courses: enrollments, 
    assignments, 
    coursesLoading, 
    assignmentsLoading 
  } = useDashboard();

  // Transform enrollments to match expected course structure
  const courses = enrollments?.map(enrollment => ({
    id: enrollment.course?.id || enrollment.id,
    name: enrollment.course?.title || 'Course',
    progress: enrollment.grade ? Math.min(enrollment.grade, 100) : 0,
    nextClass: enrollment.course?.start_date || 'TBD',
    code: enrollment.course?.code || ''
  })) || [];

  // Transform assignments to match expected structure
  const transformedAssignments = assignments?.map(assignment => ({
    id: assignment.id,
    title: assignment.title,
    course: assignment.course?.title || 'Course',
    due: assignment.due_date,
    status: assignment.submissions?.[0]?.grade ? 'completed' : 
            assignment.submissions?.[0] ? 'inProgress' : 'pending'
  })) || [];

  const totalCourses = courses.length;
  const totalAssignments = transformedAssignments.length;
  const completedAssignments = transformedAssignments.filter(a => a.status === 'completed').length;
  const upcomingAssignments = transformedAssignments.filter(a => a.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pt-6 px-6">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('student.dashboard')}</h1>
          <p className="text-gray-600">{t('student.welcome')}, {user.first_name || user.username}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title={t('student.courses')}
            value={totalCourses.toString()}
            change="Enrolled courses"
            color="blue"
          />
          <StatCard
            icon={Calendar}
            title={t('student.upcoming')}
            value={upcomingAssignments.toString()}
            change="Due assignments"
            color="green"
          />
          <StatCard
            icon={FileText}
            title={t('student.assignments')}
            value={totalAssignments.toString()}
            change={`${completedAssignments} completed`}
            color="orange"
          />
          <StatCard
            icon={TrendingUp}
            title={t('student.progress')}
            value={totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) + '%' : '0%'}
            change="Assignment completion"
            color="purple"
          />
        </div>


        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card title={t('student.courses')}>
            {coursesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading courses...</p>
              </div>

            ) : courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{course.name}</h4>
                      <span className="text-sm text-gray-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Next class: {course.nextClass}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No courses enrolled</p>
            )}
            <Button className="w-full mt-4" variant="outline">{t('student.viewAll')}</Button>
          </Card>

          <Card title={t('student.assignments')}>
            {assignmentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading assignments...</p>
              </div>

            ) : transformedAssignments.length > 0 ? (
              <div className="space-y-3">
                {transformedAssignments.map(assignment => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">{assignment.course} • {t('student.dueDate')}: {assignment.due}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      assignment.status === 'inProgress' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {t(`student.${assignment.status}`)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No assignments</p>
            )}
            <Button className="w-full mt-4" variant="outline">{t('student.viewAll')}</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
