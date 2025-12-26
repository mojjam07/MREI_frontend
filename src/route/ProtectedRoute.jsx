
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

export default function ProtectedRoute({ children, allowedRoles = null }) {
    const { user } = useAuth();

    // First check if user is authenticated
    if (!user || !user.role) {
        return <Navigate to="/login" />;
    }

    // If allowedRoles is provided, check if user has required role (case-insensitive)
    if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
        // Redirect to appropriate dashboard based on user role
        const dashboardPath = getDashboardPath(user.role);
        return <Navigate to={dashboardPath} replace />;
    }

    return children;
}
