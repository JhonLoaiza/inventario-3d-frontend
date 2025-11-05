// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api.js'; // Tu cliente de Axios

// 1. Creamos el contexto (el almacén)
const AuthContext = createContext();

// 2. Creamos un "hook" personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// 3. Creamos el "Proveedor" (el componente que envuelve la app)
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Aquí guardaremos el pasaporte (token)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ¿Está logueado?
  const [loading, setLoading] = useState(true); // Para saber si estamos verificando el token
  const [user, setUser] = useState(null); // Para guardar los datos del usuario (ej. 'jhon')

  // Función de Login: Llama a la API y guarda el pasaporte
  const login = async (username, password) => {
    try {
      setLoading(true);
      const res = await apiClient.post('/auth/login', { username, password });

      // Guardamos el pasaporte en el estado
      setToken(res.data.token);
      setIsAuthenticated(true);

      // Guardamos el pasaporte en el "localStorage" del navegador
      // para que la sesión persista si recarga la página
      localStorage.setItem('token', res.data.token);

      setLoading(false);
      return true; // Éxito
    } catch (error) {
      console.error('Error en login:', error.response.data);
      setIsAuthenticated(false);
      setToken(null);
      setLoading(false);
      return false; // Fracaso
    }
  };

  // Función de Logout: Borra el pasaporte
  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  // ¡IMPORTANTE! Verificar si ya existe un pasaporte al cargar la app
  useEffect(() => {
    const checkLogin = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        // Aquí deberíamos verificar el token contra el backend,
        // pero por ahora, solo con tenerlo guardado nos basta.
        setToken(storedToken);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  // 4. Lo que nuestro "almacén" le ofrece al resto de la app
  return (
    <AuthContext.Provider value={{
      token,
      user,
      isAuthenticated,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};