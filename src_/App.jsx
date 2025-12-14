
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import { AdminRoute, TutorRoute, StudentRoute, AnyUserRoute } from "./route/RoleBasedRoute";

// A layout component to handle redirects for authenticated users
const AuthenticatedRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    // Show a loading spinner or a blank screen while auth is being checked
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" /> : children;
};

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthenticatedRedirect><LoginPage /></AuthenticatedRedirect>} />
      <Route path="/signup" element={<AuthenticatedRedirect><SignupPage /></AuthenticatedRedirect>} />

      {/* Protected role-based dashboard routes */}
      <Route
        path="/admin/dashboard/*"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      
      <Route
        path="/tutor/dashboard/*"
        element={
          <TutorRoute>
            <TutorDashboard />
          </TutorRoute>
        }
      />
      
      <Route
        path="/student/dashboard/*"
        element={
          <StudentRoute>
            <StudentDashboard />
          </StudentRoute>
        }
      />
      
      {/* Fallback route for dashboard (redirect to appropriate dashboard based on role) */}
      <Route
        path="/dashboard/*"
        element={
          <AnyUserRoute>
            <DashboardRedirect />
          </AnyUserRoute>
        }
      />
      
      {/* Fallback for unauthorized access */}
      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
                <div className="text-red-500 text-6xl mb-4">🚫</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-4">
                  You don't have permission to access this page.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        }
      />
      
      {/* Catch-all route */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-blue-600">404</h1>
              <p className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</p>
              <p className="text-gray-600 mt-2 mb-6">The page you are looking for does not exist.</p>
              <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Go Home</a>
            </div>
          </div>
        } 
      />
    </Routes>
  );
}

// Component to redirect users to their appropriate dashboard based on role
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const dashboardPath = `/${user.role}/dashboard`;
  return <Navigate to={dashboardPath} replace />;
};
