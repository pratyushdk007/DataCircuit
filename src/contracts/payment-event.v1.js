export const PAYMENT_EVENT_V1={
      version: "payment.v1",

    requiredFields:[ "schemaVersion",
    "eventId",
    "eventType",
    "source",
    "occurredAt",
    "payload"
    ],

    allowedFields: [
    "schemaVersion",
    "eventId",
    "eventType",
    "source",
    "occurredAt",
    "payload"
    ],

  requiredPayloadFields: [
    "orderId",
    "amountPaise",
    "currency",
    "paymentStatus"
  ],

   allowedPayloadFields: [
    "orderId",
    "amountPaise",
    "currency",
    "paymentStatus"
  ],allowedEventTypes: [
    "payment.succeeded",
    "payment.failed"
  ],

  allowedPaymentStatuses: [
    "SUCCESS",
    "FAILED"
  ],

  allowedCurrencies: [
    "INR"
  ]
};

  
