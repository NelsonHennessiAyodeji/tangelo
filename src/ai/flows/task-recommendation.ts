
/**
 * @fileOverview An AI agent for recommending wedding tasks.
 *
 * - recommendTasks - A function that suggests tasks based on wedding details.
 * - TaskRecommendationInput - The input type for the recommendTasks function.
 * - TaskRecommendationOutput - The return type for the recommendTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const TaskRecommendationInputSchema = z.object({
  weddingKind: z.string().describe("The kind of wedding, e.g., 'Christian' or 'Muslim'."),
  primaryEvent: z.string().describe("The main wedding event, e.g., 'Traditional Wedding', 'White Wedding'."),
  additionalEvent: z.string().optional().describe("An additional event, e.g., 'Wedding Reception', 'Bridal Shower'."),
  guestCount: z.string().describe("The estimated number of guests, e.g., '100-300'."),
});
export type TaskRecommendationInput = z.infer<typeof TaskRecommendationInputSchema>;

export const TaskRecommendationOutputSchema = z.object({
  tasks: z.array(
    z.object({
      name: z.string().describe('The concise name of the task.'),
      description: z.string().describe('A brief, helpful description of the task.'),
    })
  ).describe('A list of recommended wedding planning tasks.'),
});
export type TaskRecommendationOutput = z.infer<typeof TaskRecommendationOutputSchema>;

export async function recommendTasks(input: TaskRecommendationInput): Promise<TaskRecommendationOutput> {
  return taskRecommendationFlow(input);
}

const taskRecommendationPrompt = ai.definePrompt({
  name: 'taskRecommendationPrompt',
  input: {schema: TaskRecommendationInputSchema},
  output: {schema: TaskRecommendationOutputSchema},
  prompt: `You are an expert Nigerian wedding planner. Your task is to generate a comprehensive and culturally relevant checklist of tasks for a user planning their wedding in Nigeria.

The user has provided the following details:
- Wedding Kind: {{{weddingKind}}}
- Primary Event: {{{primaryEvent}}}
{{#if additionalEvent}}- Additional Event: {{{additionalEvent}}}{{/if}}
- Estimated Guest Count: {{{guestCount}}}

Based on these details, create a list of tasks. The tasks should be practical and cover all major areas of Nigerian wedding planning, including venue, vendors, attire (like Aso Ebi), catering (for local dishes), guest management, and legal documentation. Tailor the suggestions to the specified events. For example, if it's a Muslim wedding, include tasks related to the Nikah ceremony. If it's a Traditional Wedding, include tasks for the introduction/engagement ceremony.

Return a JSON object with a "tasks" key, which contains an array of task objects. Each task object must have a "name" and a "description". Do not include tasks that are already obviously completed like "Sign Up" or "Complete Onboarding". Focus on future planning steps.
  `,
});

const taskRecommendationFlow = ai.defineFlow(
  {
    name: 'taskRecommendationFlow',
    inputSchema: TaskRecommendationInputSchema,
    outputSchema: TaskRecommendationOutputSchema,
  },
  async input => {
    const {output} = await taskRecommendationPrompt(input);
    return output!;
  }
);
