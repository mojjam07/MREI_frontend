



import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import NotFound from "./pages/NotFound";

import AboutUs from "./pages/AboutUs";
import Academics from "./pages/Academics";
import Admissions from "./pages/Admissions";
import DigitalBookshelf from "./pages/DigitalBookshelf";
import Calendar from "./pages/Calendar";
import ProtectedRoute from "./route/ProtectedRoute";

// New main navigation pages
import WhyUs from "./pages/mainNavPages/WhyUs";
import OurImpact from "./pages/mainNavPages/OurImpact";
import Testimonials from "./pages/mainNavPages/Testimonials";
import NewsEvents from "./pages/mainNavPages/NewsEvents";
import SchoolLife from "./pages/mainNavPages/SchoolLife";
import ContactUs from "./pages/mainNavPages/ContactUs";

// Generic dashboard component that renders the correct dashboard based on user role
const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'tutor':
      return <TutorDashboard />;
    case 'alumni':
      return <StudentDashboard />; // Using student dashboard for alumni
    default:
      return <Navigate to="/login" />;
  }
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
        element={
          <ProtectedRoute>
            <DigitalBookshelf />
          </ProtectedRoute>
        }
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
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alumni/dashboard"
        element={
          <ProtectedRoute allowedRoles={['alumni']}>
            <StudentDashboard />
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
