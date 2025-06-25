import { Request, Response, NextFunction } from "express";

export function requireUserId(req: Request, res: Response, next: NextFunction) {
  const userId = req.header("X-User-Id");
  if (!userId) {
    res.status(401).json({ error: "Missing X-User-Id header" });
    return;
  }
  (req as any).userId = userId;
  next();
} 