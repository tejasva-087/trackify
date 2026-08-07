import { NextFunction, Request, Response } from "express";
import { APIError } from "better-auth";
import { ZodError } from "zod";
import AppError from "../utils/appError";

const handleZodError = (err: ZodError) => {
  const message = err.issues.map((e) => e.message).join(", ");
  return new AppError(message, 400);
};

const handleBetterAuthError = (err: APIError) => {
  // err.status is a string like "BAD_REQUEST", "UNAUTHORIZED", etc.
  // err.statusCode is the numeric HTTP status better-auth already resolved.
  const message = err.body?.message || err.message || "Authentication error";
  return new AppError(message, err.statusCode || 400);
};

export const handleDuplicateKeyError = (err: any) => {
  const match = err.detail?.match(/\((.*?)\)=\((.*?)\)/);
  const field = match?.[1];
  return new AppError(
    `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use another ${field}.`,
    400,
  );
};

export const handleForeignKeyError = (err: any) => {
  const field = err.constraint || "resource";
  return new AppError(
    `Invalid reference. The related ${field} does not exist.`,
    400,
  );
};

export const handleNotNullError = (err: any) => {
  const field = err.column || "field";
  return new AppError(`${field} is required.`, 400);
};

export const handleCheckConstraintError = () =>
  new AppError(
    "Invalid input data. One of the provided values violates a constraint.",
    400,
  );

export const handleInvalidTextError = () =>
  new AppError("Invalid input format provided.", 400);

export const handleValueTooLongError = (err: any) => {
  const field = err.column || "field";
  return new AppError(`${field} exceeds the maximum allowed length.`, 400);
};

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

// Drizzle wraps pg errors, so the code may be on err.cause or directly on err
const getPgCode = (err: any): string | undefined =>
  err?.cause?.code ?? err?.code;

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = err;

  if (err instanceof ZodError) error = handleZodError(err);
  if (err instanceof APIError) error = handleBetterAuthError(err);

  const pgCode = getPgCode(err);
  const pgSource = err?.cause ?? err; // pass the object that has .detail, .column, etc.

  if (pgCode === "23505") error = handleDuplicateKeyError(pgSource);
  if (pgCode === "23503") error = handleForeignKeyError(pgSource);
  if (pgCode === "23502") error = handleNotNullError(pgSource);
  if (pgCode === "23514") error = handleCheckConstraintError();
  if (pgCode === "22P02") error = handleInvalidTextError();
  if (pgCode === "22001") error = handleValueTooLongError(pgSource);

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
