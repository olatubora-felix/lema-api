import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { sendError } from "../utils/responseHandler";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If it's an operational error (AppError), use its status code and message
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  // For database errors or other unexpected errors
  console.error("Unexpected error:", err);
  
  // Log the full error in development, but don't expose it to the client
  const message = process.env.NODE_ENV === "development" 
    ? err.message 
    : "Internal server error";

  sendError(res, 500, message);
};

