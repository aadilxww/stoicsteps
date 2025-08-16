import { getDailyStoicQuote } from "@/ai/flows/daily-stoic-quote";
import { getDailyReflectionPrompt } from "@/ai/flows/daily-reflection-prompt";
import StoicStepsClient from "@/components/StoicStepsClient";

export default async function Home() {
  const [{ quote }, { prompt }] = await Promise.all([
    getDailyStoicQuote(),
    getDailyReflectionPrompt()
  ]);

  return <StoicStepsClient quote={quote} reflectionPrompt={prompt} />;
}
