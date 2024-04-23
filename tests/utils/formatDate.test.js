// Import the function
import { formatDate } from "@/utils/formatDate";
import { describe, it, expect } from "vitest";

// Describe the function you are testing
describe("formatDate", () => {
  // Test cases
  it("formats dates correctly", () => {
    expect(formatDate("2023-01-01T00:00:00")).toEqual("1/1/2023 12:00 am");
    expect(formatDate("2023-01-01T12:00:00")).toEqual("1/1/2023 12:00 pm");
    expect(formatDate("2023-01-01T23:59:00")).toEqual("1/1/2023 11:59 pm");
    expect(formatDate("2023-01-01T15:45:00")).toEqual("1/1/2023 3:45 pm");
    expect(formatDate("2023-12-31T11:20:00")).toEqual("12/31/2023 11:20 am");
  });

  it("handles different time zones", () => {
    // Assume the environment's time zone is UTC for these tests
    expect(formatDate("2023-01-01T00:00:00Z")).toEqual("1/1/2023 12:00 am");
    expect(formatDate("2023-06-15T13:30:00+04:00")).toEqual(
      "6/15/2023 9:30 am"
    );
  });
});
