'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Star } from 'lucide-react';

interface StreakDisplayProps {
    currentStreak: number;
    highestStreak: number;
}

export default function StreakDisplay({ currentStreak, highestStreak }: StreakDisplayProps) {
    return (
        <Card className="bg-orange-500/10 border-orange-500/30">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-orange-400">Your Streak</CardTitle>
                <Flame className="h-6 w-6 text-orange-500" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{currentStreak} <span className="text-2xl font-normal text-muted-foreground">days</span></div>
                <p className="text-xs text-muted-foreground mt-1">Complete a quiz each day to build your streak!</p>
                <div className="flex items-center text-xs text-muted-foreground mt-4 gap-2">
                    <Star className="h-4 w-4 text-yellow-500"/>
                    Highest Streak: {highestStreak} days
                </div>
            </CardContent>
        </Card>
    );
}
