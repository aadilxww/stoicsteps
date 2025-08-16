
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { SisyphusAndBoulderIcon } from '@/components/SisyphusAndBoulderIcon';

export default function WhyStoicStepsPage() {
    return (
        <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-background text-foreground text-2xl md:text-3xl fade-in">
            <main className="w-full max-w-2xl mx-auto flex flex-col gap-8">
                <div className="flex justify-start">
                    <Button asChild variant="link" className="text-lg md:text-xl text-foreground hover:text-primary pl-0 transition-transform active:scale-95">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Steps
                        </Link>
                    </Button>
                </div>
                 <Card className="border-foreground border-2 rounded-none bg-transparent shadow-none transition-all hover:shadow-lg hover:border-primary">
                    <CardHeader>
                        <CardTitle>WHY STOIC STEPS?</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 text-center space-y-8">
                        <div className="flex justify-center">
                            <SisyphusAndBoulderIcon className="w-48 h-48 text-foreground animate-rotate" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold">Why a Stoic To-Do List?</h2>
                        <p className="text-xl md:text-2xl leading-relaxed">
                            Life's daily tasks can feel like a pointless struggle, much like Sisyphus pushing his boulder. But the Stoics teach us the goal isn't to reach the top; it's the push itself.
                        </p>
                        <p className="text-xl md:text-2xl leading-relaxed">
                            You can't control the obstacles, but you can control your effort. This app is your tool for the daily push. It’s a simple reminder that the value isn’t in the task being done, but in the discipline of doing it.
                        </p>
                        <p className="text-2xl md:text-3xl font-bold text-primary">
                            Your tasks are your boulder. Start pushing.
                        </p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
