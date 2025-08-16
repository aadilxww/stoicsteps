import { getDailyStoicQuote } from "@/ai/flows/daily-stoic-quote";
import StoicStepsClient from "@/components/StoicStepsClient";

export default async function Home() {
  const { quote } = await getDailyStoicQuote();

  return <StoicStepsClient quote={quote} />;
}
