import axios from 'axios';
import { store } from '@/store';
import { logout, setTokens } from '@/store/slices/authSlice';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
let refreshing = false;
let queue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    refreshing = true;
    try {
      const refreshToken = store.getState().auth.refreshToken;
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post('/api/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefresh } = data.data;

      store.dispatch(setTokens({ accessToken, refreshToken: newRefresh }));
      queue.forEach((cb) => cb(accessToken));
      queue = [];
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch {
      store.dispatch(logout());
      return Promise.reject(error);
    } finally {
      refreshing = false;
    }
  }
);
