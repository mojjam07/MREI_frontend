import React from 'react';
import { BookOpen, Calendar, FileText, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';

const StudentDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const courses = [
    { id: 1, name: 'Advanced Mathematics', progress: 75, nextClass: '2024-12-10 10:00' },
    { id: 2, name: 'Physics Fundamentals', progress: 60, nextClass: '2024-12-11 14:00' },
    { id: 3, name: 'Computer Science', progress: 85, nextClass: '2024-12-09 16:00' }
  ];

  const assignments = [
    { id: 1, title: 'Calculus Problem Set', course: 'Mathematics', due: '2024-12-15', status: 'pending' },
    { id: 2, title: 'Lab Report', course: 'Physics', due: '2024-12-12', status: 'inProgress' },
    { id: 3, title: 'Programming Project', course: 'CS', due: '2024-12-20', status: 'completed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pt-6 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('student.dashboard')}</h1>
          <p className="text-gray-600">{t('student.welcome')}, {user.name}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title={t('student.courses')}
            value="6"
            change="+2 this semester"
            color="blue"
          />
          <StatCard
            icon={Calendar}
            title={t('student.upcoming')}
            value="12"
            change="3 today"
            color="green"
          />
          <StatCard
            icon={FileText}
            title={t('student.assignments')}
            value="8"
            change="2 due soon"
            color="orange"
          />
          <StatCard
            icon={TrendingUp}
            title={t('student.progress')}
            value="73%"
            change="+5% this week"
            color="purple"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card title={t('student.courses')}>
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
            <Button className="w-full mt-4" variant="outline">{t('student.viewAll')}</Button>
          </Card>

          <Card title={t('student.assignments')}>
            <div className="space-y-3">
              {assignments.map(assignment => (
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
          </Card>

          <Card title={t('tutor.performance')}>
            <div className="space-y-4">
              {['Advanced Mathematics', 'Calculus II', 'Statistics'].map((course, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{course}</span>
                    <span className="text-sm text-gray-600">{90 - idx * 3}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${90 - idx * 3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
