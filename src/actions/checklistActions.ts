
'use server';

import { recommendTasks, TaskRecommendationInputSchema, type TaskRecommendationInput, type TaskRecommendationOutput } from '@/ai/flows/task-recommendation';
import { z } from 'zod';
import { mockWeddingDetails } from '@/lib/mockData';
import type { Task } from '@/lib/types';


// Define a schema for the form data, derived from the flow input
const FormInputSchema = TaskRecommendationInputSchema.pick({
    guestCount: true
}).extend({
    // We get wedding kind and events from mock data, so they are not in the form
});

export interface AIResponseState {
  message: string;
  errors?: z.ZodError<z.infer<typeof FormInputSchema>>['formErrors']['fieldErrors'];
  data?: TaskRecommendationOutput;
}

export async function getAITaskSuggestions(
  prevState: AIResponseState,
  formData: FormData
): Promise<AIResponseState> {
  const formValues = {
      // In this demo, we can use a default guest count or one from the form if available
      guestCount: formData.get('guestCount') as string || mockWeddingDetails.guestCount,
  };

  const validatedFields = FormInputSchema.safeParse(formValues);
  
  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const inputData: TaskRecommendationInput = {
      weddingKind: "Mixed (Traditional & Christian/Muslim influences)", // A generic kind for demo
      primaryEvent: mockWeddingDetails.events[0], // Use first event as primary
      additionalEvent: mockWeddingDetails.events.slice(1).join(', ') || undefined,
      guestCount: validatedFields.data.guestCount,
    };
    
    const result = await recommendTasks(inputData);

    if (result && result.tasks && result.tasks.length > 0) {
      return { message: "Successfully generated task suggestions.", data: result };
    } else {
      return { message: "The AI couldn't generate tasks based on the provided details. Please try again." };
    }
  } catch (error: any) {
    console.error("Error fetching AI task suggestions:", error);
    return { message: error.message || "An unexpected error occurred while fetching suggestions." };
  }
}
