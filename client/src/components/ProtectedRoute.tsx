import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
    requiredRole: UserRole;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== requiredRole) {
        // If the required role is Customer, we allow Admin and Employee roles as well
        if (requiredRole === 'Customer' && (user.role === 'Admin' || user.role === 'Employee')) {
            return <Outlet />;
        }

        // Redirect to the correct dashboard based on actual role
        if (user.role === 'Admin') {
            return <Navigate to="/admin" replace />;
        }
        if (user.role === 'Employee') {
            return <Navigate to="/home" replace />;
        }
        return <Navigate to="/user" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
