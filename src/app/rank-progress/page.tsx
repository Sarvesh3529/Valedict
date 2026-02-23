'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Lock, CheckCircle2, Star, Map, Binoculars, ShieldCheck, Sword, Gem, Trophy, Mountain, Infinity, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const RANKS = [
  { xp: 100, title: 'Wanderer', icon: Map },
  { xp: 500, title: 'Scout', icon: Binoculars },
  { xp: 1200, title: 'Guardian', icon: ShieldCheck },
  { xp: 2500, title: 'Vanguard', icon: Sword },
  { xp: 3500, title: 'Elite', icon: Gem },
  { xp: 4250, title: 'Champion', icon: Trophy },
  { xp: 5000, title: 'Titan', icon: Mountain },
  { xp: 7500, title: 'Immortal', icon: Infinity },
  { xp: 10000, title: 'Mythic', icon: Zap },
];

export default function RankProgressPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const totalXp = profile?.totalxp || 0;

  // Find current rank index
  const currentRankIndex = RANKS.findIndex((r, i) => {
    const nextRank = RANKS[i + 1];
    return totalXp >= r.xp && (!nextRank || totalXp < nextRank.xp);
  });

  const currentRank = currentRankIndex === -1 ? { title: 'Beginner', xp: 0 } : RANKS[currentRankIndex];
  const nextRank = RANKS[currentRankIndex + 1] || null;

  // Calculate progress to next rank
  let progressToNext = 0;
  if (nextRank) {
    const range = nextRank.xp - (currentRankIndex === -1 ? 0 : RANKS[currentRankIndex].xp);
    const progress = totalXp - (currentRankIndex === -1 ? 0 : RANKS[currentRankIndex].xp);
    progressToNext = Math.min((progress / range) * 100, 100);
  }

  const handleLockedClick = (rank: typeof RANKS[0]) => {
    if (totalXp < rank.xp) {
      toast({
        title: "Rank Locked",
        description: `Earn ${rank.xp - totalXp} more XP to unlock the ${rank.title} title!`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Dynamic Header / Hero Card */}
      <div className="container max-w-4xl mx-auto px-4 pt-8 md:pt-12 space-y-6">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card className="border-4 border-primary/20 bg-secondary/10 overflow-hidden rounded-[2.5rem] relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Star className="h-32 w-32" />
          </div>
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary/30">
                <Star className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Expedition Hero
                </h1>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
                  {profile?.username}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest">
                    {currentRank.title}
                  </span>
                  <span className="text-lg font-bold text-muted-foreground">
                    {totalXp} Total XP
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vertical Expedition Roadmap */}
      <div className="relative mt-16 max-w-lg mx-auto px-4">
        {/* The Curved Path (Simplified centered line) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 border-l-4 border-dashed border-muted/30 pointer-events-none" />

        <div className="space-y-24 relative pb-20">
          {RANKS.map((rank, index) => {
            const isReached = totalXp >= rank.xp;
            const isCurrent = index === currentRankIndex;
            const isLocked = !isReached;
            const Icon = rank.icon;

            return (
              <motion.div
                key={rank.xp}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div 
                  onClick={() => handleLockedClick(rank)}
                  className={cn(
                    "relative z-10 w-24 h-24 rounded-[2rem] flex items-center justify-center cursor-pointer transition-all duration-500",
                    isReached ? "glass-card bg-gradient-to-br from-yellow-400/40 to-orange-500/40 border-2" : "bg-slate-200 dark:bg-slate-800 grayscale border-2 border-slate-300 dark:border-slate-700",
                    isCurrent && "current-rank scale-110"
                  )}
                >
                  {isLocked ? (
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <Icon className={cn("h-10 w-10", isReached ? "text-yellow-500" : "text-muted-foreground")} />
                  )}
                  
                  {isReached && !isCurrent && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-background">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <h3 className={cn(
                    "text-xl font-black uppercase tracking-tight",
                    isReached ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {rank.title}
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {rank.xp} XP
                  </p>
                </div>

                {/* Progress Bar under Current Rank */}
                {isCurrent && nextRank && (
                  <div className="w-64 mt-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-primary">Next: {nextRank.title}</span>
                      <span>{Math.round(progressToNext)}%</span>
                    </div>
                    <Progress value={progressToNext} className="h-3 border-2 border-primary/10 shadow-sm" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}