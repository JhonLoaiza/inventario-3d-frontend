// src/components/ProtectedRoute.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

// Ahora, este componente recibe "children" (los hijos)
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Alert variant="info">Cargando aplicación...</Alert>;
  }

  // Si no está autenticado, lo pateamos a /login
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ¡Éxito! Devolvemos la página hija que nos pasaron
  return children;
}

export default ProtectedRoute;