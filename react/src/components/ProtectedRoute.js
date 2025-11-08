import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireModerator = false }) => {
  const { isAuthenticated, isModerator, loading } = useAuth();

  if (loading) {
    return (
      <div data-easytag="id1-react/src/components/ProtectedRoute.js" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.25rem',
        color: 'var(--text-secondary)'
      }}>
        Загрузка...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireModerator && !isModerator) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;