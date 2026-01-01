import React, { useState, useEffect } from 'react';
import apiClient from '../../../../services/apiClient';
import { API_ENDPOINTS } from '../../../../config';

const StatsSection = ({ t, statValues = {}, onRefresh }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const safeStats = statValues || {};
  const [activeTab, setActiveTab] = useState('overview');
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearResult, setClearResult] = useState(null);

  // Fetch dashboard stats from backend
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(API_ENDPOINTS.COMMS.DASHBOARD_STATS);
      if (response.data?.success && response.data?.data?.statistics) {
        setStats(response.data.data.statistics);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
      // Fall back to prop values
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Merge fetched stats with prop values (prop values take precedence for backward compatibility)
  const displayStats = { ...stats, ...safeStats };

  const overviewStats = [
    { label: t('statValues.totalUsers') || 'Total Users', value: displayStats.totalUsers || 0, color: 'text-indigo-400', icon: '👥', glow: 'glow-indigo' },
    { label: t('statValues.totalStudents') || 'Total Students', value: displayStats.totalStudents || 0, color: 'text-emerald-400', icon: '🎓', glow: 'glow-emerald' },
    { label: t('statValues.totalTutors') || 'Total Tutors', value: displayStats.totalTutors || 0, color: 'text-purple-400', icon: '👨‍🏫', glow: 'glow-purple' },
    { label: t('statValues.totalNews') || 'News Articles', value: displayStats.totalNews || 0, color: 'text-amber-400', icon: '📰', glow: 'glow-amber' },
    { label: t('statValues.totalEvents') || 'Events', value: displayStats.totalEvents || 0, color: 'text-rose-400', icon: '📅', glow: 'glow-rose' },
    { label: t('statValues.totalTestimonials') || 'Testimonials', value: displayStats.totalTestimonials || 0, color: 'text-cyan-400', icon: '💬', glow: 'glow-blue' },
  ];

  const dashboardStats = [
    { label: t('statValues.activeUsers') || 'Active Users', value: displayStats.activeUsers || 0, color: 'text-emerald-400', icon: '🔥', glow: 'glow-emerald' },
    { label: t('statValues.newUsersToday') || 'New Users Today', value: displayStats.newUsersToday || 0, color: 'text-cyan-400', icon: '🆕', glow: 'glow-blue' },
    { label: t('statValues.totalAdmins') || 'Total Admins', value: displayStats.totalAdmins || 0, color: 'text-orange-400', icon: '👑', glow: 'glow-amber' },
    { label: t('statValues.systemHealth') || 'System Health', value: displayStats.systemHealth || 'Good', color: 'text-lime-400', icon: '❤️', glow: 'glow-green' },
    { label: t('statValues.databaseSize') || 'Database Size', value: `${displayStats.databaseSize || 0} MB`, color: 'text-pink-400', icon: '💾', glow: 'glow-rose' },
    { label: t('statValues.uptime') || 'Uptime', value: displayStats.uptime || '99.9%', color: 'text-teal-400', icon: '⏱️', glow: 'glow-emerald' },
  ];

  const contentStats = [
    { label: t('statValues.activeStudents') || 'Active Students', value: displayStats.activeStudents || 0, color: 'text-green-500', icon: '🎓', glow: 'glow-emerald' },
    { label: t('statValues.totalCourses') || 'Total Courses', value: displayStats.totalCourses || 0, color: 'text-blue-500', icon: '📚', glow: 'glow-blue' },
    { label: t('statValues.totalAssignments') || 'Total Assignments', value: displayStats.totalAssignments || 0, color: 'text-purple-500', icon: '📝', glow: 'glow-purple' },
    { label: t('statValues.pendingSubmissions') || 'Pending Submissions', value: displayStats.pendingSubmissions || 0, color: 'text-orange-500', icon: '⏳', glow: 'glow-amber' },
    { label: t('statValues.completedSubmissions') || 'Completed Submissions', value: displayStats.completedSubmissions || 0, color: 'text-emerald-500', icon: '✅', glow: 'glow-emerald' },
    { label: t('statValues.totalEnrollments') || 'Total Enrollments', value: displayStats.totalEnrollments || 0, color: 'text-indigo-500', icon: '📊', glow: 'glow-indigo' },
  ];

  const communicationStats = [
    { label: t('statValues.totalMessages') || 'Total Messages', value: displayStats.totalMessages || 0, color: 'text-blue-400', icon: '💬', glow: 'glow-blue' },
    { label: t('statValues.unreadMessages') || 'Unread Messages', value: displayStats.unreadMessages || 0, color: 'text-red-400', icon: '📬', glow: 'glow-rose' },
    { label: t('statValues.repliedMessages') || 'Replied Messages', value: displayStats.repliedMessages || 0, color: 'text-green-400', icon: '📤', glow: 'glow-emerald' },
    { label: t('statValues.averageResponseTime') || 'Avg Response Time', value: `${displayStats.averageResponseTime || 0}h`, color: 'text-yellow-400', icon: '⏰', glow: 'glow-amber' },
    { label: t('statValues.contactForms') || 'Contact Forms', value: displayStats.contactForms || 0, color: 'text-purple-400', icon: '📋', glow: 'glow-purple' },
    { label: t('statValues.supportTickets') || 'Support Tickets', value: displayStats.supportTickets || 0, color: 'text-cyan-400', icon: '🎫', glow: 'glow-blue' },
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

  const handleClearAllData = async () => {
    setIsClearing(true);
    setClearResult(null);

    try {
      const response = await apiClient.delete(API_ENDPOINTS.ADMIN.CLEAR_ALL);
      
      if (response.data.success) {
        setClearResult({
          success: true,
          message: response.data.message || 'All admin data cleared successfully!'
        });
        
        // Refresh stats after clearing
        if (onRefresh) {
          onRefresh();
        }
        
        // Close modal after 3 seconds
        setTimeout(() => {
          setShowClearModal(false);
          setClearResult(null);
        }, 3000);
      } else {
        setClearResult({
          success: false,
          message: response.data.message || 'Failed to clear data'
        });
      }
    } catch (error) {
      console.error('Clear all data error:', error);
      setClearResult({
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to clear data. Make sure you are logged in as admin.'
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          {t('dashboard.overview') || 'Dashboard Overview'}
        </h2>
        <p className="text-light-text/80">
          {t('dashboard.overviewDescription') || 'Real-time statistics and insights'}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">
            {t('dashboard.errorLoadingStats') || 'Error loading stats'}: {error}
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex justify-center animate-fade-in-up delay-100">
        <div className="glass-card p-1">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 hover-lift ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg glow-indigo'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear All Button - Only show on overview tab */}
      {activeTab === 'overview' && (
        <div className="flex justify-end animate-fade-in-up delay-100">
          <button
            onClick={() => setShowClearModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover-lift flex items-center gap-2"
          >
            <span>🗑️</span>
            {t('dashboard.clearAllData') || 'Clear All Admin Data'}
          </button>
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-16 bg-white/10 rounded animate-pulse"></div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {getCurrentStats().map((stat, index) => (
            <div
              key={index}
              className={`glass-card p-6 hover-lift hover-glow-indigo animate-scale-in ${stat.glow} border border-white/20 hover:border-white/40 transition-all duration-300`}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl animate-float">{stat.icon}</span>
                    <p className="text-light-text/80 text-sm font-medium">{stat.label}</p>
                  </div>
                  <p className={`text-3xl font-bold ${stat.color} animate-count-up`}>{stat.value.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-coral/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <div className={`w-6 h-6 rounded-full ${stat.color.replace('text-', 'bg-')} animate-pulse-gentle`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-300">
          <div className="glass-card p-6 hover-lift hover-glow-blue">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl animate-float">👥</span>
              <h3 className="text-lg font-semibold text-light-text">
                {t('dashboard.userEngagement') || 'User Engagement'}
              </h3>
            </div>
            <p className="text-light-text/80 text-sm">
              {t('dashboard.userEngagementDesc') || 'Track user activity and growth metrics'}
            </p>
          </div>

          <div className="glass-card p-6 hover-lift hover-glow-emerald">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl animate-float">📚</span>
              <h3 className="text-lg font-semibold text-light-text">
                {t('dashboard.contentManagement') || 'Content Management'}
              </h3>
            </div>
            <p className="text-light-text/80 text-sm">
              {t('dashboard.contentManagementDesc') || 'Monitor content creation and academic progress'}
            </p>
          </div>

          <div className="glass-card p-6 hover-lift hover-glow-rose">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl animate-float">💬</span>
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

      {/* Clear All Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-card p-8 max-w-lg w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {t('dashboard.clearAllData') || 'Clear All Admin Data'}
              </h3>
              <p className="text-light-text/80">
                {t('dashboard.clearDataWarning') || 'This action cannot be undone!'}
              </p>
            </div>

            {/* Result Message */}
            {clearResult && (
              <div className={`p-4 rounded-lg mb-6 ${
                clearResult.success 
                  ? 'bg-emerald-500/20 border border-emerald-500/50' 
                  : 'bg-red-500/20 border border-red-500/50'
              }`}>
                <p className={clearResult.success ? 'text-emerald-400' : 'text-red-400'}>
                  {clearResult.message}
                </p>
              </div>
            )}

            {!clearResult && (
              <>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                  <h4 className="text-red-400 font-semibold mb-2">
                    {t('dashboard.dataToBeDeleted') || 'The following data will be deleted:'}
                  </h4>
                  <ul className="text-light-text/80 text-sm space-y-1">
                    <li>• {t('dashboard.newsArticles') || 'All News Articles'}</li>
                    <li>• {t('dashboard.events') || 'All Events'}</li>
                    <li>• {t('dashboard.testimonials') || 'All Testimonials'}</li>
                    <li>• {t('dashboard.campusLife') || 'All Campus Life Content'}</li>
                    <li>• {t('dashboard.books') || 'All Books'}</li>
                    <li>• {t('dashboard.contactMessages') || 'All Contact Messages'}</li>
                    <li>• {t('dashboard.statistics') || 'Statistics (reset to zero)'}</li>
                  </ul>
                  <p className="text-amber-400 text-sm mt-3">
                    🚫 {t('dashboard.preservedData') || 'User accounts and academic data will be preserved.'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowClearModal(false);
                      setClearResult(null);
                    }}
                    className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
                    disabled={isClearing}
                  >
                    {t('dashboard.cancel') || 'Cancel'}
                  </button>
                  <button
                    onClick={handleClearAllData}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-rose-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isClearing}
                  >
                    {isClearing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('dashboard.clearing') || 'Clearing...'}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        🗑️ {t('dashboard.confirmClear') || 'Confirm Clear'}
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsSection;

