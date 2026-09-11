import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If set, user.role must match one of these (case-insensitive) */
  roles?: string[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const user = useSelector((s: RootState) => s.auth.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const role = String(user?.role || '').toLowerCase();
    const allowed = roles.map((r) => r.toLowerCase());
    if (!allowed.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
