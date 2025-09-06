'use server';

/**
 * @fileOverview This file defines a Genkit flow that generates a set of visualizations
 *  based on uploaded financial data, returning a description of the visualizations.
 *
 * - generateVisualizations - A function that generates visualizations based on financial data.
 * - GenerateVisualizationsInput - The input type for the generateVisualizations function.
 * - GenerateVisualizationsOutput - The return type for the generateVisualizations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisualizationsInputSchema = z.object({
  csvData: z
    .string()
    .describe('The uploaded CSV data of financial transactions.'),
});
export type GenerateVisualizationsInput = z.infer<typeof GenerateVisualizationsInputSchema>;

const GenerateVisualizationsOutputSchema = z.object({
  visualizationDescriptions: z
    .string()
    .describe('A description of the generated visualizations, including chart types and key insights.'),
});
export type GenerateVisualizationsOutput = z.infer<typeof GenerateVisualizationsOutputSchema>;

export async function generateVisualizations(
  input: GenerateVisualizationsInput
): Promise<GenerateVisualizationsOutput> {
  return generateVisualizationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVisualizationsPrompt',
  input: {schema: GenerateVisualizationsInputSchema},
  output: {schema: GenerateVisualizationsOutputSchema},
  prompt: `You are an expert financial analyst. Given the following financial transaction data in CSV format, analyze the data and suggest a diverse set of insightful visualizations (e.g., bar charts, pie charts, line graphs) that would help a financial analyst quickly understand key trends and patterns. Briefly explain the insights each visualization provides.

CSV Data:
{{csvData}}

Return the description of the suggested visualizations, including the chart types and the insights they provide, in a single paragraph.  Be concise and descriptive. Do not include the data, only the description of the chart. Focus on spending patterns, trends and other key information.
`,
});

const generateVisualizationsFlow = ai.defineFlow(
  {
    name: 'generateVisualizationsFlow',
    inputSchema: GenerateVisualizationsInputSchema,
    outputSchema: GenerateVisualizationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
