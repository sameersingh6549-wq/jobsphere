import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ color: '#EF4444', marginBottom: '1rem' }}>Access Denied</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '1.5rem' }}>
            This page requires <strong>{allowedRoles.join(' or ')}</strong> privileges. Your account role is currently <strong>{role}</strong>.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
}
