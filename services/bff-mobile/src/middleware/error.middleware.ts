import { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 502;
    return res.status(status).json({ success: false, ...(err.response?.data ?? { message: 'Service error' }) });
  }
  if (err instanceof Error) {
    return res.status(500).json({ success: false, message: err.message });
  }
  return res.status(500).json({ success: false, message: 'Unknown error' });
}
