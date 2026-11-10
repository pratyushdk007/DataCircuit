import { randomUUID } from "node:crypto";
import { validateEvent } from "../validators/event.validator.js";

// Temporary storage
const acceptedEvents = new Map();
const quarantinedEvents = [];

export function ingestEvent(event) {
  const eventId =
    typeof event?.eventId === "string"
      ? event.eventId.trim()
      : "";

  // Prevent an already-accepted event from being processed again.
  if (eventId && acceptedEvents.has(eventId)) {
    return {
      type: "duplicate",
      eventId
    };
  }

  // Validate the event
  const errors = validateEvent(event);

  // Invalid events go to quarantine.
  if (errors.length > 0) {
    const record = {
      quarantineId: randomUUID(),
      eventId: eventId || null,
      receivedAt: new Date().toISOString(),
      reasons: errors,
      rawEvent: event ?? null
    };

    quarantinedEvents.push(record);

    return {
      type: "quarantined",
      record
    };
  }

  // Valid events are accepted.
  const record = {
    ...event,
    eventId,
    receivedAt: new Date().toISOString(),
    status: "ACCEPTED"
  };

  acceptedEvents.set(eventId, record);

  return {
    type: "accepted",
    record
  };
}

// Retrieve all accepted events
export function listEvents() {
  return Array.from(acceptedEvents.values());
}

// Retrieve one event
export function getEventById(eventId) {
  return acceptedEvents.get(eventId);
}

// Retrieve quarantined events
export function listQuarantinedEvents() {
  return [...quarantinedEvents];
}