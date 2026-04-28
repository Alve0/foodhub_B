import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { Prisma } from "../generated/prisma/client";
import AppError from "./error";

const handlePrismaError = (err: unknown): AppError => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // common Prisma error codes: P2002 unique constraint, P2025 not found etc
    if (err.code === "P2002") {
      return new AppError(`Duplicate field value: ${err.meta?.target}`, 400);
    }
    if (err.code === "P2025") {
      return new AppError("Resource not found", 404);
    }
    return new AppError(err.message, 400);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return new AppError(err.message, 400);
  }

  if (
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    return new AppError("Database connection error", 500);
  }

  return new AppError("An unknown database error occurred", 500);
};

const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error = err;

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    const zodError = new AppError("Validation Error", 400);
    (zodError as any).errors = formattedErrors;
    error = zodError;
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    error = handlePrismaError(err);
  }

  if (!(error instanceof AppError)) {
    error = new AppError(
      String((error as any)?.message || "Internal Server Errord "),
      500,
    );
  }

  const appError = error as AppError;

  res.status(appError.statusCode).json({
    status: appError.status,
    message: appError.message,
    errors: (error as any).errors || undefined,
    ...(appError.statusCode >= 500
      ? {
          error:
            process.env.NODE_ENV === "development" ? appError.stack : undefined,
        }
      : {}),
  });
};

export default globalErrorHandler;
