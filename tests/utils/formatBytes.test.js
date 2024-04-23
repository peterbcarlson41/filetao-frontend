// Import the function
import { formatBytes } from "@/utils/formatBytes";
import { describe, it, expect } from "vitest";

// Describe the function you are testing
describe("formatBytes", () => {
  // Test cases
  it("converts bytes to a readable format", () => {
    expect(formatBytes(1024)).toEqual({ value: 1, unit: "KB", string: "1 KB" });
    expect(formatBytes(1234)).toEqual({
      value: 1.21,
      unit: "KB",
      string: "1.21 KB",
    });
    expect(formatBytes(1234, 1)).toEqual({
      value: 1.2,
      unit: "KB",
      string: "1.2 KB",
    });
  });

  it("handles zero bytes", () => {
    expect(formatBytes(0)).toEqual({ value: 0, unit: "B", string: "0 B" });
  });

  it("handles decimals parameter", () => {
    expect(formatBytes(1023)).toEqual({
      value: 1023,
      unit: "B",
      string: "1023 B",
    });
    expect(formatBytes(1023, 3)).toEqual({
      value: 1023,
      unit: "B",
      string: "1023 B",
    });
  });

  it("handles large values", () => {
    expect(formatBytes(1024 ** 3)).toEqual({
      value: 1,
      unit: "GB",
      string: "1 GB",
    });
    expect(formatBytes(1024 ** 5)).toEqual({
      value: 1,
      unit: "PB",
      string: "1 PB",
    });
  });
});
