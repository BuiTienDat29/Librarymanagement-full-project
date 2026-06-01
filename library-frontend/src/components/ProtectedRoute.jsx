import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (roles && !roles.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
}
