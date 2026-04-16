import { describe, it, expect } from "vitest";
import { isEligibleForRefund, calculateRefundAmount } from "./refund";

describe("isEligibleForRefund", () => {
  it("returns true for a purchase made 1 hour ago", () => {
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
    expect(isEligibleForRefund(oneHourAgo)).toBe(true);
  });

  it("returns true for a purchase made 6 days ago", () => {
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    expect(isEligibleForRefund(sixDaysAgo)).toBe(true);
  });

  it("returns false for a purchase made 8 days ago", () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    expect(isEligibleForRefund(eightDaysAgo)).toBe(false);
  });

  it("accepts a date string", () => {
    const recent = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(isEligibleForRefund(recent)).toBe(true);
  });
});

describe("calculateRefundAmount", () => {
  it("returns the full amount paid", () => {
    expect(calculateRefundAmount(7000)).toBe(7000);
    expect(calculateRefundAmount(50000)).toBe(50000);
  });
});
