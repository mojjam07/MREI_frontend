import React, { useState } from 'react';

const StatsSection = ({ t, statValues = {} }) => {
  const safeStats = statValues || {};
  const [activeTab, setActiveTab] = useState('overview');

  const overviewStats = [
    { label: t('statValues.totalUsers') || 'Total Users', value: safeStats.totalUsers || 0, color: 'text-blue-400', icon: '👥' },
    { label: t('statValues.totalStudents') || 'Total Students', value: safeStats.totalStudents || 0, color: 'text-green-400', icon: '🎓' },
    { label: t('statValues.totalTutors') || 'Total Tutors', value: safeStats.totalTutors || 0, color: 'text-purple-400', icon: '👨‍🏫' },
    { label: t('statValues.totalNews') || 'News Articles', value: safeStats.totalNews || 0, color: 'text-yellow-400', icon: '📰' },
    { label: t('statValues.totalEvents') || 'Events', value: safeStats.totalEvents || 0, color: 'text-red-400', icon: '📅' },
    { label: t('statValues.totalTestimonials') || 'Testimonials', value: safeStats.totalTestimonials || 0, color: 'text-indigo-400', icon: '💬' },
  ];

  const dashboardStats = [
    { label: t('statValues.activeUsers') || 'Active Users', value: safeStats.activeUsers || 0, color: 'text-emerald-400', icon: '🔥' },
    { label: t('statValues.newUsersToday') || 'New Users Today', value: safeStats.newUsersToday || 0, color: 'text-cyan-400', icon: '🆕' },
    { label: t('statValues.totalAdmins') || 'Total Admins', value: safeStats.totalAdmins || 0, color: 'text-orange-400', icon: '👑' },
    { label: t('statValues.systemHealth') || 'System Health', value: safeStats.systemHealth || 'Good', color: 'text-lime-400', icon: '❤️' },
    { label: t('statValues.databaseSize') || 'Database Size', value: `${safeStats.databaseSize || 0} MB`, color: 'text-pink-400', icon: '💾' },
    { label: t('statValues.uptime') || 'Uptime', value: safeStats.uptime || '99.9%', color: 'text-teal-400', icon: '⏱️' },
  ];

  const contentStats = [
    { label: t('statValues.activeStudents') || 'Active Students', value: safeStats.activeStudents || 0, color: 'text-green-500', icon: '🎓' },
    { label: t('statValues.totalCourses') || 'Total Courses', value: safeStats.totalCourses || 0, color: 'text-blue-500', icon: '📚' },
    { label: t('statValues.totalAssignments') || 'Total Assignments', value: safeStats.totalAssignments || 0, color: 'text-purple-500', icon: '📝' },
    { label: t('statValues.pendingSubmissions') || 'Pending Submissions', value: safeStats.pendingSubmissions || 0, color: 'text-orange-500', icon: '⏳' },
    { label: t('statValues.completedSubmissions') || 'Completed Submissions', value: safeStats.completedSubmissions || 0, color: 'text-emerald-500', icon: '✅' },
    { label: t('statValues.totalEnrollments') || 'Total Enrollments', value: safeStats.totalEnrollments || 0, color: 'text-indigo-500', icon: '📊' },
  ];

  const communicationStats = [
    { label: t('statValues.totalMessages') || 'Total Messages', value: safeStats.totalMessages || 0, color: 'text-blue-400', icon: '💬' },
    { label: t('statValues.unreadMessages') || 'Unread Messages', value: safeStats.unreadMessages || 0, color: 'text-red-400', icon: '📬' },
    { label: t('statValues.repliedMessages') || 'Replied Messages', value: safeStats.repliedMessages || 0, color: 'text-green-400', icon: '📤' },
    { label: t('statValues.averageResponseTime') || 'Avg Response Time', value: `${safeStats.averageResponseTime || 0}h`, color: 'text-yellow-400', icon: '⏰' },
    { label: t('statValues.contactForms') || 'Contact Forms', value: safeStats.contactForms || 0, color: 'text-purple-400', icon: '📋' },
    { label: t('statValues.supportTickets') || 'Support Tickets', value: safeStats.supportTickets || 0, color: 'text-cyan-400', icon: '🎫' },
  ];

  const getCurrentStats = () => {
    switch (activeTab) {
      case 'dashboard':
        return dashboardStats;
      case 'content':
        return contentStats;
      case 'communication':
        return communicationStats;
      default:
        return overviewStats;
    }
  };

  const tabs = [
    { id: 'overview', label: t('dashboard.overview') || 'Overview', icon: '📊' },
    { id: 'dashboard', label: t('dashboard.dashboardStats') || 'Dashboard', icon: '🏠' },
    { id: 'content', label: t('dashboard.contentStats') || 'Content', icon: '📚' },
    { id: 'communication', label: t('dashboard.communicationStats') || 'Communication', icon: '💬' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <h2 className="text-3xl font-bold text-light-text mb-2">
          {t('dashboard.overview') || 'Dashboard Overview'}
        </h2>
        <p className="text-light-text/80">
          {t('dashboard.overviewDescription') || 'Real-time statistics and insights'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center animate-fade-in-up delay-100">
        <div 
          className="rounded-xl p-1 shadow-lg"
          style={{ 
            background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            boxShadow: '0 10px 40px rgba(233, 69, 96, 0.15)'
          }}
        >
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id 
                    ? 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)' 
                    : 'transparent',
                  border: activeTab === tab.id ? '1px solid #e94560' : '1px solid transparent',
                  boxShadow: activeTab === tab.id 
                    ? '0 4px 15px rgba(233, 69, 96, 0.4), 0 0 20px rgba(233, 69, 96, 0.2)' 
                    : 'none',
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {getCurrentStats().map((stat, index) => (
          <div
            key={index}
            className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-accent-color/30 hover-lift transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <p className="text-light-text/80 text-sm font-medium">{stat.label}</p>
                </div>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 flex items-center justify-center`}
              >
                <div className={`w-6 h-6 rounded-full ${stat.color.replace('text-', 'bg-')}`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-300">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">👥</span>
              <h3 className="text-lg font-semibold text-light-text">
                {t('dashboard.userEngagement') || 'User Engagement'}
              </h3>
            </div>
            <p className="text-light-text/80 text-sm">
              {t('dashboard.userEngagementDesc') || 'Track user activity and growth metrics'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📚</span>
              <h3 className="text-lg font-semibold text-light-text">
                {t('dashboard.contentManagement') || 'Content Management'}
              </h3>
            </div>
            <p className="text-light-text/80 text-sm">
              {t('dashboard.contentManagementDesc') || 'Monitor content creation and academic progress'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💬</span>
              <h3 className="text-lg font-semibold text-light-text">
                {t('dashboard.communicationHub') || 'Communication Hub'}
              </h3>
            </div>
            <p className="text-light-text/80 text-sm">
              {t('dashboard.communicationHubDesc') || 'Manage messages and support interactions'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsSection;
