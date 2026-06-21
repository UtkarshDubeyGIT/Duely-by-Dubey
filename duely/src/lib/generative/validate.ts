import { validateSpec, autoFixSpec, type Spec } from "@json-render/core";

export interface ValidationResult {
  valid: boolean;
  issues: string[];
  spec: Spec;
}

export function validateAndFix(spec: unknown): ValidationResult {
  if (spec == null) {
    return { valid: false, issues: ["Spec is null or undefined"], spec: {} as Spec };
  }

  const specObj = spec as Spec;

  if (typeof specObj !== "object" || !specObj.root || !specObj.elements) {
    return {
      valid: false,
      issues: ["Spec is missing root or elements"],
      spec: specObj,
    };
  }

  try {
    const { valid, issues } = validateSpec(specObj);

    if (!valid && issues.length > 0) {
      const { spec: fixed } = autoFixSpec(specObj);
      const { valid: finalValid, issues: finalIssues } = validateSpec(fixed);

      return {
        valid: finalValid,
        issues: finalValid ? [] : finalIssues.map((i) => i.message ?? JSON.stringify(i)),
        spec: fixed,
      };
    }

    return {
      valid,
      issues: issues.map((i) => i.message ?? JSON.stringify(i)),
      spec: specObj,
    };
  } catch (err) {
    return {
      valid: false,
      issues: [(err as Error).message ?? "Validation error"],
      spec: specObj,
    };
  }
}
