import { Router } from "express";

import {
  ingestEvent,
  listEvents,
  getEventById,
  listQuarantinedEvents
} from "../services/ingestion.service.js";

const router = Router();

// Receive an event
router.post("/events", (req, res) => {
  const result = ingestEvent(req.body);

  if (result.type === "accepted") {
    return res.status(201).json({
      message: "Event successfully accepted",
      event: result.record
    });
  }

  if (result.type === "duplicate") {
    return res.status(409).json({
      message: "Duplicate event",
      eventId: result.eventId
    });
  }

  return res.status(422).json({
    message: "Event failed validation and was quarantined",
    quarantineId: result.record.quarantineId,
    reasons: result.record.reasons
  });
});

// Get all accepted events
router.get("/events", (req, res) => {
  const events = listEvents();

  res.status(200).json({
    count: events.length,
    events
  });
});

// Get one accepted event
router.get("/events/:eventId", (req, res) => {
  const event = getEventById(req.params.eventId);

  if (!event) {
    return res.status(404).json({
      message: "Event not found"
    });
  }

  res.status(200).json(event);
});

// Get all quarantined events
router.get("/quarantine", (req, res) => {
  const events = listQuarantinedEvents();

  res.status(200).json({
    count: events.length,
    events
  });
});

export default router;