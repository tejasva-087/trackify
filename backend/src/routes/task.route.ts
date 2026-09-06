import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  updateEvent,
} from "../controllers/task.controller.js";

const router = express.Router();

router.use(requireAuth);

router.route("/").post(createEvent).get(getEvents);

router.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent);

export default router;

// {
//     "title": "Event 1",
//     "description": "Description 1",
//     "start": "2026-09-11T04:00:00.000Z",
//     "end": "2026-09-11T04:30:00.000Z",
//     "allDay": "false"
// }
