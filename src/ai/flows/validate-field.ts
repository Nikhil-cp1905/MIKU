//Validate fields like 'SRM Email ID' and 'RA Number' are accurately completed using AI.

'use server';

/**
 * @fileOverview Validates a given field using AI to ensure accuracy.
 *
 * - validateField - A function that validates the field.
 * - ValidateFieldInput - The input type for the validateField function.
 * - ValidateFieldOutput - The return type for the validateField function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateFieldInputSchema = z.object({
  fieldValue: z.string().describe('The value of the field to validate.'),
  fieldType: z.string().describe('The type of field to validate (e.g., SRM Email ID, RA Number).'),
});
export type ValidateFieldInput = z.infer<typeof ValidateFieldInputSchema>;

const ValidateFieldOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the field value is valid according to the field type.'),
  reason: z.string().optional().describe('The reason the field is invalid, if applicable.'),
});
export type ValidateFieldOutput = z.infer<typeof ValidateFieldOutputSchema>;

export async function validateField(input: ValidateFieldInput): Promise<ValidateFieldOutput> {
  return validateFieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateFieldPrompt',
  input: {schema: ValidateFieldInputSchema},
  output: {schema: ValidateFieldOutputSchema},
  prompt: `You are a validator that checks if a given field value is valid based on its type.

  Field Type: {{{fieldType}}}
  Field Value: {{{fieldValue}}}

  Determine if the Field Value is a valid example of the Field Type. Return a JSON object with the \"isValid\" field set to true or false. If isValid is false, explain the reason in the \"reason\" field.

  Example 1:
  Field Type: SRM Email ID
  Field Value: john.doe@srmist.edu.in
  {
    "isValid": true
  }

  Example 2:
  Field Type: RA Number
  Field Value: RA2111003010123
  {
    "isValid": true
  }

  Example 3:
  Field Type: RA Number
  Field Value: 12345
  {
    "isValid": false,
    "reason": "RA Number must start with 'RA' followed by 12 digits."
  }

  Output:`,
});

const validateFieldFlow = ai.defineFlow(
  {
    name: 'validateFieldFlow',
    inputSchema: ValidateFieldInputSchema,
    outputSchema: ValidateFieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
