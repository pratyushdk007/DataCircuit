import test from "node:test";
import assert from "node:assert/strict";

import { validateEvent } from "../src/validators/event.validator.js";

const validEvent = {
  schemaVersion: "payment.v1",
  eventId: "evt_test_001",
  eventType: "payment.succeeded",
  source: "payment-service",
  occurredAt: "2026-11-15T10:30:00.000Z",

  payload: {
    orderId: "ORD101",
    amountPaise: 25000,
    currency: "INR",
    paymentStatus: "SUCCESS"
  }
};

test("valid event passes all validation", () => {
  assert.deepEqual(validateEvent(validEvent), []);
});

test("negative amount fails business validation", () => {
  const event = {
    ...validEvent,
    payload: {
      ...validEvent.payload,
      amountPaise: -100
    }
  };

  const issues = validateEvent(event);

  assert.ok(
    issues.some(issue => issue.code === "INVALID_AMOUNT")
  );
});

test("missing schema field is detected", () => {
  const event = { ...validEvent };

  delete event.schemaVersion;

  const issues = validateEvent(event);

  assert.ok(
    issues.some(issue => issue.code === "MISSING_FIELD")
  );
});

test("unknown payload field is detected", () => {
  const event = {
    ...validEvent,
    payload: {
      ...validEvent.payload,
      unexpectedField: "unknown"
    }
  };

  const issues = validateEvent(event);

  assert.ok(
    issues.some(
      issue => issue.code === "UNEXPECTED_PAYLOAD_FIELD"
    )
  );
});

test("inconsistent payment status is detected", () => {
  const event = {
    ...validEvent,
    payload: {
      ...validEvent.payload,
      paymentStatus: "FAILED"
    }
  };

  const issues = validateEvent(event);

  assert.ok(
    issues.some(issue => issue.code === "PAYMENT_STATUS_MISMATCH")
  );
});