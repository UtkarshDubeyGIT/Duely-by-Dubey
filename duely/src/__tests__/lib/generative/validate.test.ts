import { describe, it, expect } from "vitest";
import { validateAndFix } from "@/lib/generative/validate";

describe("validateAndFix", () => {
  it("returns valid for a well-formed spec", () => {
    const spec = {
      root: "grid-1",
      elements: {
        "grid-1": {
          type: "Grid",
          props: { cols: "4" },
          children: ["stat-1", "stat-2"],
        },
        "stat-1": {
          type: "StatCard",
          props: { label: "Revenue", value: 1000 },
          children: [],
        },
        "stat-2": {
          type: "StatCard",
          props: { label: "Growth", value: 12 },
          children: [],
        },
      },
    };

    const result = validateAndFix(spec);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("detects invalid specs", () => {
    const badSpec = {
      // missing root
      elements: {},
    };

    const result = validateAndFix(badSpec);
    expect(result.valid).toBe(false);
  });

  it("handles null/undefined gracefully", () => {
    const result = validateAndFix(null);
    expect(result).toBeDefined();
    expect(result.valid).toBe(false);
  });

  it("returns spec even when invalid", () => {
    const spec = { root: "missing", elements: {} };
    const result = validateAndFix(spec);
    // should handle missing child references
    expect(result.spec).toBeDefined();
  });
});
