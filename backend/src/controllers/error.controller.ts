import { NextFunction, Request, Response } from "express";

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

function sendDevError({ res, err }: { res: Response; err: AppError }) {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function sendProdError({ res, err }: { res: Response; err: AppError }) {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error("UNEXPECTED ERROR 💥", err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
}

const globalErrorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError({ res, err });
  } else {
    sendProdError({ res, err });
  }
};

export default globalErrorHandler;
