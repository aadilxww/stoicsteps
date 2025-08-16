'use server';

/**
 * @fileOverview Provides a daily reflection prompt chosen by AI from a curated set.
 *
 * - getDailyReflectionPrompt - A function that returns a daily reflection prompt.
 * - DailyReflectionPromptOutput - The return type for the getDailyReflectionPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyReflectionPromptOutputSchema = z.object({
  prompt: z.string().describe('A daily reflection prompt.'),
});
export type DailyReflectionPromptOutput = z.infer<typeof DailyReflectionPromptOutputSchema>;

const prompts = [
  'What did you control today?',
  'What is one thing you can do to improve tomorrow?',
  'What is making you feel grateful today?',
  'How can you turn a challenge into an opportunity?',
  'What is one area of your life you can simplify?',
  'What is a skill you can start learning today?',
  'What is a boundary you need to set?',
  'How can you show yourself more compassion?',
  'What small action can you take towards a big goal?',
  'What is a thought pattern you can challenge?',
];

export async function getDailyReflectionPrompt(): Promise<DailyReflectionPromptOutput> {
  return dailyReflectionPromptFlow();
}

const reflectionPrompt = ai.definePrompt({
  name: 'reflectionPrompt',
  output: {schema: DailyReflectionPromptOutputSchema},
  prompt: `Here is a list of reflection prompts:
${prompts.map((prompt, index) => `${index + 1}. ${prompt}`).join('\n')}

Choose one prompt from the list above. Just respond with the prompt.
`,
});

const dailyReflectionPromptFlow = ai.defineFlow(
  {
    name: 'dailyReflectionPromptFlow',
    outputSchema: DailyReflectionPromptOutputSchema,
  },
  async () => {
    const {output} = await reflectionPrompt({});
    return {prompt: output!.prompt};
  }
);
