import { Request, Response, NextFunction } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const catchAsync =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

interface SendResponseOptions<T> {
  statusCode?: number;
  status?: "success" | "fail" | "error";
  message?: string;
  data?: T;
}

const sendResponse = <T>(res: Response, options: SendResponseOptions<T>) => {
  const {
    statusCode = 200,
    status = "success",
    message = "",
    data = null,
  } = options;

  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

export const helper = { catchAsync, sendResponse };
