
/**
 * @fileOverview An AI agent for creating a wedding moodboard by searching the web.
 *
 * - generateMoodboard - A function that finds images based on a wedding description.
 * - MoodboardInput - The input type for the generateMoodboard function.
 * - MoodboardOutput - The return type for the generateMoodboard function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ApifyClient } from 'apify-client';

// Define Zod schemas for input and output
export const MoodboardInputSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.').describe('A detailed description of the user\'s dream wedding vision, including style, colors, and atmosphere.'),
});
export type MoodboardInput = z.infer<typeof MoodboardInputSchema>;

export const MoodboardOutputSchema = z.object({
  images: z.array(
    z.object({
      prompt: z.string().describe('The search query used to find this image.'),
      url: z.string().describe('The URL of the found image.'),
    })
  ).describe('An array of found images for the moodboard.'),
});
export type MoodboardOutput = z.infer<typeof MoodboardOutputSchema>;


// Define the tool for searching Google Images
const googleImageSearchTool = ai.defineTool(
  {
    name: 'googleImageSearch',
    description: 'Searches Google Images for a given query and returns a list of image URLs.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(z.string().url()),
  },
  async ({ query }) => {
    console.log(`Performing image search for: ${query}`);
    
    if (!process.env.APIFY_API_TOKEN) {
      throw new Error("APIFY_API_TOKEN is not set in environment variables.");
    }
    
    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });
    
    const actorCall = await client.actor('apify/google-images-scraper').call({
      queries: [query],
      resultsLimit: 5, // Get 5 images per query
    });

    const { items } = await client.dataset(actorCall.defaultDatasetId).listItems();
    // The scraper returns a list of objects, each with an array of images. We flatten them.
    const imageUrls = (items as any[]).flatMap(item => item.images.map((img: any) => img.src));
    
    console.log(`Found ${imageUrls.length} images for query: "${query}"`);
    return imageUrls.slice(0, 5); // Return top 5 images
  }
);


// Define the prompt to extract search queries from the user's description
const extractSearchQueriesPrompt = ai.definePrompt({
  name: 'extractMoodboardSearchQueries',
  input: { schema: MoodboardInputSchema },
  output: { schema: z.object({ queries: z.array(z.string()).length(4).describe('An array of exactly 4 distinct, concise search queries for an image search engine.') }) },
  prompt: `You are a creative assistant. Based on the user's wedding description, generate exactly 4 distinct and concise search queries to find inspirational images on Google or Pinterest. The queries should cover different visual aspects like decor, attire, venue, and overall aesthetic.

User Description: "{{{description}}}"

Example Output for "a classic fairy-tale wedding in a castle with lots of white roses and gold accents":
{
  "queries": [
    "elegant white rose gold wedding decor",
    "fairy tale castle wedding venue inspiration",
    "classic ball gown wedding dress",
    "gold accent wedding details photography"
  ]
}
`,
});


// Define the main flow
const moodboardFlow = ai.defineFlow(
  {
    name: 'moodboardSearchFlow',
    inputSchema: MoodboardInputSchema,
    outputSchema: MoodboardOutputSchema,
  },
  async (input) => {
    // Step 1: Extract search queries from the user's description.
    const { output: searchQueriesOutput } = await extractSearchQueriesPrompt(input);
    if (!searchQueriesOutput?.queries) {
      throw new Error('Could not extract search queries from the description.');
    }
    const queries = searchQueriesOutput.queries;
    console.log("Generated search queries:", queries);

    // Step 2: Search for an image for each query in parallel.
    const imagePromises = queries.map(async (query) => {
      try {
        const imageUrls = await googleImageSearchTool({ query });
        if (imageUrls && imageUrls.length > 0) {
          return {
            prompt: query,
            url: imageUrls[0], // Take the first image result for each query
          };
        }
        return null;
      } catch (error) {
        console.error(`Error searching for query "${query}":`, error);
        return null; // Don't let one failed query stop the whole flow
      }
    });

    const images = (await Promise.all(imagePromises)).filter(img => img !== null) as { prompt: string; url: string; }[];
    
    if (images.length === 0) {
        throw new Error('Could not find any images for the given description. Please try again with a different description.');
    }

    return { images };
  }
);

// Export a wrapper function for use in server actions
export async function generateMoodboard(input: MoodboardInput): Promise<MoodboardOutput> {
  return moodboardFlow(input);
}
