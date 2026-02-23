'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Shield, Crown, Medal, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const milestones = [
  { xp: 100, label: 'Novice', icon: Star, color: 'text-blue-400' },
  { xp: 500, label: 'Apprentice', icon: Shield, color: 'text-green-400' },
  { xp: 1200, label: 'Scholar', icon: Medal, color: 'text-purple-400' },
  { xp: 2500, label: 'Expert', icon: Trophy, color: 'text-yellow-400' },
  { xp: 3500, label: 'Master', icon: Trophy, color: 'text-orange-400' },
  { xp: 4250, label: 'Grandmaster', icon: Crown, color: 'text-red-400' },
  { xp: 5000, label: 'Legend', icon: Crown, color: 'text-pink-400' },
  { xp: 7500, label: 'Mythic', icon: Crown, color: 'text-indigo-400' },
  { xp: 10000, label: 'Valedictorian', icon: Crown, color: 'text-yellow-500' },
];

export default function MilestonesPage() {
  const { profile } = useAuth();
  const totalXp = profile?.totalxp || 0;

  const nextMilestone = milestones.find(m => m.xp > totalXp) || milestones[milestones.length - 1];
  const progressToNext = Math.min((totalXp / nextMilestone.xp) * 100, 100);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12 space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
          Your <span className="text-primary">Journey</span>
        </h1>
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
          Rise through the ranks by mastering your subjects
        </p>
      </div>

      {/* Current Progress Header */}
      <Card className="border-4 border-primary/20 bg-secondary/10 overflow-hidden rounded-[2rem]">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Total XP</p>
              <h2 className="text-5xl font-black text-primary tabular-nums">{totalXp}</h2>
            </div>
            <div className="flex-1 w-full max-w-xs space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>Progress to {nextMilestone.label}</span>
                <span>{Math.round(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="h-4 border-2 border-primary/10" />
              <p className="text-[10px] font-bold text-center text-muted-foreground">
                {nextMilestone.xp - totalXp > 0 
                  ? `${nextMilestone.xp - totalXp} XP remaining for next level`
                  : "Maximum rank achieved! You are a legend."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones List */}
      <div className="grid grid-cols-1 gap-4">
        {milestones.map((m, index) => {
          const isCompleted = totalXp >= m.xp;
          const isCurrent = !isCompleted && (index === 0 || totalXp >= milestones[index - 1].xp);
          const Icon = m.icon;

          return (
            <motion.div
              key={m.xp}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "border-2 transition-all duration-300 relative overflow-hidden group",
                isCompleted ? "bg-accent/5 border-accent/30 shadow-none opacity-70" : 
                isCurrent ? "bg-primary/5 border-primary shadow-xl scale-[1.02] z-10" : 
                "bg-card border-border opacity-50"
              )}>
                <CardContent className="p-6 flex items-center gap-6">
                  <div className={cn(
                    "h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                    isCompleted ? "bg-accent/20" : isCurrent ? "bg-primary/20" : "bg-muted"
                  )}>
                    <Icon className={cn("h-8 w-8", isCompleted || isCurrent ? m.color : "text-muted-foreground")} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={cn("text-xl font-black uppercase tracking-tight", isCurrent && "text-primary")}>
                        {m.label}
                      </h3>
                      {isCompleted && <CheckCircle2 className="h-5 w-5 text-accent" />}
                      {!isCompleted && !isCurrent && <Lock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Requirement: {m.xp} XP
                    </p>
                  </div>

                  <div className="hidden sm:block">
                    {isCompleted ? (
                      <span className="text-[10px] font-black uppercase text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">Unlocked</span>
                    ) : isCurrent ? (
                      <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">In Progress</span>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Locked</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <Button asChild size="lg" className="rounded-full px-12 h-16 text-lg font-black shadow-primary/20">
          <Link href="/quiz">Keep Practicing</Link>
        </Button>
      </div>
    </div>
  );
}