
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = null }) {
    const { user } = useAuth();

    // First check if user is authenticated
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If allowedRoles is provided, check if user has required role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        switch (user.role) {
            case 'admin':
                return <Navigate to="/admin/dashboard" />;
            case 'student':
                return <Navigate to="/student/dashboard" />;
            case 'tutor':
                return <Navigate to="/tutor/dashboard" />;
            case 'alumni':
                return <Navigate to="/alumni/dashboard" />;
            default:
                return <Navigate to="/login" />;
        }
    }

    return children;
}
