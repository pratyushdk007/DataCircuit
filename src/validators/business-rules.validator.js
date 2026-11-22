import { PAYMENT_EVENT_V1 } from "../contracts/payment-event.v1.js";

function createIssue(code, field, message) {
  return {
    code,
    severity: "ERROR",
    field,
    message
  };
}

export function validateBusinessRules(event) {
  const issues = [];

  const payload = event?.payload;

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return issues;
  }

  // Validate event ID
  if (
    typeof event.eventId !== "string" ||
    !event.eventId.trim()
  ) {
    issues.push(
      createIssue(
        "INVALID_EVENT_ID",
        "eventId",
        "Event ID must be a non-empty string"
      )
    );
  }

  // Validate event type
  if (
    !PAYMENT_EVENT_V1.allowedEventTypes.includes(
      event.eventType
    )
  ) {
    issues.push(
      createIssue(
        "INVALID_EVENT_TYPE",
        "eventType",
        "Unsupported payment event type"
      )
    );
  }

  // Validate event source
  if (event.source !== "payment-service") {
    issues.push(
      createIssue(
        "INVALID_SOURCE",
        "source",
        "Unsupported payment event source"
      )
    );
  }

  // Validate timestamp
  if (
    typeof event.occurredAt !== "string" ||
    !Number.isFinite(Date.parse(event.occurredAt))
  ) {
    issues.push(
      createIssue(
        "INVALID_TIMESTAMP",
        "occurredAt",
        "Event timestamp is invalid"
      )
    );
  }

  // Validate order ID
  if (
    typeof payload.orderId !== "string" ||
    !payload.orderId.trim()
  ) {
    issues.push(
      createIssue(
        "INVALID_ORDER_ID",
        "payload.orderId",
        "Order ID must be a non-empty string"
      )
    );
  }

  // Validate payment amount
  if (
    !Number.isSafeInteger(payload.amountPaise) ||
    payload.amountPaise <= 0
  ) {
    issues.push(
      createIssue(
        "INVALID_AMOUNT",
        "payload.amountPaise",
        "Payment amount must be a positive safe integer"
      )
    );
  }

  // Validate currency
  if (
    !PAYMENT_EVENT_V1.allowedCurrencies.includes(
      payload.currency
    )
  ) {
    issues.push(
      createIssue(
        "INVALID_CURRENCY",
        "payload.currency",
        "Unsupported payment currency"
      )
    );
  }

  // Validate payment status
  if (
    !PAYMENT_EVENT_V1.allowedPaymentStatuses.includes(
      payload.paymentStatus
    )
  ) {
    issues.push(
      createIssue(
        "INVALID_PAYMENT_STATUS",
        "payload.paymentStatus",
        "Unsupported payment status"
      )
    );
  }

  // Cross-field consistency
  if (
    event.eventType === "payment.succeeded" &&
    payload.paymentStatus !== "SUCCESS"
  ) {
    issues.push(
      createIssue(
        "PAYMENT_STATUS_MISMATCH",
        "payload.paymentStatus",
        "Successful event must have SUCCESS status"
      )
    );
  }

  if (
    event.eventType === "payment.failed" &&
    payload.paymentStatus !== "FAILED"
  ) {
    issues.push(
      createIssue(
        "PAYMENT_STATUS_MISMATCH",
        "payload.paymentStatus",
        "Failed event must have FAILED status"
      )
    );
  }

  return issues;
}