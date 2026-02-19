'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WeeklyProgressChart({ weeklyXp }: { weeklyXp: number }) {
  const weeklyGoal = 500;
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Convert Sun-Sat to Mon-Sun
  
  // Mock logic: highlight previous days if weekly XP is high enough
  // In a real app, this would come from a daily activity array
  const xpPerDay = weeklyXp / (todayIndex + 1);

  return (
    <Card className="h-full glass-card glow-border bouncy-hover border-2 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Weekly XP</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-3xl font-black tracking-tight">{weeklyXp}</span>
              <span className="text-sm font-bold text-muted-foreground">/ {weeklyGoal} XP</span>
            </div>
          </div>
          
          {/* Segmented Progress Bar */}
          <div className="flex gap-1.5 h-3">
            {days.map((_, i) => {
              const isCompleted = i < todayIndex;
              const isToday = i === todayIndex;
              const isPending = i > todayIndex;

              return (
                <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                  <motion.div 
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    className={cn(
                      "segmented-progress-item",
                      isCompleted && "bg-accent",
                      isToday && "bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]",
                      isPending && "bg-muted"
                    )}
                  />
                  <span className={cn(
                    "text-[8px] font-black",
                    isToday ? "text-primary" : "text-muted-foreground"
                  )}>{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs font-bold text-muted-foreground uppercase leading-relaxed">
            {weeklyXp < weeklyGoal 
              ? <><span className="text-primary">{weeklyGoal - weeklyXp} XP</span> to reach level 12!</>
              : "Goal reached! You're an ace! 🌟"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}