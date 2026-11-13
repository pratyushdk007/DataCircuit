import { Router } from "express";

import {
  ingestEvent,
  listEvents,
  countAcceptedEvents,
  getEventById,
  listQuarantinedEvents,
  countQuarantinedEvents
} from "../services/ingestion.service.js";

const router = Router();

function getLimit(value) {
  const number = Number.parseInt(value, 10);

  if (!Number.isFinite(number)) {
    return 50;
  }

  return Math.min(Math.max(number, 1), 100);
}

// Ingest event
router.post("/events", async (req, res, next) => {
  try {
    const result = await ingestEvent(req.body);

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
      message: "Event quarantined",
      quarantineId: result.record.id,
      reasons: result.record.reasons
    });

  } catch (error) {
    next(error);
  }
});

// List accepted events
router.get("/events", async (req, res, next) => {
  try {
    const limit = getLimit(req.query.limit);

    const [events, count] = await Promise.all([
      listEvents(limit),
      countAcceptedEvents()
    ]);

    res.status(200).json({
      count,
      returned: events.length,
      events
    });

  } catch (error) {
    next(error);
  }
});

// Get one accepted event
router.get("/events/:eventId", async (req, res, next) => {
  try {
    const event = await getEventById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json(event);

  } catch (error) {
    next(error);
  }
});

// List quarantined events
router.get("/quarantine", async (req, res, next) => {
  try {
    const limit = getLimit(req.query.limit);

    const [events, count] = await Promise.all([
      listQuarantinedEvents(limit),
      countQuarantinedEvents()
    ]);

    res.status(200).json({
      count,
      returned: events.length,
      events
    });

  } catch (error) {
    next(error);
  }
});

export default router;