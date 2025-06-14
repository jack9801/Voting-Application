import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'Admin') return <Navigate to="/unauthorized" />;

  return children;
}
