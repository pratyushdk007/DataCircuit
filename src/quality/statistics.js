export function median(values) {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);

  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (
      sorted[middle - 1] + sorted[middle]
    ) / 2;
  }

  return sorted[middle];
}

export function percentile(values, p) {
  if (
    values.length === 0 ||
    p < 0 ||
    p > 1
  ) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);

  const index = (sorted.length - 1) * p;

  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  const weight = index - lower;

  return (
    sorted[lower] +
    (sorted[upper] - sorted[lower]) * weight
  );
}

export function calculateIqrProfile(values) {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);

  const sum = values.reduce(
    (total, value) => total + value,
    0
  );

  const q1 = percentile(values, 0.25);
  const q3 = percentile(values, 0.75);

  const iqr = q3 - q1;

  const mean = sum / values.length;

  return {
    count: values.length,

    min: sorted[0],
    max: sorted[sorted.length - 1],

    mean,
    median: median(values),

    q1,
    q3,
    iqr,

    lowerBound: q1 - 1.5 * iqr,
    upperBound: q3 + 1.5 * iqr
  };
}