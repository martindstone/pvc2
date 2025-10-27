import { type Request, type Response, type NextFunction } from 'express';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  // Use Passport's isAuthenticated
  if (typeof (req as any).isAuthenticated === 'function' && (req as any).isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};
