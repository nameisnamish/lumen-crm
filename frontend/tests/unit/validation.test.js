import { describe, it, expect } from "vitest";
import { NAME_REGEX, sanitizeNameInput } from "../../src/lib/validation";

describe("Strict Name Validation & Edge Case Suite", () => {
  it("accepts valid alphabetical names with spaces, hyphens, and apostrophes", () => {
    expect(NAME_REGEX.test("Sujon Ahmed")).toBe(true);
    expect(NAME_REGEX.test("Mary-Jane O'Connor")).toBe(true);
    expect(NAME_REGEX.test("Alex Morgan")).toBe(true);
  });

  it("rejects names containing numbers or special characters", () => {
    expect(NAME_REGEX.test("Sujon123")).toBe(false);
    expect(NAME_REGEX.test("John_Doe")).toBe(false);
    expect(NAME_REGEX.test("User#1")).toBe(false);
    expect(NAME_REGEX.test("999")).toBe(false);
  });

  it("rejects names shorter than 2 characters", () => {
    expect(NAME_REGEX.test("A")).toBe(false);
    expect(NAME_REGEX.test("")).toBe(false);
  });

  it("sanitizes name inputs by stripping digits and disallowed symbols", () => {
    expect(sanitizeNameInput("Sujon123 Ahmed!")).toBe("Sujon Ahmed");
    expect(sanitizeNameInput("Alex99")).toBe("Alex");
  });
});
