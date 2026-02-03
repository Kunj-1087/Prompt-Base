import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RoleRouteProps {
  roles?: string[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ roles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="text-indigo-500 animate-pulse">Loading...</div>
        </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // Determine where to redirect unauthorized users
    // For now, redirect to home. Could be a 403 page.
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
