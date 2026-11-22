import test from "node:test";
import assert from "node:assert/strict";
import { validateEventSchema } from "../src/validators/schema.validator.js";

const validEvent = {
  schemaVersion: "payment.v1",
  eventId: "evt_schema_001",
  eventType: "payment.succeeded",
  source: "payment-service",
  occurredAt: "2026-11-15T10:30:00.000Z",
  payload: {
    orderId: "ORD101",
    amountPaise: 25000,
    currency: "INR",
    paymentStatus: "SUCCESS",
  },
};

test("valid payment.v1 event passes schema validation", () => {
  assert.deepEqual(validateEventSchema(validEvent), []);
});

test("non-object root event returns INVALID_EVENT", () => {
  const issues = validateEventSchema(null);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].code, "INVALID_EVENT");
  assert.equal(issues[0].field, "$");
});

test("missing required top-level field returns MISSING_FIELD", () => {
  const event = { ...validEvent };
  delete event.occurredAt;

  const issues = validateEventSchema(event);
  assert.ok(
    issues.some(
      (issue) => issue.code === "MISSING_FIELD" && issue.field === "occurredAt"
    )
  );
});

test("unexpected top-level field returns UNEXPECTED_FIELD", () => {
  const event = {
    ...validEvent,
    extraField: "not-allowed",
  };

  const issues = validateEventSchema(event);
  assert.ok(
    issues.some(
      (issue) =>
        issue.code === "UNEXPECTED_FIELD" && issue.field === "extraField"
    )
  );
});

test("unsupported schemaVersion returns UNSUPPORTED_SCHEMA_VERSION", () => {
  const event = {
    ...validEvent,
    schemaVersion: "payment.v2",
  };

  const issues = validateEventSchema(event);
  assert.ok(
    issues.some(
      (issue) =>
        issue.code === "UNSUPPORTED_SCHEMA_VERSION" &&
        issue.field === "schemaVersion"
    )
  );
});

test("non-object payload returns INVALID_PAYLOAD", () => {
  const event = {
    ...validEvent,
    payload: "not-an-object",
  };

  const issues = validateEventSchema(event);
  assert.ok(
    issues.some(
      (issue) => issue.code === "INVALID_PAYLOAD" && issue.field === "payload"
    )
  );
});

test("missing required payload field returns MISSING_PAYLOAD_FIELD", () => {
  const event = {
    ...validEvent,
    payload: {
      orderId: "ORD101",
      amountPaise: 25000,
      currency: "INR",
      // paymentStatus omitted
    },
  };

  const issues = validateEventSchema(event);
  assert.ok(
    issues.some(
      (issue) =>
        issue.code === "MISSING_PAYLOAD_FIELD" &&
        issue.field === "payload.paymentStatus"
    )
  );
});

test("schema drift (renamed payload field) returns MISSING_PAYLOAD_FIELD and UNEXPECTED_PAYLOAD_FIELD", () => {
  const event = {
    ...validEvent,
    payload: {
      orderId: "ORD101",
      amount: 25000, // Renamed from amountPaise
      currency: "INR",
      paymentStatus: "SUCCESS",
    },
  };

  const issues = validateEventSchema(event);
  assert.ok(
    issues.some(
      (issue) =>
        issue.code === "MISSING_PAYLOAD_FIELD" &&
        issue.field === "payload.amountPaise"
    )
  );
  assert.ok(
    issues.some(
      (issue) =>
        issue.code === "UNEXPECTED_PAYLOAD_FIELD" &&
        issue.field === "payload.amount"
    )
  );
});