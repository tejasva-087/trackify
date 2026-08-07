import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import compression from "compression";
import { toNodeHandler } from "better-auth/node";

import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: {
    status: "fail",
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// BETTER AUTH MIDDLEWARE
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(
  hpp({
    whitelist: ["sort", "fields", "tags"],
  }),
);
app.use(compression());

// ROUTES

// UNHANDLED ROUTES
app.use((req: Request, res: Response, next: NextFunction) => {
  return next(new Error(`Can't find ${req.originalUrl} on this server!`));
});

// GLOBAL ERROR HANDLER
// app.use(globalErrorHandler);

export default app;
