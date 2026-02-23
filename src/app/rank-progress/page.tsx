'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Compass,
  Zap,
  Shield,
  Sword,
  Crown,
  Trophy,
  Hand,
  Infinity as InfinityIcon,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const RANKS = [
  { xp: 100, title: 'Wanderer', icon: Compass },
  { xp: 500, title: 'Scout', icon: Zap },
  { xp: 1200, title: 'Guardian', icon: Shield },
  { xp: 2500, title: 'Vanguard', icon: Sword },
  { xp: 3500, title: 'Elite', icon: Crown },
  { xp: 4250, title: 'Champion', icon: Trophy },
  { xp: 5000, title: 'Titan', icon: Hand },
  { xp: 7500, title: 'Immortal', icon: InfinityIcon },
  { xp: 10000, title: 'Mythic', icon: Sparkles },
];

export default function RankProgressPage() {
  const { profile } = useAuth();
  const totalXp = profile?.totalxp || 0;

  const currentRankIndex = RANKS.findLastIndex((r) => totalXp >= r.xp);
  const currentRankData = currentRankIndex === -1 ? { title: 'Beginner', xp: 0, icon: Compass } : RANKS[currentRankIndex];
  const nextRank = RANKS[currentRankIndex + 1] || null;

  let progressToNext = 0;
  if (nextRank) {
    const floor = currentRankIndex === -1 ? 0 : RANKS[currentRankIndex].xp;
    const range = nextRank.xp - floor;
    const progress = totalXp - floor;
    progressToNext = Math.min((progress / range) * 100, 100);
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col">
      {/* Starry Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Header Area */}
      <div className="relative z-10 p-4 md:p-6 flex items-center justify-between">
        <Button asChild variant="ghost" className="text-white hover:bg-white/10 rounded-full h-10 px-4">
          <Link href="/home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Academic Journey</p>
          <h1 className="text-lg md:text-xl font-black uppercase tracking-tight">Rank Progress</h1>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 max-w-6xl mx-auto w-full space-y-8 pb-12">
        {/* HERO RANK CARD: Prominent top section */}
        <Card className="w-full bg-gradient-to-br from-blue-600/20 to-indigo-900/40 backdrop-blur-xl border-2 border-white/10 overflow-hidden rounded-[2rem] shadow-2xl">
          <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative flex-shrink-0">
              <div className={cn(
                "w-24 h-24 md:w-32 md:h-32 rounded-[2rem] flex items-center justify-center bg-primary/20 border-2 border-primary/30",
                "shadow-[0_0_40px_rgba(59,130,246,0.3)] relative group"
              )}>
                <currentRankData.icon className="w-12 h-12 md:w-16 md:h-16 text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <div className="absolute inset-0 rounded-[inherit] border border-white/10 group-hover:border-primary/50 transition-colors"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg">
                Active
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left w-full">
              <div className="space-y-1">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                  {currentRankData.title}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest text-white/70">
                    Tier {currentRankIndex + 2}
                  </span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {totalXp} Total XP
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Current Progress</span>
                  {nextRank && <span>Goal: {nextRank.xp} XP</span>}
                </div>
                <div className="relative">
                  <Progress value={progressToNext} className="h-4 bg-white/5 border border-white/5 rounded-full" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-full pointer-events-none"></div>
                </div>
                {nextRank && (
                  <p className="text-[10px] font-bold text-primary uppercase tracking-tighter text-center md:text-left">
                    Earn {nextRank.xp - totalXp} more XP to reach the next milestone!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HORIZONTAL ROADMAP */}
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Expedition Path</h3>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Scroll to explore &rarr;</span>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-[2.5rem] border-2 border-white/5 bg-white/5 backdrop-blur-md">
            <div className="flex items-center space-x-16 md:space-x-24 min-w-max p-10 md:p-16">
              {RANKS.map((rank, index) => {
                const isReached = totalXp >= rank.xp;
                const isCurrent = index === currentRankIndex;
                const Icon = rank.icon;

                return (
                  <div key={rank.xp} className="flex flex-col items-center space-y-6 relative group">
                    {/* Connecting Line */}
                    {index < RANKS.length - 1 && (
                      <div className={cn(
                        "absolute top-10 left-1/2 w-full h-[2px] z-0 pointer-events-none",
                        isReached && totalXp >= RANKS[index+1].xp 
                          ? "bg-primary" 
                          : "bg-white/10 border-t-2 border-dashed border-white/20"
                      )} style={{ width: 'calc(100% + 4rem)' }}></div>
                    )}

                    {/* Milestone Node */}
                    <motion.div
                      whileHover={{ scale: 1.1, y: -5 }}
                      className={cn(
                        "w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center relative z-10 transition-all duration-500",
                        isReached 
                          ? "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.4)]" 
                          : "bg-slate-800 text-muted-foreground border-2 border-white/5 grayscale"
                      )}
                    >
                      <Icon className={cn("w-10 h-10 md:w-12 md:h-12", !isReached && "opacity-20")} />
                      
                      {/* Status Indicators */}
                      {!isReached && (
                        <div className="absolute -top-3 -right-3 bg-slate-900 p-2 rounded-xl border-2 border-white/10 shadow-xl">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      
                      {isReached && !isCurrent && (
                        <div className="absolute -bottom-3 -right-3 bg-green-500 p-2 rounded-xl shadow-xl">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Pulsing Aura for Current Rank */}
                      {isCurrent && (
                        <div className="absolute -inset-3 border-2 border-yellow-500/50 rounded-[2rem] animate-pulse"></div>
                      )}
                    </motion.div>

                    {/* Label Section */}
                    <div className="text-center space-y-1">
                      <h4 className={cn(
                        "text-[11px] font-black uppercase tracking-widest",
                        isReached ? "text-white" : "text-muted-foreground"
                      )}>
                        {rank.title}
                      </h4>
                      <p className={cn(
                        "text-[10px] font-bold uppercase",
                        isReached ? "text-primary" : "text-slate-600"
                      )}>
                        {rank.xp} XP
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
