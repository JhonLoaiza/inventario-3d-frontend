// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Importamos las herramientas del router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 2. Importamos nuestro Layout y nuestras páginas
import App from './App.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MaterialesPage from './pages/MaterialesPage.jsx';
import BobinasPage from './pages/BobinasPage.jsx';
import ProductosPage from './pages/ProductosPage.jsx';
import TrabajosPage from './pages/TrabajosPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import VentasPage from './pages/VentasPage.jsx';

// ¡NUEVO! Importa el Proveedor de Autenticación
import { AuthProvider } from './context/AuthContext.jsx';

// ¡NUEVO! Importamos la página de Login
import LoginPage from './pages/LoginPage.jsx';

// 3. ¡Creamos el "mapa" de rutas! (¡UNA SOLA VEZ!)
const router = createBrowserRouter([
  {
    // Ruta para el Layout Principal (Navbar, etc.)
    // Este layout estará PROTEGIDO
    path: '/',
    element: (
      <ProtectedRoute>
        <App /> 
      </ProtectedRoute>
    ),
    // Las páginas que se renderizarán DENTRO del <Outlet> de App
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/materiales', element: <MaterialesPage /> },
      { path: '/bobinas', element: <BobinasPage /> },
      { path: '/productos', element: <ProductosPage /> },
      { path: '/trabajos', element: <TrabajosPage /> },
      { path: '/trabajos', element: <TrabajosPage /> },
      { path: '/ventas', element: <VentasPage /> },
    ]
  },
  {
    // Ruta de Login (PÚBLICA)
    path: '/login',
    element: <LoginPage />,
  },
]);

// 5. Le decimos a React que use el ROUTER, no solo la App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. ¡NUEVO! Envolvemos la app con el AuthProvider */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
