import { Request, Response, NextFunction } from "express";
import AppError from "./error";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(
    `Cannot find ${req.originalUrl} on this server`,
    404,
  );
  next(error);
};

export default notFound;
