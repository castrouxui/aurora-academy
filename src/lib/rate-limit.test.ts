import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const key = `test:${Date.now()}`;
    expect(checkRateLimit(key, 3, 60000)).toBe(true);
    expect(checkRateLimit(key, 3, 60000)).toBe(true);
    expect(checkRateLimit(key, 3, 60000)).toBe(true);
  });

  it("blocks requests over the limit", () => {
    const key = `test:${Date.now()}-block`;
    checkRateLimit(key, 2, 60000);
    checkRateLimit(key, 2, 60000);
    expect(checkRateLimit(key, 2, 60000)).toBe(false);
  });

  it("resets after the window expires", async () => {
    const key = `test:${Date.now()}-reset`;
    checkRateLimit(key, 1, 50);
    checkRateLimit(key, 1, 50);
    await new Promise((r) => setTimeout(r, 60));
    expect(checkRateLimit(key, 1, 50)).toBe(true);
  });
});
