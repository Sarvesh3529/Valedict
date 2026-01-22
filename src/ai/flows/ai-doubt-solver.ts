'use server';

/**
 * @fileOverview An AI-powered doubt solver for students.
 *
 * - aiDoubtSolver - A function that handles the doubt solving process.
 * - AIDoubtSolverInput - The input type for the aiDoubtSolver function.
 * - AIDoubtSolverOutput - The return type for the aiDoubtSolver function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDoubtSolverInputSchema = z.object({
  questionText: z.string().optional().describe('The question text, if any.'),
  questionImage: z
    .string()
    .optional()
    .describe(
      "A photo of a question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AIDoubtSolverInput = z.infer<typeof AIDoubtSolverInputSchema>;

const AIDoubtSolverOutputSchema = z.object({
  explanation: z.string().describe('The AI-powered explanation and solution.'),
});
export type AIDoubtSolverOutput = z.infer<typeof AIDoubtSolverOutputSchema>;

export async function aiDoubtSolver(input: AIDoubtSolverInput): Promise<AIDoubtSolverOutput> {
  return aiDoubtSolverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDoubtSolverPrompt',
  input: {schema: AIDoubtSolverInputSchema},
  output: {schema: AIDoubtSolverOutputSchema},
  prompt: `You are an expert tutor, skilled at explaining complex topics in a clear and concise way.

  A student has the following question.  Provide a detailed explanation and solution.
  {{#if questionText}}
  Question:
  {{questionText}}
  {{/if}}

  {{#if questionImage}}
  Question (image):
  {{media url=questionImage}}
  {{/if}}

  `,
});

const aiDoubtSolverFlow = ai.defineFlow(
  {
    name: 'aiDoubtSolverFlow',
    inputSchema: AIDoubtSolverInputSchema,
    outputSchema: AIDoubtSolverOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
