import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    data: null,
  };
  return res.status(statusCode).json(response);
};

