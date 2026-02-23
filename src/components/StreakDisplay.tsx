'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { resetBrokenStreak } from '@/app/quiz/actions';

interface StreakDisplayProps {
  currentStreak: number;
  highestStreak: number;
  lastActivityDate?: string;
}

export default function StreakDisplay({ currentStreak, highestStreak, lastActivityDate }: StreakDisplayProps) {
  const goal = 7;
  
  // Logic helpers for local timezone comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = lastActivityDate ? new Date(lastActivityDate) : null;
  if (last) {
    last.setHours(0, 0, 0, 0);
  }

  // 1. The 'Reset to 0' Check (On App Load/View)
  useEffect(() => {
    if (last && currentStreak > 0) {
      const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
      const diff = today.getTime() - last.getTime();
      const diffDays = Math.round(diff / ONE_DAY_IN_MS);

      if (diffDays > 1) {
        // Today is more than 1 calendar day after lastactive
        resetBrokenStreak();
      }
    }
  }, [last, currentStreak, today]);

  // 2. The 'Grey Flame' Logic (Visual Only)
  // Glow only if lesson completed on the current calendar day
  const isGlowing = last ? last.getTime() === today.getTime() : false;
  
  const progress = Math.min((currentStreak / goal) * 100, 100);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className={cn(
        "h-full overflow-hidden border-2 flex flex-col justify-center relative bouncy-hover glass-card",
        isGlowing ? "border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]" : "border-border"
      )}>
        <CardContent className="p-4 md:p-6 flex flex-col h-full w-full justify-between gap-2 md:gap-4">
          <div className="flex items-center sm:items-start justify-between">
            <div className="space-y-0.5 md:space-y-1 overflow-hidden">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Streak</h3>
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  "text-3xl md:text-5xl font-black tabular-nums leading-none", 
                  isGlowing ? "text-orange-500" : "text-muted-foreground/60"
                )}>
                    {currentStreak}
                </span>
                <span className="text-[10px] md:text-lg font-bold text-muted-foreground uppercase">days</span>
              </div>
            </div>
            
            {/* Desktop View: Circular Ring */}
            <div className="hidden sm:block relative h-16 w-16">
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
                  className={isGlowing ? "text-orange-500" : "text-muted-foreground/30"}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={isGlowing ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Flame className={cn(
                    "h-8 w-8", 
                    isGlowing 
                      ? "fill-orange-500 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" 
                      : "text-muted-foreground/40"
                  )} />
                </motion.div>
              </div>
            </div>

            {/* Mobile View: Simplified Flame */}
            <div className="sm:hidden">
                <motion.div
                  animate={isGlowing ? {
                    scale: [1, 1.15, 1],
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Flame className={cn(
                    "h-10 w-10", 
                    isGlowing 
                      ? "fill-orange-500 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]" 
                      : "text-muted-foreground/30"
                  )} />
                </motion.div>
            </div>
          </div>

          <div className="hidden sm:block space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <Star className="h-3 w-3 fill-current" />
              Highest: {highestStreak}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
