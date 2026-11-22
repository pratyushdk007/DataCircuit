import test from "node:test";
import assert from "node:assert/strict";

import {
  detectAmountAnomaly
} from "../src/quality/anomaly-detector.js";

const historicalAmounts = Array.from(
  { length: 50 },
  (_, i) => 10000 + i * 1000
);

test("extremely high amount should be detected", () => {
  const result = detectAmountAnomaly(
    5000000,
    historicalAmounts
  );
  assert.equal(result.isAnomaly, true);
});

test("normal amount should not be detected as an anomaly", () => {
  const result = detectAmountAnomaly(
    30000,
    historicalAmounts
  );

  assert.equal(result.isAnomaly, false);
});

test("small historical dataset should not trigger anomaly detection", () => {
  const result = detectAmountAnomaly(
    5000000,
    [10000, 20000, 30000]
  );

  assert.equal(result.isAnomaly, false);

  assert.equal(
    result.reason,
    "INSUFFICIENT_BASELINE"
  );
});