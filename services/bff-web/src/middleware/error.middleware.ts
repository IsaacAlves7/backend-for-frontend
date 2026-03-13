import { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 502;
    const data = err.response?.data ?? { message: 'Upstream service error' };
    return res.status(status).json({ success: false, ...data });
  }
  if (err instanceof Error) {
    console.error('BFF Error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
  return res.status(500).json({ success: false, message: 'Unknown error' });
}
