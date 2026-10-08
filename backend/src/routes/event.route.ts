import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  updateEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.use(requireAuth);

router.route("/").post(createEvent).get(getEvents);

router.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent);

export default router;
