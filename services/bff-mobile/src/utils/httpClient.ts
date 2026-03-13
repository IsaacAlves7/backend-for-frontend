import axios, { AxiosInstance } from 'axios';

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

export const authClient = (token?: string) => createClient(SERVICES.auth, token);
export const userClient = (token?: string) => createClient(SERVICES.user, token);
export const taskClient = (token?: string) => createClient(SERVICES.task, token);
export const notificationClient = (token?: string) => createClient(SERVICES.notification, token);
