import React from 'react';
import { Users, TrendingUp, BarChart3, Award, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';

const AdminDashboard = () => {
  const { t } = useLanguage();

  const users = [
    { id: 1, name: 'Sarah Johnson', role: 'Student', email: 'sarah@edu.com', lastActive: '2 hours ago', status: 'active' },
    { id: 2, name: 'Michael Chen', role: 'Tutor', email: 'michael@edu.com', lastActive: '1 hour ago', status: 'active' },
    { id: 3, name: 'Emily Davis', role: 'Student', email: 'emily@edu.com', lastActive: '1 day ago', status: 'inactive' },
    { id: 4, name: 'David Kumar', role: 'Admin', email: 'david@edu.com', lastActive: '30 mins ago', status: 'active' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pt-6 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('admin.dashboard')}</h1>
          <p className="text-gray-600">{t('admin.overview')}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title={t('admin.totalUsers')}
            value="15,234"
            change="+234 this month"
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            title={t('admin.activeToday')}
            value="2,456"
            change="+12%"
            color="green"
          />
          <StatCard
            icon={BarChart3}
            title={t('admin.revenue')}
            value="$45,678"
            change="+18%"
            color="purple"
          />
          <StatCard
            icon={Award}
            title={t('admin.satisfaction')}
            value="4.8/5"
            change="+0.2"
            color="orange"
          />
        </div>

        <Card title={t('admin.users')}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('admin.role')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('admin.lastActive')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('student.status')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.role}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600">{user.lastActive}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          {t('common.edit')}
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
