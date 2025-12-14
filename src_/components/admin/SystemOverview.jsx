import React from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';

const SystemOverview = () => {
  const {
    systemMetrics,
    systemLoading,
    refreshData,
    lastUpdated
  } = useAdminAnalytics();

  if (systemLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading system overview...</p>
        </div>
      </div>
    );
  }

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Last updated: {formatLastUpdated(lastUpdated)}
          </span>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold">{systemMetrics?.total_users || 0}</p>
              <p className="text-blue-100 text-xs mt-1">
                {systemMetrics?.active_users || 0} active this month
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Courses</p>
              <p className="text-3xl font-bold">{systemMetrics?.total_courses || 0}</p>
              <p className="text-green-100 text-xs mt-1">
                {systemMetrics?.active_courses || 0} currently active
              </p>
            </div>
            <BookOpen className="w-12 h-12 text-green-200" />
          </div>
        </div>

        {/* Total Enrollments */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Enrollments</p>
              <p className="text-3xl font-bold">{systemMetrics?.total_enrollments || 0}</p>
              <p className="text-purple-100 text-xs mt-1">
                {systemMetrics?.new_enrollments_this_month || 0} new this month
              </p>
            </div>
            <GraduationCap className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">System Health</p>
              <p className="text-3xl font-bold">
                {systemMetrics?.system_uptime ? `${systemMetrics.system_uptime}%` : '100%'}
              </p>
              <p className="text-orange-100 text-xs mt-1">
                {systemMetrics?.response_time || '< 200ms'} avg response
              </p>
            </div>
            <Activity className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Metrics */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-700">User Growth</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-green-600">
                  +{systemMetrics?.user_growth_rate || 0}%
                </span>
                <span className="text-sm text-gray-500 ml-1">this month</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-700">Course Enrollment</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-green-600">
                  +{systemMetrics?.enrollment_growth_rate || 0}%
                </span>
                <span className="text-sm text-gray-500 ml-1">this month</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-gray-700">Dropout Rate</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-red-600">
                  {systemMetrics?.dropout_rate || 0}%
                </span>
                <span className="text-sm text-gray-500 ml-1">this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-700">Database</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                Healthy
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-700">API Services</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-gray-700">Email Service</span>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                Slow
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-700">Backup Status</span>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                In Progress
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-6 h-6 text-green-500 mr-2" />
              <span className="text-gray-700">Monthly Revenue</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ${systemMetrics?.monthly_revenue?.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-gray-500">
              {systemMetrics?.revenue_growth >= 0 ? '+' : ''}{systemMetrics?.revenue_growth || 0}% from last month
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-500 mr-2" />
              <span className="text-gray-700">Active Subscriptions</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {systemMetrics?.active_subscriptions || 0}
            </p>
            <p className="text-sm text-gray-500">
              {systemMetrics?.subscription_retention_rate || 0}% retention rate
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-purple-500 mr-2" />
              <span className="text-gray-700">Average Revenue Per User</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              ${systemMetrics?.arpu || '0'}
            </p>
            <p className="text-sm text-gray-500">
              Monthly recurring
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
