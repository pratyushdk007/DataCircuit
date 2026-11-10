export function validateEvent(event) {
  const errors = [];

  // Check whether input is a JSON object.
  if (
    !event ||
    typeof event !== "object" ||
    Array.isArray(event)
  ) {
    return ["Request body must be a JSON object"];
  }

  // Check event ID
  if (
    typeof event.eventId !== "string" ||
    !event.eventId.trim()
  ) {
    errors.push("eventId is required");
  }

  // Check event type
  const allowedTypes = [
    "payment.succeeded",
    "payment.failed"
  ];

  if (!allowedTypes.includes(event.eventType)) {
    errors.push("Invalid eventType");
  }

  // Check event source
  if (event.source !== "payment-service") {
    errors.push("Invalid event source");
  }

  // Check timestamp
  if (
    typeof event.occurredAt !== "string" ||
    !Number.isFinite(Date.parse(event.occurredAt))
  ) {
    errors.push("Invalid occurredAt timestamp");
  }

  // Check payload
  const payload = event.payload;

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    errors.push("payload must be an object");
    return errors;
  }

  if (
    typeof payload.orderId !== "string" ||
    !payload.orderId.trim()
  ) {
    errors.push("orderId is required");
  }

  if (
    !Number.isSafeInteger(payload.amountPaise) ||
    payload.amountPaise <= 0
  ) {
    errors.push("amountPaise must be a positive integer");
  }

  if (payload.currency !== "INR") {
    errors.push("Unsupported currency");
  }

  const allowedStatuses = ["SUCCESS", "FAILED"];

  if (!allowedStatuses.includes(payload.paymentStatus)) {
    errors.push("Invalid paymentStatus");
  }

  // Check consistency between event type and payment status
  if (
    event.eventType === "payment.succeeded" &&
    payload.paymentStatus !== "SUCCESS"
  ) {
    errors.push("Payment status does not match event type");
  }

  if (
    event.eventType === "payment.failed" &&
    payload.paymentStatus !== "FAILED"
  ) {
    errors.push("Payment status does not match event type");
  }

  return errors;
}