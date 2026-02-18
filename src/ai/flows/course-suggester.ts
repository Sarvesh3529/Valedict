'use server';

/**
 * @fileOverview An AI agent that suggests educational courses based on selected chapters.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseSuggestionInputSchema = z.object({
  chapterNames: z.array(z.string()).describe('The names of the selected chapters.'),
  grade: z.string().describe('The grade level of the student.'),
});
export type CourseSuggestionInput = z.infer<typeof CourseSuggestionInputSchema>;

const CourseSuggestionOutputSchema = z.object({
  suggestions: z.array(z.object({
    title: z.string().describe('The title of the suggested resource.'),
    platform: z.enum(['YouTube', 'Google']).describe('The platform for the resource.'),
    url: z.string().describe('The search or direct URL for the resource.'),
    description: z.string().describe('A short, friendly description of why this is helpful.'),
  })),
});
export type CourseSuggestionOutput = z.infer<typeof CourseSuggestionOutputSchema>;

export async function suggestCourses(input: CourseSuggestionInput): Promise<CourseSuggestionOutput> {
  return courseSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseSuggesterPrompt',
  input: {schema: CourseSuggestionInputSchema},
  output: {schema: CourseSuggestionOutputSchema},
  prompt: `You are a helpful study assistant. A student in Grade {{grade}} is about to take a quiz on these topics: {{#each chapterNames}}{{this}}, {{/each}}.

  Suggest 3-4 specific educational resources. 
  - Some should be YouTube video searches.
  - Some should be Google Search or Google educational resources.
  - Focus on FREE, high-quality content.
  - For URLs, construct highly specific search result links if you don't have a direct verified link.
  
  Example search URL format: https://www.youtube.com/results?search_query=Class+10+Math+Real+Numbers+Full+Chapter
  
  Make descriptions friendly and encouraging, in the style of an expert tutor.`,
});

const courseSuggesterFlow = ai.defineFlow(
  {
    name: 'courseSuggesterFlow',
    inputSchema: CourseSuggestionInputSchema,
    outputSchema: CourseSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
