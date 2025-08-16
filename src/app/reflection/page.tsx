
"use client";

import { useState, useEffect } from 'react';
import { getDailyReflectionPrompt } from "@/ai/flows/daily-reflection-prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';

export default function ReflectionPage() {
    const [prompt, setPrompt] = useState("");
    const [reflection, setReflection] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrompt = async () => {
            try {
                const { prompt } = await getDailyReflectionPrompt();
                setPrompt(prompt);
            } catch (error) {
                console.error("Failed to fetch reflection prompt", error);
                setPrompt("What is on your mind today?");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrompt();
    }, []);

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
                    <CardContent className="p-6 space-y-6">
                        {isLoading ? (
                             <p className="text-center text-3xl md:text-4xl">Loading prompt...</p>
                        ) : (
                            <p className="text-center text-3xl md:text-4xl">"{prompt}"</p>
                        )}
                        <Textarea
                            placeholder="Your reflection..."
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            className="bg-background rounded-none border-2 border-foreground focus-visible:ring-primary focus-visible:ring-offset-0 text-xl"
                            rows={6}
                        />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
