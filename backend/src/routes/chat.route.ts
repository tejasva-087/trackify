import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  useGemini,
  useGroqOpenAI,
  useGroqQwen,
  useNLP,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.use(requireAuth);

router.route("/gemini").post(useGemini);
router.route("/openai").post(useGroqOpenAI);
router.route("/qwen").post(useGroqQwen);
router.route("/nlp").post(useNLP);

export default router;
