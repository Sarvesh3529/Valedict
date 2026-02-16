'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Star } from 'lucide-react';
import { isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
    currentStreak: number;
    highestStreak: number;
    lastActivityDate?: string;
}

export default function StreakDisplay({ currentStreak, highestStreak, lastActivityDate }: StreakDisplayProps) {
    const hasCompletedToday = lastActivityDate ? isToday(new Date(lastActivityDate)) : false;

    const cardClasses = hasCompletedToday
        ? "bg-orange-500/10 border-orange-500/30"
        : "bg-secondary border-border";

    const iconClasses = hasCompletedToday
        ? "text-orange-500"
        : "text-muted-foreground";
        
    const message = hasCompletedToday
        ? "You've hit your goal for today!"
        : "Complete a lesson to keep your streak alive!";

    return (
        <Card className={cn("transition-colors", cardClasses)}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={cn("font-headline transition-colors", hasCompletedToday ? 'text-orange-400' : 'text-muted-foreground')}>Your Streak</CardTitle>
                <Flame className={cn("h-6 w-6 transition-colors", iconClasses, hasCompletedToday && 'fill-orange-500')} />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{currentStreak} <span className="text-2xl font-normal text-muted-foreground">days</span></div>
                <p className="text-xs text-muted-foreground mt-1">{message}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-4 gap-2">
                    <Star className="h-4 w-4 text-yellow-500"/>
                    Highest Streak: {highestStreak} days
                </div>
            </CardContent>
        </Card>
    );
}
