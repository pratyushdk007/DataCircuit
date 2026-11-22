import { prisma } from "../config/prisma.js";

import {
  calculateIqrProfile
} from "../quality/statistics.js";

import {
  detectAmountAnomaly
} from "../quality/anomaly-detector.js";
export async function getAmountQualityProfile() {
  const records = await prisma.acceptedEvent.findMany({
    select: {
      amountPaise: true
    },

    orderBy: {
      receivedAt: "desc"
    },

    take: 500
  });

  const amounts = records.map(
    record => record.amountPaise
  );

  if (amounts.length < 30) {
    return {
      metric: "amountPaise",
      sampleSize: amounts.length,
      sufficientBaseline: false,
      message: "At least 30 records are required for profiling"
    };
  }

  const profile = calculateIqrProfile(amounts);

  return {
    metric: "amountPaise",
    sufficientBaseline: true,
    unit: "paise",
    method: "Interquartile Range",
    ...profile
   };
 }

 export async function evaluateAmountAnomaly(amountPaise) {
  const records = await prisma.acceptedEvent.findMany({
    select: {
      amountPaise: true
    },

    orderBy: {
      receivedAt: "desc"
    },

    take: 100
  }
 );

  const historicalAmounts = records.map(
    record => record.amountPaise
  );

  return detectAmountAnomaly(
    amountPaise,
    historicalAmounts
  );
}
