// src/api.js
import axios from 'axios';

// Creamos una "instancia" de axios (igual que antes)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// --- ¡LA MAGIA ESTÁ AQUÍ! ---
// Creamos un "Interceptor" de peticiones.
// Esto es una función que se ejecuta ANTES de que CUALQUIER
// petición (get, post, put, delete) sea enviada.

apiClient.interceptors.request.use(
  (config) => {
    // 1. Busca el "pasaporte" (token) en el localStorage
    const token = localStorage.getItem('token');

    // 2. Si el pasaporte existe...
    if (token) {
      // 3. ...lo adjunta a los "headers" de la petición
      //    en el formato "Bearer" que espera nuestro guardia.
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 4. Deja que la petición continúe su camino
    return config;
  },
  (error) => {
    // Maneja un error si la configuración de la petición falla
    return Promise.reject(error);
  }
);

export default apiClient;