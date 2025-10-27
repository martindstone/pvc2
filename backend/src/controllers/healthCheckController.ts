import { type Request, type Response, type NextFunction } from 'express';

export const healthCheck = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
};
