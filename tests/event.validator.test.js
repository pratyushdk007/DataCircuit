import test from "node:test";
import assert from "node:assert/strict";

import { validateEvent } from "../src/validators/event.validator.js";

const validEvent = {
  eventId: "evt_test_001",
  eventType: "payment.succeeded",
  source: "payment-service",
  occurredAt: "2026-11-07T09:30:00.000Z",
  payload: {
    orderId: "ORD101",
    amountPaise: 25000,
    currency: "INR",
    paymentStatus: "SUCCESS"
  }
};

test("valid payment event should pass", () => {
  assert.deepEqual(validateEvent(validEvent), []);
});

test("negative amount should fail", () => {
  const event = {
    ...validEvent,
    payload: {
      ...validEvent.payload,
      amountPaise: -100
    }
  };

  const errors = validateEvent(event);

  assert.ok(
    errors.includes("amountPaise must be a positive integer")
  );
});

test("missing order ID should fail", () => {
  const event = {
    ...validEvent,
    payload: {
      ...validEvent.payload,
      orderId: ""
    }
  };

  const errors = validateEvent(event);

  assert.ok(errors.includes("orderId is required"));
});

test("mismatched payment status should fail", () => {
  const event = {
    ...validEvent,
    payload: {
      ...validEvent.payload,
      paymentStatus: "FAILED"
    }
  };

  const errors = validateEvent(event);

  assert.ok(
    errors.includes("Payment status does not match event type")
  );
});