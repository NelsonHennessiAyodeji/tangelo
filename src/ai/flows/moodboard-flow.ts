/**
 * @fileOverview An AI agent for generating a wedding moodboard.
 *
 * - generateMoodboard - A function that creates images based on a wedding description.
 * - MoodboardInput - The input type for the generateMoodboard function.
 * - MoodboardOutput - The return type for the generateMoodboard function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const MoodboardInputSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.').describe('A detailed description of the user\'s dream wedding vision, including style, colors, and atmosphere.'),
});
export type MoodboardInput = z.infer<typeof MoodboardInputSchema>;

export const MoodboardOutputSchema = z.object({
  images: z.array(
    z.object({
      prompt: z.string().describe('The specific prompt used to generate this image.'),
      url: z.string().describe('The Data URI of the generated image.'),
    })
  ).describe('An array of generated images for the moodboard.'),
});
export type MoodboardOutput = z.infer<typeof MoodboardOutputSchema>;


export async function generateMoodboard(input: MoodboardInput): Promise<MoodboardOutput> {
  return moodboardFlow(input);
}


const themeExtractionPrompt = ai.definePrompt({
  name: 'moodboardThemeExtractionPrompt',
  input: { schema: MoodboardInputSchema },
  output: { schema: z.object({ themes: z.array(z.string()).length(4).describe('An array of exactly 4 distinct, visually descriptive prompts for an image generator.') }) },
  prompt: `You are a creative assistant. Based on the user's wedding description, extract exactly 4 distinct and visually descriptive themes that can be used as prompts for an image generator. The themes should cover different aspects like decor, attire, venue, and cake. Focus on visual details.

User Description: "{{{description}}}"

Example Output for "a classic fairy-tale wedding in a castle with lots of white roses and gold accents":
{
  "themes": [
    "A bride in a classic, elegant ball gown with intricate lace details, holding a bouquet of white roses.",
    "A grand ballroom in a castle decorated for a wedding reception, with gold candelabras and white rose centerpieces.",
    "A stunning multi-tiered wedding cake with delicate sugar flowers and gold leaf accents.",
    "An invitation suite with elegant calligraphy, gold foil, and a white rose motif."
  ]
}
`,
});


const moodboardFlow = ai.defineFlow(
  {
    name: 'moodboardFlow',
    inputSchema: MoodboardInputSchema,
    outputSchema: MoodboardOutputSchema,
  },
  async (input) => {
    // Step 1: Extract visual themes from the user's description.
    const { output: themesOutput } = await themeExtractionPrompt(input);
    if (!themesOutput?.themes) {
      throw new Error('Could not extract visual themes from the description.');
    }
    const themes = themesOutput.themes;

    // Step 2: Generate an image for each theme in parallel.
    const imagePromises = themes.map(async (theme) => {
      const fullPrompt = `A high-quality, photorealistic image of a Nigerian wedding. The overall vision is: "${input.description}". This specific image should focus on: "${theme}".`;
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: fullPrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      return {
        prompt: theme,
        url: media.url!,
      };
    });

    const images = await Promise.all(imagePromises);

    return { images };
  }
);
