'use server';
/**
 * @fileOverview Provides a daily Stoic quote for reflection.
 *
 * - getDailyStoicQuote - A function that returns a random Stoic quote.
 * - DailyStoicQuoteOutput - The return type for the getDailyStoicQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyStoicQuoteOutputSchema = z.object({
  quote: z.string().describe('A Stoic quote for the day.'),
});
export type DailyStoicQuoteOutput = z.infer<typeof DailyStoicQuoteOutputSchema>;

const stoicQuotes = [
  'You have power over your mind - not outside events. Realize this, and you will find strength.',
  'Waste no more time arguing what a good man should be. Be one.',
  'How long are you going to wait before you demand the best for yourself?',
  'Begin at once to live, and count each separate day as a separate life.',
  'He who has a why to live can bear almost any how.',
  'Think of the life you have lived until now as over and, as a dead man, see what’s left as a bonus and live it according to nature.',
  'The happiness of your life depends upon the quality of your thoughts.',
  'We suffer more often in imagination than in reality.',
  'Luck is what happens when preparation meets opportunity.',
  'If you want to improve, be content to be thought foolish and stupid.',
];

export async function getDailyStoicQuote(): Promise<DailyStoicQuoteOutput> {
  return dailyStoicQuoteFlow();
}

const prompt = ai.definePrompt({
  name: 'dailyStoicQuotePrompt',
  output: {schema: DailyStoicQuoteOutputSchema},
  prompt: `Here is a list of stoic quotes:

  {{#each quotes}}
  - {{{this}}}
  {{/each}}

  Choose one quote from the list above. Just respond with the quote.`,
});

const dailyStoicQuoteFlow = ai.defineFlow(
  {
    name: 'dailyStoicQuoteFlow',
    outputSchema: DailyStoicQuoteOutputSchema,
  },
  async () => {
    const {output} = await prompt({
      quotes: stoicQuotes,
    });
    return {
      quote: output!.quote,
    };
  }
);
