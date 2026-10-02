import { describe, it, expect } from "vitest";
import { currency, shortDate, relative } from "../../src/lib/format";

describe("Formatters Utility Suite", () => {
  it("formats numbers as USD currency correctly", () => {
    expect(currency(50000)).toContain("50,000");
    expect(currency(0)).toContain("0");
  });

  it("formats dates with short human format", () => {
    const formatted = shortDate("2026-10-01T00:00:00.000Z");
    expect(formatted).toContain("2026");
  });

  it("formats relative dates correctly", () => {
    const formatted = relative("2026-10-01T00:00:00.000Z");
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe("string");
  });
});
