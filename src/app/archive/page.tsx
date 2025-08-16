
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type ArchivedTask = {
  id: string;
  text: string;
  date: string;
};

export default function ArchivePage() {
    const [archivedTasks] = useLocalStorage<ArchivedTask[]>('stoic-archived-tasks', []);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const groupedTasks = archivedTasks.reduce((acc, task) => {
        const date = task.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(task);
        return acc;
    }, {} as Record<string, ArchivedTask[]>);

    const sortedDates = Object.keys(groupedTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (!isClient) {
        return null; 
    }

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
                        <CardTitle>ARCHIVED STEPS</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {sortedDates.length === 0 ? (
                            <p className="text-center text-muted-foreground">No archived steps yet.</p>
                        ) : (
                            <div className="space-y-6">
                                {sortedDates.map(date => (
                                    <div key={date}>
                                        <h3 className="text-xl md:text-2xl font-semibold mb-2 border-b-2 border-dashed border-muted pb-2">
                                            {format(parseISO(date), 'MMMM do, yyyy')}
                                        </h3>
                                        <ul className="space-y-2 mt-2">
                                            {groupedTasks[date].map(task => (
                                                <li key={task.id} className="flex items-center gap-3">
                                                    <span className="text-muted-foreground">-</span>
                                                    <span>{task.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
