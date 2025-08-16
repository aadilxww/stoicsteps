
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ArchivedTask = {
  id: string;
  text: string;
  date: string;
};

type ArchivedReflection = {
    date: string;
    prompt: string;
    reflection: string;
};

export default function ArchivePage() {
    const [archivedTasks] = useLocalStorage<ArchivedTask[]>('stoic-archived-tasks', []);
    const [archivedReflections] = useLocalStorage<ArchivedReflection[]>('stoic-reflections', []);
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

    const sortedTaskDates = Object.keys(groupedTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const sortedReflectionDates = [...archivedReflections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!isClient) {
        return null; 
    }

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
                        <CardTitle>ARCHIVE</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Tabs defaultValue="reflections" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 rounded-none bg-transparent border-2 border-foreground p-0">
                                <TabsTrigger value="reflections" className="rounded-none border-r-2 border-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Journal</TabsTrigger>
                                <TabsTrigger value="steps" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Incomplete Steps</TabsTrigger>
                            </TabsList>
                            <TabsContent value="reflections" className="mt-6">
                                {sortedReflectionDates.length === 0 ? (
                                    <p className="text-center text-muted-foreground">No journal entries yet.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {sortedReflectionDates.map(item => (
                                            <div key={item.date} className="fade-in">
                                                <h3 className="text-xl md:text-2xl font-semibold mb-2 border-b-2 border-dashed border-muted pb-2">
                                                    {format(parseISO(item.date), 'MMMM do, yyyy')}
                                                </h3>
                                                <div className="space-y-2 mt-4">
                                                   <p className="text-muted-foreground text-lg">"{item.prompt}"</p>
                                                   <p className="text-xl pl-4 border-l-2 border-primary">{item.reflection}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="steps" className="mt-6">
                                 {sortedTaskDates.length === 0 ? (
                                    <p className="text-center text-muted-foreground">No incomplete steps.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {sortedTaskDates.map(date => (
                                            <div key={date} className="fade-in">
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
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
