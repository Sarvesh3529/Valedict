'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WeeklyProgressChart({ weeklyXp }: { weeklyXp: number }) {
  const weeklyGoal = 500;
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Convert Sun-Sat to Mon-Sun
  
  return (
    <Card className="h-full glass-card glow-border bouncy-hover border-2 overflow-hidden">
      <CardHeader className="pb-1 p-4 md:pb-2 md:p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden">Weekly XP</CardTitle>
          <div className="hidden sm:flex h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/20 items-center justify-center flex-shrink-0 ml-2">
            <Trophy className="h-3 w-3 md:h-4 md:w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 md:px-6 md:pb-6 space-y-2 md:space-y-6">
        <div className="space-y-2">
          <div className="flex items-end justify-between overflow-hidden">
            <div className="flex items-center gap-1 md:gap-2">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              <div className="flex items-baseline gap-1 overflow-hidden">
                <span className="text-xl md:text-3xl font-black tracking-tight leading-none tabular-nums">{weeklyXp}</span>
                <span className="text-[8px] md:text-sm font-bold text-muted-foreground">/ {weeklyGoal}</span>
              </div>
            </div>
          </div>
          
          {/* Segmented Progress Bar */}
          <div className="flex gap-0.5 md:gap-1 h-1.5 md:h-3">
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
                      "segmented-progress-item !h-full",
                      isCompleted && "bg-accent",
                      isToday && "bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]",
                      isPending && "bg-muted"
                    )}
                  />
                  <span className={cn(
                    "text-[6px] md:text-[8px] font-black",
                    isToday ? "text-primary" : "text-muted-foreground"
                  )}>{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational text hidden on mobile/footer devices */}
        <div className="hidden md:block pt-2">
          <p className="text-xs font-bold text-muted-foreground uppercase leading-relaxed">
            {weeklyXp < weeklyGoal 
              ? <><span className="text-primary">{weeklyGoal - weeklyXp} XP</span> to go!</>
              : "Goal reached! 🌟"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
