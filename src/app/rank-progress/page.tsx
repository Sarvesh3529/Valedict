'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Shield,
  Sword,
  Crown,
  Trophy,
  Zap,
  Infinity as InfinityIcon,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Custom SVG Icons for Wanderer and Scout
const WandererIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 18l2-1 1-3 3-1 2 2 1 5-4 1-5-3z" />
    <path d="M7 14l3-3 3 1 2-2" />
    <circle cx="17" cy="7" r="3" />
    <path d="M17 4v6" />
    <path d="M14 7h6" />
  </svg>
);

const ScoutIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 7V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4" />
    <path d="M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
    <circle cx="8" cy="14" r="3" />
    <circle cx="16" cy="14" r="3" />
    <path d="M11 14h2" />
  </svg>
);

const RANKS = [
  { xp: 100, title: 'Wanderer', icon: WandererIcon, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/50' },
  { xp: 500, title: 'Scout', icon: ScoutIcon, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50' },
  { xp: 1200, title: 'Guardian', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50' },
  { xp: 2500, title: 'Vanguard', icon: Sword, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' },
  { xp: 3500, title: 'Elite', icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' },
  { xp: 4250, title: 'Champion', icon: Trophy, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50' },
  { xp: 5000, title: 'Titan', icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/50' },
  { xp: 7500, title: 'Immortal', icon: InfinityIcon, color: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-500/50' },
  { xp: 10000, title: 'Mythic', icon: Sparkles, color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' },
];

export default function RankProgressPage() {
  const { profile } = useAuth();
  const totalXp = profile?.totalxp || 0;

  const currentRankIndex = RANKS.findLastIndex((r) => totalXp >= r.xp);
  const currentRankData = currentRankIndex === -1 ? { title: 'Beginner', xp: 0, icon: Sparkles, color: 'text-primary' } : RANKS[currentRankIndex];
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

      <div className="relative z-10 flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4 space-y-8 pb-12">
        
        {/* HERO RANK CARD: Top centered section */}
        <Card className="w-full max-w-4xl bg-gradient-to-br from-blue-600/20 to-indigo-900/40 backdrop-blur-xl border-2 border-white/10 overflow-hidden rounded-[2rem] shadow-2xl">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className={cn(
                "w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center bg-primary/20 border-2 border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              )}>
                <currentRankData.icon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left w-full">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                  {currentRankData.title}
                </h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                  {totalXp} Total XP Collected
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Progress to Next Rank</span>
                  {nextRank && <span>{totalXp} / {nextRank.xp} XP</span>}
                </div>
                <Progress value={progressToNext} className="h-3 bg-white/5 border border-white/5 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HORIZONTAL ROADMAP */}
        <div className="w-full space-y-6 pt-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Expedition Path</h3>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Scroll left to right &rarr;</span>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap rounded-[2.5rem] border-2 border-white/5 bg-white/5 backdrop-blur-md">
            <div className="flex items-center space-x-12 md:space-x-20 min-w-max p-12 md:p-16">
              {RANKS.map((rank, index) => {
                const isReached = totalXp >= rank.xp;
                const isCurrent = index === currentRankIndex;
                const Icon = rank.icon;

                return (
                  <div key={rank.xp} className="flex flex-col items-center space-y-6 relative group">
                    {/* Connecting Line */}
                    {index < RANKS.length - 1 && (
                      <div className={cn(
                        "absolute top-12 left-1/2 w-full h-[2px] z-0 pointer-events-none",
                        isReached && totalXp >= RANKS[index+1].xp 
                          ? "bg-primary" 
                          : "bg-white/10 border-t-2 border-dashed border-white/20"
                      )} style={{ width: 'calc(100% + 3rem)' }}></div>
                    )}

                    {/* Milestone Node (Hexagon-ish) */}
                    <motion.div
                      whileHover={{ scale: 1.1, y: -5 }}
                      className={cn(
                        "w-24 h-24 rounded-[2rem] flex items-center justify-center relative z-10 transition-all duration-500",
                        isReached 
                          ? cn("shadow-2xl", rank.bg, rank.border) 
                          : "bg-slate-800/50 text-muted-foreground border-2 border-white/5 grayscale opacity-60"
                      )}
                    >
                      <Icon className={cn("w-12 h-12", isReached ? rank.color : "text-muted-foreground/40")} />
                      
                      {/* Status Indicators */}
                      {!isReached && (
                        <div className="absolute -top-2 -right-2 bg-slate-900 p-1.5 rounded-lg border border-white/10 shadow-xl">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                      
                      {isReached && !isCurrent && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-lg shadow-xl">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {/* Current Rank Aura */}
                      {isCurrent && (
                        <div className="absolute -inset-3 border-2 border-yellow-500/50 rounded-[2.5rem] animate-pulse current-rank"></div>
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
                        isReached ? rank.color : "text-slate-600"
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
