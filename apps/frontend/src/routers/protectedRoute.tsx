import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';

export const ProtectedRoute = () => {
  const { token } = useAuth();
  const location = useLocation();
  const publicRoutes = ['/login', '/register'];

  const isPublicRoutes = publicRoutes.includes(location.pathname);

  if (!isPublicRoutes && !token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
