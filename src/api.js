// src/api.js
import axios from 'axios';

// Creamos una "instancia" de axios con configuración predeterminada
const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api'
  // Aquí podríamos añadir headers de autenticación en el futuro
});

export default apiClient;