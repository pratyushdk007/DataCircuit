import { PAYMENT_EVENT_V1 } from "../contracts/payment-event.v1.js";

function createIssue(code, field, message) {
  return {
    code,
    severity: "ERROR",
    field,
    message
  };
}

export function validateEventSchema(event) {
  const issues = [];

  // Check root object
  if (
    !event ||
    typeof event !== "object" ||
    Array.isArray(event)
  ) {
    return [
      createIssue(
        "INVALID_EVENT",
        "$",
        "Event must be a JSON object"
      )
    ];
  }

  // Check required top-level fields
  for (const field of PAYMENT_EVENT_V1.requiredFields) {
    if (!(field in event)) {
      issues.push(
        createIssue(
          "MISSING_FIELD",
          field,
          `${field} is required`
        )
      );
    }
  }

  // Detect unexpected top-level fields
  for (const field of Object.keys(event)) {
    if (!PAYMENT_EVENT_V1.allowedFields.includes(field)) {
      issues.push(
        createIssue(
          "UNEXPECTED_FIELD",
          field,
          `Unexpected field detected: ${field}`
        )
      );
    }
  }

  // Check schema version
  if (
    event.schemaVersion !== PAYMENT_EVENT_V1.version
  ) {
    issues.push(
      createIssue(
        "UNSUPPORTED_SCHEMA_VERSION",
        "schemaVersion",
        "Unsupported event schema version"
      )
    );
  }

  // Check payload object
  if (
    !event.payload ||
    typeof event.payload !== "object" ||
    Array.isArray(event.payload)
  ) {
    issues.push(
      createIssue(
        "INVALID_PAYLOAD",
        "payload",
        "Payload must be a JSON object"
      )
    );

    return issues;
  }

  // Check required payload fields
  for (const field of PAYMENT_EVENT_V1.requiredPayloadFields) {
    if (!(field in event.payload)) {
      issues.push(
        createIssue(
          "MISSING_PAYLOAD_FIELD",
          `payload.${field}`,
          `payload.${field} is required`
        )
      );
    }
  }

  // Detect unexpected payload fields
  for (const field of Object.keys(event.payload)) {
    if (
      !PAYMENT_EVENT_V1.allowedPayloadFields.includes(field)
    ) {
      issues.push(
        createIssue(
          "UNEXPECTED_PAYLOAD_FIELD",
          `payload.${field}`,
          `Unexpected payload field: ${field}`
        )
      );
    }
  }

  return issues;
}