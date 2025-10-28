// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Importamos las herramientas del router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Importamos nuestro Layout y nuestras páginas
import App from './App.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MaterialesPage from './pages/MaterialesPage.jsx';
import BobinasPage from './pages/BobinasPage.jsx';
import ProductosPage from './pages/ProductosPage.jsx';
import TrabajosPage from './pages/TrabajosPage.jsx';

// 3. ¡Creamos el "mapa" de rutas!
const router = createBrowserRouter([
  {
    path: '/',         // En la ruta raíz "/"
    element: <App />,  // Renderiza nuestro Layout (App.jsx)
    
    // 4. "Hijos": Estas rutas se renderizarán DENTRO del <Outlet> de App.jsx
    children: [
      {
        path: '/', // Cuando la ruta es EXACTAMENTE "/"
        element: <DashboardPage />, // Muestra el Dashboard
      },
      {
        path: '/materiales', // Cuando la ruta es "/materiales"
        element: <MaterialesPage />, // Muestra la página de Materiales
      },
      { 
        path: '/bobinas',
        element: <BobinasPage />,
      },

      { 
        path: '/productos',
        element: <ProductosPage />,
      },
      { 
        path: '/trabajos',
        element: <TrabajosPage />,
      },
    ],
  },
]);

// 5. Le decimos a React que use el ROUTER, no solo la App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
