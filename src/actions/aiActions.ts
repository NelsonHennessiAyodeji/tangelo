
'use server';

import { generateMoodboard, MoodboardInputSchema, type MoodboardInput, type MoodboardOutput } from '@/ai/flows/moodboard-search-flow';
import { z } from 'zod';


// ======== Moodboard Generation Action ========

export interface MoodboardFormState {
  message: string;
  fields?: { description?: string };
  errors?: z.ZodError<z.infer<typeof MoodboardInputSchema>>['formErrors']['fieldErrors'];
  data?: MoodboardOutput;
}

export async function getAIMoodboard(
  prevState: MoodboardFormState,
  formData: FormData
): Promise<MoodboardFormState> {
  const formValues = {
    description: formData.get('description') as string,
  };

  const validatedFields = MoodboardInputSchema.safeParse(formValues);

  if (!validatedFields.success) {
    return {
      message: "Invalid form data. Please check the fields.",
      fields: formValues,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateMoodboard(validatedFields.data);
    if (result && result.images && result.images.length > 0) {
      return { message: "Moodboard generated successfully.", data: result };
    } else {
      return { message: "Could not generate moodboard. Please try refining your description." };
    }
  } catch (error: any)
  {
    console.error("Error generating AI moodboard:", error);
    return { message: error.message || "An unexpected error occurred while generating the moodboard." };
  }
}
