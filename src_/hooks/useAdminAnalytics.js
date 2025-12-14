
import { useQuery } from 'react-query';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../config';

export const useAdminAnalytics = () => {
  // System overview metrics
  const {
    data: systemOverview,
    isLoading: overviewLoading,
    error: overviewError
  } = useQuery(
    'admin-system-overview',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.SYSTEM);
      return response.data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    }
  );

  // User statistics
  const {
    data: userStats,
    isLoading: userStatsLoading,
    error: userStatsError
  } = useQuery(
    'admin-user-stats',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.USER_STATISTICS);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 3 * 60 * 1000, // Auto-refresh every 3 minutes
    }
  );

  // Academic performance metrics
  const {
    data: academicStats,
    isLoading: academicStatsLoading,
    error: academicStatsError
  } = useQuery(
    'admin-academic-stats',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.ACADEMIC_STATISTICS);
      return response.data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Recent activity feed
  const {
    data: recentActivity,
    isLoading: activityLoading,
    error: activityError
  } = useQuery(
    'admin-recent-activity',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.RECENT_ACTIVITY);
      return response.data;
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 1 * 60 * 1000, // Auto-refresh every minute
    }
  );

  // Performance trends
  const {
    data: performanceTrends,
    isLoading: trendsLoading,
    error: trendsError
  } = useQuery(
    'admin-performance-trends',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.PERFORMANCE_TRENDS);
      return response.data;
    },
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  // System health metrics
  const {
    data: systemHealth,
    isLoading: healthLoading,
    error: healthError
  } = useQuery(
    'admin-system-health',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.SYSTEM_HEALTH);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
    }
  );

  // Resource utilization
  const {
    data: resourceUtilization,
    isLoading: resourceLoading,
    error: resourceError
  } = useQuery(
    'admin-resource-utilization',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.RESOURCE_UTILIZATION);
      return response.data;
    },
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
    }
  );

  // Security metrics
  const {
    data: securityMetrics,
    isLoading: securityLoading,
    error: securityError
  } = useQuery(
    'admin-security-metrics',
    async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.SECURITY_METRICS);
      return response.data;
    },
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  // Calculate derived metrics
  const calculateDerivedMetrics = (data) => {
    if (!data) return {};

    return {
      totalUsers: data.userStats?.total || 0,
      activeUsers: data.userStats?.active || 0,
      inactiveUsers: data.userStats?.inactive || 0,
      completionRate: data.academicStats?.completion_rate || 0,
      averageGrade: data.academicStats?.average_grade || 0,
      systemUptime: data.systemHealth?.uptime || '99.9%',
      errorRate: data.systemHealth?.error_rate || 0,
      responseTime: data.systemHealth?.average_response_time || 0,
    };
  };

  // Get summary for dashboard cards
  const getSummaryMetrics = () => {
    const derived = calculateDerivedMetrics({
      userStats,
      academicStats,
      systemHealth
    });

    return [
      {
        id: 'total-users',
        title: 'Total Users',
        value: derived.totalUsers.toString(),
        change: '+12%',
        changeType: 'increase',
        icon: 'users',
        color: 'blue'
      },
      {
        id: 'active-courses',
        title: 'Active Courses',
        value: systemOverview?.active_courses || '0',
        change: '+8%',
        changeType: 'increase',
        icon: 'book',
        color: 'green'
      },
      {
        id: 'completion-rate',
        title: 'Completion Rate',
        value: `${derived.completionRate}%`,
        change: '+5%',
        changeType: 'increase',
        icon: 'trending-up',
        color: 'purple'
      },
      {
        id: 'system-health',
        title: 'System Health',
        value: derived.systemUptime,
        change: '99.9%',
        changeType: 'stable',
        icon: 'activity',
        color: 'green'
      }
    ];
  };

  return {
    // Data
    systemOverview: systemOverview || {},
    userStats: userStats || {},
    academicStats: academicStats || {},
    recentActivity: recentActivity || [],
    performanceTrends: performanceTrends || {},
    systemHealth: systemHealth || {},
    resourceUtilization: resourceUtilization || {},
    securityMetrics: securityMetrics || {},
    
    // Loading states
    overviewLoading,
    userStatsLoading,
    academicStatsLoading,
    activityLoading,
    trendsLoading,
    healthLoading,
    resourceLoading,
    securityLoading,
    
    // Error states
    overviewError,
    userStatsError,
    academicStatsError,
    activityError,
    trendsError,
    healthError,
    resourceError,
    securityError,
    
    // Utility functions
    calculateDerivedMetrics,
    getSummaryMetrics,
    
    // Loading state for all data
    isLoading: overviewLoading || userStatsLoading || academicStatsLoading || 
               activityLoading || trendsLoading || healthLoading || 
               resourceLoading || securityLoading,
  };
};
