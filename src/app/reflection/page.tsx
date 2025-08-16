import { getDailyReflectionPrompt } from "@/ai/flows/daily-reflection-prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ReflectionPage() {
    const { prompt } = await getDailyReflectionPrompt();

    return (
        <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-background text-foreground text-2xl md:text-3xl">
            <main className="w-full max-w-2xl mx-auto flex flex-col gap-8">
                <div className="flex justify-start">
                    <Button asChild variant="link" className="text-lg md:text-xl text-foreground hover:text-primary pl-0">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Steps
                        </Link>
                    </Button>
                </div>
                <Card className="border-foreground border-2 rounded-none bg-transparent shadow-none">
                    <CardHeader>
                        <CardTitle>DAILY REFLECTION</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-center text-3xl md:text-4xl">"{prompt}"</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
