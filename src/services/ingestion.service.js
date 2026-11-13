import { randomUUID } from "node:crypto";

import { prisma } from "../config/prisma.js";
import { validateEvent } from "../validators/event.validator.js";

export async function ingestEvent(event) {
  const eventId =
    typeof event?.eventId === "string"
      ? event.eventId.trim()
      : null;

  // Check whether this event was already accepted.
  if (eventId) {
    const existing = await prisma.acceptedEvent.findUnique({
      where: { eventId }
    });

    if (existing) {
      return {
        type: "duplicate",
        eventId
      };
    }
  }

  // Validate incoming event.
  const errors = validateEvent(event);

  // Save invalid event in PostgreSQL.
  if (errors.length > 0) {
    const record = await prisma.quarantinedEvent.create({
      data: {
        id: randomUUID(),
        eventId,
        reasons: errors,
        rawEvent: event ?? {}
      }
    });

    return {
      type: "quarantined",
      record
    };
  }

  try {
    // Save valid event in PostgreSQL.
    const record = await prisma.acceptedEvent.create({
      data: {
        eventId,
        eventType: event.eventType,
        source: event.source,
        occurredAt: new Date(event.occurredAt),
        orderId: event.payload.orderId,
        amountPaise: event.payload.amountPaise,
        currency: event.payload.currency,
        paymentStatus: event.payload.paymentStatus,
        payload: event.payload
      }
    });

    return {
      type: "accepted",
      record
    };

  } catch (error) {
    // PostgreSQL uniqueness violation.
    // P2002 is Prisma's unique-constraint error.
    if (error?.code === "P2002") {
      return {
        type: "duplicate",
        eventId
      };
    }

    throw error;
  }
}

// Retrieve accepted events.
export async function listEvents(limit = 50) {
  return prisma.acceptedEvent.findMany({
    orderBy: {
      receivedAt: "desc"
    },
    take: limit
  });
}

// Count accepted events.
export async function countAcceptedEvents() {
  return prisma.acceptedEvent.count();
}

// Retrieve one accepted event.
export async function getEventById(eventId) {
  return prisma.acceptedEvent.findUnique({
    where: { eventId }
  });
}

// Retrieve quarantined events.
export async function listQuarantinedEvents(limit = 50) {
  return prisma.quarantinedEvent.findMany({
    orderBy: {
      receivedAt: "desc"
    },
    take: limit
  });
}

// Count quarantined events.
export async function countQuarantinedEvents() {
  return prisma.quarantinedEvent.count();
}