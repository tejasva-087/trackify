import express from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { requireAuth } from "../middlewares/requireAuth.js";
import { chatCalendar } from "../controllers/chatbot.controller.js";

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip ?? "anonymous"),
  message: { status: "fail", message: "Too many requests, slow down." },
});

const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip ?? "anonymous"),
  message: {
    status: "fail",
    message: "Daily chat limit reached. Try again tomorrow.",
  },
});

const router = express.Router();

router.use(requireAuth);

router.post("/", chatLimiter, dailyLimiter, chatCalendar);

export default router;
