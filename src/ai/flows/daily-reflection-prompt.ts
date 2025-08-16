'use server';

/**
 * @fileOverview Provides a daily gratitude journal prompt.
 *
 * - getDailyReflectionPrompt - A function that returns the gratitude journal prompt.
 * - DailyReflectionPromptOutput - The return type for the getDailyReflectionPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyReflectionPromptOutputSchema = z.object({
  prompt: z.string().describe('A daily gratitude prompt.'),
});
export type DailyReflectionPromptOutput = z.infer<typeof DailyReflectionPromptOutputSchema>;

const prompt = 'What are you grateful for today?';

export async function getDailyReflectionPrompt(): Promise<DailyReflectionPromptOutput> {
  return dailyReflectionPromptFlow();
}

const dailyReflectionPromptFlow = ai.defineFlow(
  {
    name: 'dailyReflectionPromptFlow',
    outputSchema: DailyReflectionPromptOutputSchema,
  },
  async () => {
    return {prompt: prompt};
  }
);
