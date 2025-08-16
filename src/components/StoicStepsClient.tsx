
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import SisyphusAnimation from '@/components/SisyphusAnimation';
import { Plus, Pencil, Trash2, Save, X, BookOpen, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { getDailyStoicQuote } from '@/ai/flows/daily-stoic-quote';
import TimeLeftTimer from './TimeLeftTimer';
import MusicToggle from './MusicToggle';
import { useToast } from '@/hooks/use-toast';

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type ArchivedTask = {
  id: string;
  text: string;
  date: string;
}

type WeeklyProgress = {
  [date: string]: number;
};

interface StoicStepsClientProps {
  quote: string;
}

export default function StoicStepsClient({ quote: initialQuote }: StoicStepsClientProps) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('stoic-tasks', []);
  const [lastResetDate, setLastResetDate] = useLocalStorage<string>('stoic-last-reset', '');
  const [archivedTasks, setArchivedTasks] = useLocalStorage<ArchivedTask[]>('stoic-archived-tasks', []);
  const [weeklyProgress, setWeeklyProgress] = useLocalStorage<WeeklyProgress>('stoic-weekly-progress', {});
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  
  const [isClient, setIsClient] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [quote, setQuote] = useState(initialQuote);
  const [isRefreshingQuote, setIsRefreshingQuote] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();


  useEffect(() => {
    setIsClient(true);
    setCurrentDate(format(new Date(), 'MMMM do, yyyy'));
  }, []);

  useEffect(() => {
    if (isClient) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/music/Vagabond.mp3');
        audioRef.current.loop = true;
      }

      if (isMusicPlaying) {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isClient, isMusicPlaying]);


  const handleResetQuote = useCallback(async () => {
    setIsRefreshingQuote(true);
    try {
      const { quote: newQuote } = await getDailyStoicQuote();
      setQuote(newQuote);
    } catch (error) {
      console.error("Failed to fetch new quote", error);
    } finally {
      setIsRefreshingQuote(false);
    }
  }, [setQuote]);

  useEffect(() => {
    if (isClient) {
        const today = new Date().toISOString().split('T')[0];
        if (lastResetDate !== today && lastResetDate) {
            const incompleteTasks = tasks.filter(task => !task.completed);
            if (incompleteTasks.length > 0) {
              const newArchivedTasks: ArchivedTask[] = incompleteTasks.map(task => ({
                id: task.id,
                text: task.text,
                date: lastResetDate
              }));
              setArchivedTasks([...newArchivedTasks, ...archivedTasks]);
            }
            setTasks([]);
            setLastResetDate(today);
            handleResetQuote();
        } else if (!lastResetDate) {
          setLastResetDate(today);
        }
    }
  }, [isClient, lastResetDate, setTasks, setLastResetDate, handleResetQuote, tasks, archivedTasks, setArchivedTasks]);
  
  useEffect(() => {
    const interval = setInterval(() => {
        handleResetQuote();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [handleResetQuote]);


  const completedTasks = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const weeklyTotal = useMemo(() => {
    const today = new Date();
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      count += weeklyProgress[dateString] || 0;
    }
    return count;
  }, [weeklyProgress]);

  const updateWeeklyProgress = (change: number) => {
    const today = new Date().toISOString().split('T')[0];
    setWeeklyProgress(prev => ({
      ...prev,
      [today]: Math.max(0, (prev[today] || 0) + change),
    }));
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }]);
      setNewTaskText('');
    }
  };

  const handleToggleComplete = (id: string) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;
    const wasCompleted = taskToToggle.completed;

    setTasks(
      tasks.map(task => {
        if (task.id === id) {
          if (!wasCompleted) {
            updateWeeklyProgress(1);
          } else {
            updateWeeklyProgress(-1);
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete?.completed) {
      updateWeeklyProgress(-1);
    }
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStartEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const handleSaveEdit = () => {
    if (editingTaskId && editingTaskText.trim()) {
      setTasks(tasks.map(task => (task.id === editingTaskId ? { ...task, text: editingTaskText.trim() } : task)));
      setEditingTaskId(null);
      setEditingTaskText('');
    }
  };
  
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };
  
  if (!isClient) {
      return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-background text-foreground text-2xl md:text-3xl fade-in">
      <main className="w-full max-w-2xl mx-auto flex flex-col gap-8">
        
        <SisyphusAnimation progress={progress} />

        <Card className="border-foreground border-2 rounded-none bg-transparent shadow-none transition-all hover:shadow-lg hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>DAILY STEPS</CardTitle>
            <div className="text-right">
              <p className="text-lg md:text-xl text-muted-foreground">{currentDate}</p>
              <TimeLeftTimer />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="A new step..."
                className="bg-background rounded-none border-2 border-foreground focus-visible:ring-primary focus-visible:ring-offset-0"
              />
              <Button onClick={handleAddTask} variant="outline" size="icon" className="rounded-none border-2 border-foreground hover:bg-primary hover:text-primary-foreground transition-transform active:scale-95">
                <Plus className="h-6 w-6" />
              </Button>
            </div>
            <ul className="space-y-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center gap-2 p-2 border-b-2 border-dashed border-muted fade-in transition-all">
                  {editingTaskId === task.id ? (
                     <>
                        <Input
                            type="text"
                            value={editingTaskText}
                            onChange={(e) => setEditingTaskText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className="bg-background rounded-none border-2 border-foreground flex-grow"
                            autoFocus
                        />
                        <Button onClick={handleSaveEdit} variant="ghost" size="icon"><Save className="h-5 w-5"/></Button>
                        <Button onClick={handleCancelEdit} variant="ghost" size="icon"><X className="h-5 w-5"/></Button>
                     </>
                  ) : (
                    <>
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                        className="h-6 w-6 rounded-none border-2 border-foreground data-[state=checked]:bg-primary data-[state=checked]:text-black transition-all"
                      />
                      <label htmlFor={`task-${task.id}`} className={`flex-grow cursor-pointer transition-all ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.text}
                      </label>
                      <Button onClick={() => handleStartEditing(task)} variant="ghost" size="icon" className="transition-transform active:scale-95"><Pencil className="h-5 w-5" /></Button>
                      <Button onClick={() => handleDeleteTask(task.id)} variant="ghost" size="icon" className="transition-transform active:scale-95"><Trash2 className="h-5 w-5" /></Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
             {tasks.length === 0 && <p className="text-muted-foreground text-center p-4">No steps taken yet. Begin.</p>}
          </CardContent>
        </Card>

        <div>
            {weeklyTotal > 0 && <p className="text-center text-lg md:text-xl text-muted-foreground mb-4">You pushed the boulder {weeklyTotal} steps this week. Keep climbing.</p>}
        </div>

        <Card className="border-foreground border-2 rounded-none bg-transparent shadow-none transition-all hover:shadow-lg hover:border-primary">
          <CardContent className="p-6 flex items-center gap-4">
            <p className="text-center flex-grow">"{quote}"</p>
          </CardContent>
        </Card>
        
        <div className="text-center mt-4 flex justify-center items-center gap-4">
            <Button asChild variant="link" className="text-lg md:text-xl text-foreground hover:text-primary transition-transform active:scale-95">
                <Link href="/reflection">
                    <BookOpen className="mr-2 h-5 w-5"/> Gratitude Journal
                </Link>
            </Button>
            <Button asChild variant="link" className="text-lg md:text-xl text-foreground hover:text-primary transition-transform active:scale-95">
                <Link href="/archive">
                    <Archive className="mr-2 h-5 w-5"/> Journey
                </Link>
            </Button>
            <MusicToggle isPlaying={isMusicPlaying} onToggle={toggleMusic} />
        </div>
      </main>
    </div>
  );
}
