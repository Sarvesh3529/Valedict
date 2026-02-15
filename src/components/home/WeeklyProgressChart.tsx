'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function WeeklyProgressChart({ weeklyXp }: { weeklyXp: number }) {
    const weeklyGoal = 500;
    const progress = Math.min((weeklyXp / weeklyGoal) * 100, 100);
    const data = [{ name: 'Weekly XP', xp: weeklyXp, goal: weeklyGoal }];

    return (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Weekly Progress</CardTitle>
                <CardDescription>You've earned {weeklyXp} XP this week. Keep it up!</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={data} layout="vertical" margin={{ left: -20}}>
                        <XAxis type="number" hide domain={[0, weeklyGoal]}/>
                        <YAxis type="category" dataKey="name" hide />
                        <Bar dataKey="xp" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} background={{ fill: 'hsl(var(--secondary))', radius: 4 }} />
                    </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>0 XP</span>
                    <span>Goal: {weeklyGoal} XP</span>
                </div>
            </CardContent>
        </Card>
    )
}
