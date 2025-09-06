'use server';

/**
 * @fileOverview Suggests relevant date ranges for financial analysis based on uploaded data.
 *
 * - suggestDateRanges - A function that suggests date ranges for analysis.
 * - SuggestDateRangesInput - The input type for the suggestDateRanges function.
 * - SuggestDateRangesOutput - The return type for the suggestDateRanges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDateRangesInputSchema = z.object({
  csvData: z.string().describe('CSV data of financial transactions.'),
});
export type SuggestDateRangesInput = z.infer<typeof SuggestDateRangesInputSchema>;

const SuggestDateRangesOutputSchema = z.object({
  dateRanges: z
    .array(
      z.object({
        startDate: z.string().describe('Start date of the suggested range.'),
        endDate: z.string().describe('End date of the suggested range.'),
        reason: z.string().describe('Reason for suggesting this date range.'),
      })
    )
    .describe('Suggested date ranges for analysis.'),
});
export type SuggestDateRangesOutput = z.infer<typeof SuggestDateRangesOutputSchema>;

export async function suggestDateRanges(input: SuggestDateRangesInput): Promise<SuggestDateRangesOutput> {
  return suggestDateRangesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDateRangesPrompt',
  input: {schema: SuggestDateRangesInputSchema},
  output: {schema: SuggestDateRangesOutputSchema},
  prompt: `You are a financial analysis expert. Given the following CSV data of financial transactions, suggest 3 relevant date ranges for analysis. For each date range, provide a start date, end date, and a brief reason for suggesting this range, such as "period of highest spending" or "most volatile period".

CSV Data:
{{{csvData}}}

Ensure the output is a valid JSON array of objects with startDate, endDate, and reason fields.
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestDateRangesFlow = ai.defineFlow(
  {
    name: 'suggestDateRangesFlow',
    inputSchema: SuggestDateRangesInputSchema,
    outputSchema: SuggestDateRangesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
