'use client';

import { motion } from 'framer-motion';
import { Flame, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  currentStreak: number;
  highestStreak: number;
  lastActivityDate?: string;
}

export default function StreakDisplay({ currentStreak, highestStreak, lastActivityDate }: StreakDisplayProps) {
  const goal = 7;
  const progress = Math.min((currentStreak / goal) * 100, 100);
  
  // Check if activity was done today
  const isToday = lastActivityDate 
    ? new Date(lastActivityDate).toDateString() === new Date().toDateString() 
    : false;
    
  const isOnFire = isToday;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className={cn(
        "h-full overflow-hidden border-2 flex flex-col justify-center items-center relative bouncy-hover glass-card",
        isOnFire ? "border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]" : "border-border"
      )}>
        <CardContent className="p-6 flex flex-col h-full w-full justify-between gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Daily Streak</h3>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-5xl font-black tabular-nums", isOnFire ? "text-orange-500" : "text-foreground")}>{currentStreak}</span>
                <span className="text-lg font-bold text-muted-foreground">days</span>
              </div>
            </div>
            <div className="relative h-16 w-16">
              {/* Circular Progress Ring */}
              <svg className="h-16 w-16 -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="transparent"
                  stroke="currentColor"
                  className="text-muted/20"
                  strokeWidth="4"
                />
                <motion.circle
                  initial={{ strokeDasharray: "0 176" }}
                  animate={{ strokeDasharray: `${(progress / 100) * 176} 176` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  cx="32"
                  cy="32"
                  r="28"
                  fill="transparent"
                  stroke="currentColor"
                  className={isOnFire ? "text-orange-500" : "text-primary"}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={isOnFire ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Flame className={cn("h-8 w-8", isOnFire ? "fill-orange-500 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "text-muted-foreground/40")} />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <Star className="h-3 w-3 fill-current" />
              Highest: {highestStreak} days
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
