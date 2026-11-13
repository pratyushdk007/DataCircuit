import { randomUUID } from "node:crypto";

const API_URL = "http://localhost:3000/api/v1/events";

const requestedCount = Number.parseInt(
  process.argv[2] ?? "100",
  10
);

const count =
  Number.isInteger(requestedCount) && requestedCount > 0
    ? Math.min(requestedCount, 5000)
    : 100;

let accepted = 0;
let quarantined = 0;
let duplicates = 0;
let failedRequests = 0;

console.log(`Starting QuickBite simulation`);
console.log(`Generating ${count} events...\n`);

for (let i = 1; i <= count; i++) {

  const isFailedPayment = i % 2 === 0;
  const isCorrupted = i % 10 === 0;

  const eventType = isFailedPayment
    ? "payment.failed"
    : "payment.succeeded";

  const paymentStatus = isFailedPayment
    ? "FAILED"
    : "SUCCESS";

  let amountPaise = Math.floor(
    (100 + Math.random() * 1900) * 100
  );

  // Introduce an intentional data error.
  if (isCorrupted) {
    amountPaise = -amountPaise;
  }

  const event = {
    eventId: `evt_sim_${randomUUID()}`,
    eventType,
    source: "payment-service",
    occurredAt: new Date().toISOString(),

    payload: {
      orderId: `ORD_SIM_${i}`,
      amountPaise,
      currency: "INR",
      paymentStatus
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(event)
    });

    const result = await response.json();

    if (response.status === 201) {
      accepted++;
    }

    else if (response.status === 422) {
      quarantined++;
    }

    else if (response.status === 409) {
      duplicates++;
    }

    else {
      failedRequests++;

      console.error(
        `Event ${i} failed:`,
        response.status,
        result
      );
    }

    // Submit some valid events a second time.
    // This tests duplicate protection.
    if (i % 25 === 0 && !isCorrupted) {

      const duplicateResponse = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(event)
      });

      if (duplicateResponse.status === 409) {
        duplicates++;
      } else {
        failedRequests++;
        console.error(
          "Duplicate test did not return 409:",
          duplicateResponse.status
        );
      }
    }

  } catch (error) {
    failedRequests++;

    console.error(
      `Error sending event ${i}:`,
      error.message
    );
  }

  if (i % 100 === 0 || i === count) {
    console.log(`Processed ${i}/${count} events`);
  }
}

console.log("\n========== SIMULATION RESULTS ==========");

console.log("Events generated:", count);
console.log("Accepted:", accepted);
console.log("Quarantined:", quarantined);
console.log("Duplicate requests detected:", duplicates);
console.log("Failed requests:", failedRequests);

console.log("========================================");