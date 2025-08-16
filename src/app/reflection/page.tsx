
"use client";

import { useState, useEffect } from 'react';
import { getDailyReflectionPrompt } from "@/ai/flows/daily-reflection-prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

type ArchivedReflection = {
    date: string;
    prompt: string;
    reflection: string;
};

export default function ReflectionPage() {
    const [prompt, setPrompt] = useState("");
    const [reflection, setReflection] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [reflections, setReflections] = useLocalStorage<ArchivedReflection[]>('stoic-reflections', []);
    const { toast } = useToast();

    useEffect(() => {
        const fetchPrompt = async () => {
            try {
                const { prompt } = await getDailyReflectionPrompt();
                setPrompt(prompt);
            } catch (error) {
                console.error("Failed to fetch reflection prompt", error);
                setPrompt("What are you grateful for today?");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrompt();
    }, []);

    const handleSaveReflection = () => {
        if (reflection.trim() === "") {
             toast({
                title: "Cannot save empty journal entry.",
                variant: "destructive",
            });
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        
        const newReflection: ArchivedReflection = {
            date: today,
            prompt,
            reflection,
        };

        const existingEntryIndex = reflections.findIndex(r => r.date === today);

        if (existingEntryIndex !== -1) {
            const updatedReflections = [...reflections];
            updatedReflections[existingEntryIndex] = newReflection;
            setReflections(updatedReflections);
        } else {
            setReflections([...reflections, newReflection]);
        }
        
        toast({
            title: "Life is good",
            description: "Your gratitude has been saved in the Journal Section."
        });
    };

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
                        <CardTitle>GRATITUDE JOURNAL</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {isLoading ? (
                             <p className="text-center text-3xl md:text-4xl">Loading prompt...</p>
                        ) : (
                            <p className="text-center text-3xl md:text-4xl">"{prompt}"</p>
                        )}
                        <Textarea
                            placeholder="Your thoughts..."
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            className="bg-background rounded-none border-2 border-foreground focus-visible:ring-primary focus-visible:ring-offset-0 text-xl"
                            rows={6}
                        />
                         <Button onClick={handleSaveReflection} className="w-full rounded-none border-2 border-foreground hover:bg-primary hover:text-primary-foreground">
                            <Save className="mr-2 h-5 w-5" /> Save Entry
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
