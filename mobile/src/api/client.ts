import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3002/api';

export const api = axios.create({ baseURL: BASE_URL, timeout: 10000, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (e: unknown) => void }> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefresh } = data.data;
      await AsyncStorage.multiSet([['accessToken', accessToken], ['refreshToken', newRefresh]]);
      failedQueue.forEach((p) => p.resolve(accessToken));
      failedQueue = [];
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (e) {
      failedQueue.forEach((p) => p.reject(e));
      failedQueue = [];
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);
