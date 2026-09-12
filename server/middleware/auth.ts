import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.codeshift_token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const { userId } = verifyAccessToken(token);

    req.userId = userId;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired session.",
    });
  }
}