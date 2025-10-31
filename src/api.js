// src/api.js
import axios from 'axios';

// Creamos una "instancia" de axios con configuración predeterminada
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
  // Aquí podríamos añadir headers de autenticación en el futuro
});

export default apiClient;