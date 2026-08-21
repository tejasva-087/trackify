import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import morgan from "morgan";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/error.controller.js";

const app = express();
// 1. Security headers
app.use(helmet());

// 2. API call control
app.use(
  cors({
    origin: process.env.BETTER_AUTH_TRUSTED_ORIGIN,
    credentials: true,
  }),
);

// Logger
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 3. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// 4. Prevent parameter pollution
app.use(
  hpp({
    whitelist: [], // ["sort", "fields", "tags"],
  }),
);

// Better auth handler
app.all("/api/auth/{*any}", toNodeHandler(auth));

// 5. Limit request body size
app.use(express.json({ limit: "10kb" }));

// app routes

// Route not found
app.use((req: Request, res: Response, next: NextFunction) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404),
  );
});

// Global error handler
app.use(globalErrorHandler);

export default app;
