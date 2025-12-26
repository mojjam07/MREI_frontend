import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import AlumniAdminDashboard from "./pages/AlumniAdminDashboard";
import NotFound from "./pages/NotFound";

import AboutUs from "./pages/AboutUs";
import Academics from "./pages/Academics";
import Admissions from "./pages/Admissions";
import DigitalBookshelf from "./pages/DigitalBookshelf";
import Library from "./pages/Library";
import Calendar from "./pages/Calendar";
import ProtectedRoute from "./route/ProtectedRoute";

// New main navigation pages
import WhyUs from "./pages/mainNavPages/WhyUs";
import OurImpact from "./pages/mainNavPages/OurImpact";
import Testimonials from "./pages/mainNavPages/Testimonials";
import NewsEvents from "./pages/mainNavPages/NewsEvents";
import SchoolLife from "./pages/mainNavPages/SchoolLife";
import ContactUs from "./pages/mainNavPages/ContactUs";

// Helper function to get dashboard path based on user role
const getDashboardPath = (userRole) => {
  const role = userRole?.toLowerCase();
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'tutor':
      return '/tutor/dashboard';
    case 'alumni':
      return '/alumni/dashboard';
    case 'student':
    default:
      return '/student/dashboard';
  }
};

// Generic dashboard component that renders the correct dashboard based on user role
const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user || !user.role) return <Navigate to="/login" />;

  const dashboardPath = getDashboardPath(user.role);
  return <Navigate to={dashboardPath} replace />;
};

export default function App() {
  return (

    <Routes>

      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/academics" element={<Academics />} />
      <Route path="/admissions" element={<Admissions />} />
      
      {/* New main navigation pages */}
      <Route path="/why-us" element={<WhyUs />} />
      <Route path="/our-impact" element={<OurImpact />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/news-events" element={<NewsEvents />} />
      <Route path="/school-life" element={<SchoolLife />} />
      <Route path="/contact-us" element={<ContactUs />} />
      
      <Route
        path="/library"
        element={<Library />}
      />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Role-based dashboard routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alumni/dashboard"
        element={
          <ProtectedRoute allowedRoles={['alumni']}>
            <AlumniDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/alumni-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AlumniAdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Generic dashboard route for backward compatibility */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* 404 Not Found route - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
