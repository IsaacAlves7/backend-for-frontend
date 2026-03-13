import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL ?? 'http://localhost:4001',
  user: process.env.USER_SERVICE_URL ?? 'http://localhost:4002',
  task: process.env.TASK_SERVICE_URL ?? 'http://localhost:4003',
  notification: process.env.NOTIFICATION_SERVICE_URL ?? 'http://localhost:4004',
};

function createClient(baseURL: string, token?: string): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 8000,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export function authClient(token?: string) { return createClient(SERVICES.auth, token); }
export function userClient(token?: string) { return createClient(SERVICES.user, token); }
export function taskClient(token?: string) { return createClient(SERVICES.task, token); }
export function notificationClient(token?: string) { return createClient(SERVICES.notification, token); }

// Generic service call with error forwarding
export async function serviceCall<T>(
  fn: () => Promise<{ data: { success: boolean; data?: T; message?: string; errors?: string[] } }>
): Promise<T> {
  const res = await fn();
  if (!res.data.success) throw new Error(res.data.message ?? 'Service error');
  return res.data.data as T;
}
