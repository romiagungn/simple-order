import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
   console.error('Error: BASE_URL tidak terdefinisi di .env');
}

console.log('Base URL:', baseURL);

const api = axios.create({
   baseURL: baseURL,
   headers: {
      'Content-Type': 'application/json',
   },
});

api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token');

      if (token) {
         config.headers['token'] = token;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   },
);

api.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response && error.response.status === 401) {
         localStorage.removeItem('token');
         if (window.location.pathname !== '/login') {
            window.location.href = '/login';
         }
      }
      return Promise.reject(error);
   },
);

export default api;
