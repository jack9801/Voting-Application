import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, role } = useAuth(); 

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && role !== 'Admin') {
    return <Navigate to="/candidates" />; 
  }

  return children;
}