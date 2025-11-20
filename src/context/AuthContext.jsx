import React, { useState, useEffect } from 'react';
import apiClient from '../api.js';

const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // Aquí guardaremos el nombre
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const res = await apiClient.post('/auth/login', { username, password });
      
      setToken(res.data.token);
      setUser(res.data.user); // 1. Guardamos el usuario en el estado
      setIsAuthenticated(true);
      
      localStorage.setItem('token', res.data.token);
      // 2. Guardamos el usuario en el disco (localStorage) como texto
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error en login:', error.response?.data);
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Borramos el usuario al salir
  };

  useEffect(() => {
    const checkLogin = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user'); // 3. Recuperamos el usuario

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser)); // Lo convertimos de texto a objeto
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{
      token,
      user, // ¡Ahora este objeto está disponible para toda la app!
      isAuthenticated,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};