import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import morgan from "morgan";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

import eventRouter from "./routes/event.route.js";
import chatRouter from "./routes/chat.route.js";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/error.controller.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: process.env.BETTER_AUTH_TRUSTED_ORIGIN,
    credentials: true,
  }),
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Stricter limit for routes that call paid LLM APIs
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many chat requests, please slow down.",
});

app.use(hpp({ whitelist: [] }));

// Better Auth must be mounted BEFORE express.json()
app.all("/api/v1/auth/{*any}", toNodeHandler(auth));

app.use(express.json({ limit: "100kb" }));

app.use("/api/v1/event", eventRouter);
app.use("/api/v1/chat", chatLimiter, chatRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404),
  );
});

app.use(globalErrorHandler);

export default app;
