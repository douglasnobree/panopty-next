import axios from 'axios';
import { parseCookies } from 'nookies';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_PANOPTY_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_PANOPTY_BASE_URL_PRO;

const api = axios.create({
  baseURL: baseUrl + 'api',
});

api.interceptors.request.use(
  (config) => {
    const cookies = parseCookies();
    const token = cookies['panopty-token'];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token inválido ou expirado');
    }
    return Promise.reject(error);
  }
);

export default api;

export function getArqui(arquivo: string) {
  return baseUrl + `storage/${arquivo}`;
}
