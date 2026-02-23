'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const RANKS = [
  { xp: 100, title: 'Wanderer', icon: Compass, x: '50%' },
  { xp: 500, title: 'Scout', icon: Zap, x: '20%' },
  { xp: 1200, title: 'Guardian', icon: Shield, x: '20%' },
  { xp: 2500, title: 'Vanguard', icon: Sword, x: '50%' },
  { xp: 3500, title: 'Elite', icon: Crown, x: '80%' },
  { xp: 4250, title: 'Champion', icon: Trophy, x: '50%' },
  { xp: 5000, title: 'Titan', icon: Hand, x: '80%' },
  { xp: 7500, title: 'Immortal', icon: InfinityIcon, x: '20%' },
  { xp: 10000, title: 'Mythic', icon: Sparkles, x: '50%' },
];

export default function RankProgressPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const totalXp = profile?.totalxp || 0;

  const currentRankIndex = RANKS.findIndex((r, i) => {
    const nextRank = RANKS[i + 1];
    return totalXp >= r.xp && (!nextRank || totalXp < nextRank.xp);
  });

  const nextRank = RANKS[currentRankIndex + 1] || null;
  const currentRankData = currentRankIndex === -1 ? { title: 'Beginner', xp: 0 } : RANKS[currentRankIndex];

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
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden flex flex-col">
      {/* Background Starry Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
      </div>

      <header className="relative z-20 p-4 md:p-8 flex items-center justify-between">
        <Button asChild variant="ghost" className="text-white hover:bg-white/10 rounded-full">
          <Link href="/home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">Current Title</p>
          <h2 className="text-xl font-black uppercase tracking-tight text-white">{currentRankData.title}</h2>
        </div>
      </header>

      <div className="flex-1 relative overflow-y-auto pb-40 pt-10 px-4">
        {/* SVG Path Connector (Adjusted for tighter spacing) */}
        <div className="absolute inset-0 z-0 flex justify-center pointer-events-none">
          <svg className="w-full max-w-md h-[1200px]" viewBox="0 0 100 1200" fill="none">
            <motion.path
              d="M 50 1100 Q 20 1000 20 950 T 50 800 T 80 650 T 50 500 T 20 350 T 50 200 T 80 100 T 50 50"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="2"
              strokeDasharray="10 10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="max-w-md mx-auto space-y-16 relative z-10 flex flex-col-reverse items-center">
          {RANKS.map((rank, index) => {
            const isReached = totalXp >= rank.xp;
            const isCurrent = index === currentRankIndex;
            const isLocked = !isReached;
            const Icon = rank.icon;

            return (
              <motion.div
                key={rank.xp}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-col items-center relative w-full"
                style={{ 
                    left: rank.x === '50%' ? '0' : rank.x === '20%' ? '-25%' : '25%',
                    marginBottom: '2rem'
                }}
              >
                {/* Hexagon Node */}
                <div 
                  onClick={() => handleLockedClick(rank)}
                  className={cn(
                    "w-20 h-24 flex items-center justify-center cursor-pointer transition-all duration-500 relative group",
                    isReached ? "bg-gradient-to-br from-blue-500/40 to-indigo-600/40 border-2 border-blue-400/50 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.3)]" : "bg-slate-800/50 border-2 border-slate-700/50 grayscale opacity-60",
                    isCurrent && "current-rank scale-110 shadow-[0_0_40px_rgba(251,191,36,0.4)]"
                  )}
                  style={{
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon className={cn("h-8 w-8", isReached ? "text-white" : "text-slate-400/50")} />
                  </div>

                  {/* Corner Status Icon */}
                  <div className="absolute bottom-3 right-3">
                    {isReached && !isCurrent ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400 fill-green-400/20" />
                    ) : isLocked ? (
                      <Lock className="h-3 w-3 text-slate-500" />
                    ) : null}
                  </div>
                </div>

                {/* Text Labels */}
                <div className="mt-3 text-center">
                  <h3 className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isReached ? "text-white" : "text-slate-500"
                  )}>
                    {rank.title}
                  </h3>
                  {isCurrent && (
                    <p className="text-[7px] font-black text-primary uppercase animate-pulse mt-0.5">You Are Here</p>
                  )}
                  <p className="text-[9px] font-bold text-slate-400 mt-0.5">{rank.xp} XP</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0e1a] to-transparent pointer-events-none">
        <div className="max-w-md mx-auto bg-slate-900/80 backdrop-blur-md border-2 border-white/5 p-4 rounded-2xl pointer-events-auto shadow-2xl">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
            <span className="text-slate-400">{totalXp} XP Collected</span>
            <span className="text-primary">{nextRank ? `${Math.round(progressToNext)}% to ${nextRank.title}` : 'Max Rank Reached'}</span>
          </div>
          <Progress value={progressToNext} className="h-2 bg-slate-800" />
          <p className="text-center text-[8px] text-slate-500 mt-2 font-bold uppercase tracking-tighter">
            {nextRank ? `${nextRank.xp - totalXp} XP until next milestone` : 'You have reached the ultimate peak!'}
          </p>
        </div>
      </div>
    </div>
  );
}
