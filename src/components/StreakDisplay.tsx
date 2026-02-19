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

export default function StreakDisplay({ currentStreak, highestStreak }: StreakDisplayProps) {
  const goal = 7;
  const progress = Math.min((currentStreak / goal) * 100, 100);
  const isOnFire = currentStreak >= 3;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className={cn(
        "h-full overflow-hidden border-none text-white relative bouncy-hover streak-gradient",
        isOnFire && "streak-gradient-glow"
      )}>
        <CardContent className="p-6 flex flex-col h-full justify-between gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-80">Daily Streak</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">{currentStreak}</span>
                <span className="text-lg font-bold opacity-80">days</span>
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
                  stroke="rgba(255,255,255,0.2)"
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
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={isOnFire ? {
                    scale: [1, 1.2, 1],
                    filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Flame className={cn("h-8 w-8", isOnFire ? "fill-yellow-300 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" : "text-white/40")} />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider opacity-70">
              <Star className="h-3 w-3 fill-current" />
              Highest: {highestStreak} days
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
