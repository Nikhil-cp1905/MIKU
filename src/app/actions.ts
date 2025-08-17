"use server";

import {
  validateField as validateFieldFlow,
  type ValidateFieldInput,
  type ValidateFieldOutput,
} from "@/ai/flows/validate-field";

export async function validateField(
  input: ValidateFieldInput
): Promise<ValidateFieldOutput> {
  try {
    const result = await validateFieldFlow(input);
    return result;
  } catch (error) {
    console.error("AI validation failed:", error);
    // Return a generic error or a default state if the AI flow fails
    return {
      isValid: false,
      reason: "Could not validate field at this time.",
    };
  }
}
