import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token'); // Standardized token name

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.role !== 'admin') {
      // If not admin, push them back to the student dashboard
      return <Navigate to="/dashboard" replace />;
    }
  } catch (error) {
    // If token is malformed or invalid
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;