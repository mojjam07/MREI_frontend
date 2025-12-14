import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import LoadingSpinner from '../components/ui/LoadingSpinner';

const RoleBasedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true,
  fallbackComponent: FallbackComponent = null,
  redirectTo = '/login'
}) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but not authorized for this route
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (FallbackComponent) {
      return <FallbackComponent userRole={user.role} />;
    }
    
    // Default unauthorized component
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Required roles: {allowedRoles.join(', ')}
              <br />
              Your role: {user.role}
            </p>
            <div className="space-y-2">
              {user.role === 'admin' && (
                <button
                  onClick={() => window.location.href = '/admin/dashboard'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Admin Dashboard
                </button>
              )}
              {user.role === 'tutor' && (
                <button
                  onClick={() => window.location.href = '/tutor/dashboard'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Tutor Dashboard
                </button>
              )}
              {user.role === 'student' && (
                <button
                  onClick={() => window.location.href = '/student/dashboard'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Student Dashboard
                </button>
              )}
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authorized, render the protected content
  return children;
};


// Higher-order component version for easier usage
/* eslint-disable react-refresh/only-export-components */
export const withRoleBasedAccess = (Component, options = {}) => {
  return function RoleBasedComponent(props) {
    return (
      <RoleBasedRoute {...options}>
        <Component {...props} />
      </RoleBasedRoute>
    );
  };
};

// Specific route components for common use cases
export const AdminRoute = ({ children, ...props }) => (
  <RoleBasedRoute allowedRoles={['admin']} {...props}>
    {children}
  </RoleBasedRoute>
);

export const TutorRoute = ({ children, ...props }) => (
  <RoleBasedRoute allowedRoles={['tutor']} {...props}>
    {children}
  </RoleBasedRoute>
);

export const StudentRoute = ({ children, ...props }) => (
  <RoleBasedRoute allowedRoles={['student']} {...props}>
    {children}
  </RoleBasedRoute>
);

export const AdminOrTutorRoute = ({ children, ...props }) => (
  <RoleBasedRoute allowedRoles={['admin', 'tutor']} {...props}>
    {children}
  </RoleBasedRoute>
);

export const AnyUserRoute = ({ children, ...props }) => (
  <RoleBasedRoute allowedRoles={['admin', 'tutor', 'student']} {...props}>
    {children}
  </RoleBasedRoute>
);

export default RoleBasedRoute;

