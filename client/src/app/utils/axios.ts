import axios from 'axios';
import AuthService from '../services/AuthService';

export const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({ baseURL: API_URL, withCredentials: true, responseType: 'json' });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(`token`);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    console.log(error);
    const originalRequest = error.config;

    if (error.response.status == 401) {
      try {
        const response = await AuthService.checkAuth();
        localStorage.setItem('token', response.data.accessToken);
        return axiosInstance.request(originalRequest);
      } catch (e) {
        throw e;
      }
    }

    throw error;
  },
);

export { axiosInstance };
