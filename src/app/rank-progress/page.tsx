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
  Swords,
  Crown,
  Trophy,
  Zap,
  Infinity as InfinityIcon,
  Sparkles,
  Compass,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const RANKS = [
  { xp: 100, title: 'Wanderer', icon: Compass, color: 'from-emerald-400 to-teal-500', glow: '#10b981' },
  { xp: 500, title: 'Scout', icon: Sword, color: 'from-cyan-400 to-sky-500', glow: '#06b6d4' },
  { xp: 1200, title: 'Guardian', icon: Shield, color: 'from-blue-400 to-indigo-500', glow: '#3b82f6' },
  { xp: 2500, title: 'Vanguard', icon: Swords, color: 'from-violet-400 to-purple-500', glow: '#8b5cf6' },
  { xp: 3500, title: 'Elite', icon: Crown, color: 'from-fuchsia-400 to-pink-500', glow: '#d946ef' },
  { xp: 4250, title: 'Champion', icon: Trophy, color: 'from-rose-400 to-red-500', glow: '#f43f5e' },
  { xp: 5000, title: 'Titan', icon: Zap, color: 'from-amber-400 to-yellow-500', glow: '#f59e0b' },
  { xp: 7500, title: 'Mythic', icon: Sparkles, color: 'from-orange-400 to-red-600', glow: '#f97316' },
  { xp: 10000, title: 'Immortal', icon: InfinityIcon, color: 'from-slate-200 to-white', glow: '#ffffff' },
];

export default function RankProgressPage() {
  const { profile } = useAuth();
  const totalXp = profile?.totalxp || 0;

  const currentRankIndex = RANKS.findLastIndex((r) => totalXp >= r.xp);
  const currentRankData = currentRankIndex === -1 ? { title: 'Beginner', xp: 0, icon: Sparkles, color: 'from-primary to-blue-600', glow: '#3b82f6' } : RANKS[currentRankIndex];
  const nextRank = RANKS[currentRankIndex + 1] || null;

  let progressToNext = 0;
  if (nextRank) {
    const floor = currentRankIndex === -1 ? 0 : RANKS[currentRankIndex].xp;
    const range = nextRank.xp - floor;
    const progress = totalXp - floor;
    progressToNext = Math.min((progress / range) * 100, 100);
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col pb-24">
      {/* Starry Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Header Area */}
      <div className="relative z-10 p-4 md:p-6 flex items-center justify-between">
        <Button asChild variant="ghost" className="text-white hover:bg-white/10 rounded-full h-10 px-4">
          <Link href="/home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Academy</p>
          <h1 className="text-lg md:text-xl font-black uppercase tracking-tight">Rank Journey</h1>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 gap-12">
        
        {/* HERO RANK CARD - Centered with 1/4 spacing on sides (w-1/2 on desktop) */}
        <div className="w-full flex justify-center mt-4">
          <Card className="w-full md:w-1/2 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 backdrop-blur-xl border-2 border-white/10 overflow-hidden rounded-[2rem] shadow-2xl">
            <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="relative flex-shrink-0">
                <div className={cn(
                  "w-24 h-24 md:w-28 md:h-28 rounded-[2rem] flex items-center justify-center bg-primary/20 border-4 border-primary/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]",
                  "current-rank"
                )}>
                  <currentRankData.icon className="w-12 h-12 md:w-14 md:h-14 text-primary" />
                </div>
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left w-full">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                    {currentRankData.title}
                  </h2>
                  <p className="text-xs font-black text-primary uppercase tracking-widest">
                      {totalXp} Total XP
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Progress</span>
                    {nextRank && <span>{totalXp} / {nextRank.xp} XP</span>}
                  </div>
                  <Progress value={progressToNext} className="h-3 bg-white/5 border border-white/5 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VERTICAL EXPEDITION ROADMAP */}
        <div className="flex flex-col items-center relative py-12">
          {/* Connecting Curved Line */}
          <div className="absolute inset-0 z-0 flex justify-center">
            <svg width="400" height="100%" className="opacity-20" preserveAspectRatio="none">
              <path
                d={`M 200,0 ${RANKS.map((_, i) => {
                  const x = i % 2 === 0 ? 100 : 300;
                  const y = (i + 1) * 200;
                  const prevX = i === 0 ? 200 : (i % 2 !== 0 ? 100 : 300);
                  const prevY = i * 200;
                  const cpY = (prevY + y) / 2;
                  return `C ${prevX},${cpY} ${x},${cpY} ${x},${y}`;
                }).join(' ')}`}
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray="12 12"
              />
            </svg>
          </div>

          <div className="space-y-[150px] w-full max-w-md relative z-10">
            {RANKS.map((rank, index) => {
              const isAchieved = totalXp >= rank.xp;
              const isCurrent = index === currentRankIndex;
              const Icon = rank.icon;
              const side = index % 2 === 0 ? 'left' : 'right';

              return (
                <motion.div
                  key={rank.xp}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center w-full",
                    side === 'left' ? 'justify-start' : 'justify-end'
                  )}
                >
                  <div className={cn(
                    "flex flex-col items-center gap-4 group",
                    side === 'left' ? 'mr-[20%]' : 'ml-[20%]'
                  )}>
                    {/* Rank Node */}
                    <div className="relative">
                      <motion.div
                        className={cn(
                          "w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] flex items-center justify-center relative z-10 transition-all duration-500 border",
                          isAchieved 
                            ? cn("bg-slate-900 shadow-xl border-white/20", isCurrent && "current-rank") 
                            : "bg-slate-800/50 border-white/5 grayscale opacity-30"
                        )}
                        style={isAchieved ? {
                          borderColor: isCurrent ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                          boxShadow: isAchieved ? `0 0 20px ${rank.glow}33` : 'none'
                        } : {}}
                      >
                        <div className={cn(
                          "absolute inset-0 rounded-[inherit] opacity-10",
                          isAchieved ? `bg-gradient-to-br ${rank.color}` : "bg-transparent"
                        )} />
                        
                        <Icon 
                          className={cn(
                            "w-10 h-10 md:w-12 md:h-12 relative z-20",
                            isAchieved ? "text-white" : "text-muted-foreground"
                          )} 
                          style={isAchieved ? { filter: `drop-shadow(0 0 8px ${rank.glow})` } : {}}
                        />

                        {!isAchieved && (
                          <div className="absolute -bottom-1 -right-1 bg-slate-900 p-1.5 rounded-lg border border-white/10 shadow-2xl z-30">
                            <Lock className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                        
                        {isAchieved && !isCurrent && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-lg shadow-2xl border-2 border-slate-950 z-30">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </motion.div>

                      {/* Label Section */}
                      <div className={cn(
                        "absolute top-1/2 -translate-y-1/2 w-32",
                        side === 'left' ? 'left-full ml-6 text-left' : 'right-full mr-6 text-right'
                      )}>
                        <h4 className={cn(
                          "text-sm font-black uppercase tracking-widest",
                          isAchieved ? "text-white" : "text-slate-600"
                        )}>
                          {rank.title}
                        </h4>
                        <p className={cn(
                          "text-[10px] font-bold uppercase",
                          isAchieved ? "text-primary" : "text-slate-700"
                        )}>
                          {isAchieved ? 'Mastered' : `${rank.xp} XP`}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar under current node */}
                    {isCurrent && nextRank && (
                      <motion.div 
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        className="w-32 space-y-1.5 pt-2"
                      >
                        <div className="flex justify-between text-[8px] font-black uppercase text-primary/80">
                          <span>{totalXp} XP</span>
                          <span>{nextRank.xp} XP</span>
                        </div>
                        <Progress value={progressToNext} className="h-1.5 bg-white/5" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
