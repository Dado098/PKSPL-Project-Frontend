import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role?.nama_role)) {
    console.warn('ProtectedRoute access denied', {
      pathname: location.pathname,
      user,
      allowedRoles,
      roleName: user?.role?.nama_role ?? null,
      isAuthenticated,
    });

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-bold text-[#1a56db] mb-4">Akses Ditolak</h1>
        <p className="text-gray-600 mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <p className="text-xs text-gray-500 mb-6">
          Debug: role={user?.role?.nama_role ?? 'tidak ada'}; allowed={allowedRoles.join(', ')}
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-[#1a56db] text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
