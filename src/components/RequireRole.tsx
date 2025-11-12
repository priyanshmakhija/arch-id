import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, hasRole } from '../context/AuthContext';
import { UserRole } from '../types';

interface RequireRoleProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasRole(user?.role, allowedRoles)) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-900">Access Restricted</h2>
        <p className="mt-4 text-gray-600">
          Your role (<span className="font-medium">{user?.role}</span>) does not have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
};

export default RequireRole;

