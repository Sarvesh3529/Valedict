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
  Sparkles,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';

const RANKS = [
  { xp: 100, title: 'Wanderer', icon: Compass, x: '50%' },   // Center Start
  { xp: 500, title: 'Scout', icon: Zap, x: '30%' },         // Left Peak
  { xp: 1200, title: 'Guardian', icon: Shield, x: '70%' },  // Right Peak
  { xp: 2500, title: 'Vanguard', icon: Sword, x: '30%' },   // Left Peak
  { xp: 3500, title: 'Elite', icon: Crown, x: '70%' },      // Right Peak
  { xp: 4250, title: 'Champion', icon: Trophy, x: '30%' },  // Left Peak
  { xp: 5000, title: 'Titan', icon: Hand, x: '70%' },       // Right Peak
  { xp: 7500, title: 'Immortal', icon: InfinityIcon, x: '30%' }, // Left Peak
  { xp: 10000, title: 'Mythic', icon: Sparkles, x: '50%' },  // Center Finish
];

export default function RankProgressPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const roadmapRef = useRef<HTMLDivElement>(null);
  const totalXp = profile?.totalxp || 0;

  const currentRankIndex = RANKS.findLastIndex((r) => totalXp >= r.xp);

  const nextRank = RANKS[currentRankIndex + 1] || null;
  const currentRankData = currentRankIndex === -1 ? { title: 'Beginner', xp: 0, icon: Compass } : RANKS[currentRankIndex];
  const CurrentIcon = currentRankData.icon;

  let progressToNext = 0;
  if (nextRank) {
    const floor = currentRankIndex === -1 ? 0 : RANKS[currentRankIndex].xp;
    const range = nextRank.xp - floor;
    const progress = totalXp - floor;
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

  const scrollToRoadmap = () => {
    roadmapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-x-hidden">
      {/* Starry Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* LEFT PANEL: Hero Battle Card */}
        <aside className="w-full lg:w-[350px] lg:fixed lg:left-0 lg:top-0 lg:h-screen p-6 flex flex-col bg-gradient-to-b from-blue-900/20 to-transparent border-r border-white/5 backdrop-blur-sm overflow-y-auto items-center">
          <div className="w-full mb-6">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 rounded-full h-10 px-4">
              <Link href="/home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Exit Journey
              </Link>
            </Button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-6 w-full py-4">
            <div className="text-center space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Active Ranking</p>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight drop-shadow-2xl">
                {currentRankData.title}
              </h1>
            </div>

            {/* Battle Card Graphic */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-52 h-64 flex items-center justify-center rounded-[2rem] border-4 border-yellow-500/30 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 backdrop-blur-xl shadow-[0_0_40px_rgba(251,191,36,0.15)] group overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/stars/400/600')] opacity-10 mix-blend-overlay"></div>
              <CurrentIcon className="w-24 h-24 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10" />
              
              {/* Inner Gloss */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            </motion.div>

            {/* XP Stats */}
            <div className="w-full max-w-[240px] space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total XP</p>
                  <p className="text-2xl font-black tabular-nums">{totalXp}</p>
                </div>
                {nextRank && (
                  <div className="text-right space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary">Next Rank</p>
                    <p className="text-[10px] font-bold text-slate-400">{nextRank.title}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Progress value={progressToNext} className="h-2 bg-slate-800" />
                <p className="text-center text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                  {nextRank ? `${nextRank.xp - totalXp} XP until ${nextRank.title}` : 'Peak level achieved'}
                </p>
              </div>
            </div>

            <Button 
              onClick={scrollToRoadmap}
              className="w-full max-w-[240px] h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-2 shadow-xl bg-primary hover:bg-primary/90"
            >
              View Roadmap
              <ChevronDown className="ml-2 h-3 w-3 animate-bounce" />
            </Button>
          </div>
        </aside>

        {/* RIGHT PANEL: Roadmap Section */}
        <main ref={roadmapRef} className="flex-1 lg:ml-[350px] relative pb-40 pt-10 px-6 md:px-16 overflow-x-hidden">
          <div className="max-w-2xl mx-auto relative">
            {/* SVG Path Connector (Adjusted for narrower amplitude) */}
            <div className="absolute inset-0 z-0 flex justify-center pointer-events-none">
              <svg className="w-full max-w-md h-full min-h-[1000px]" viewBox="0 0 100 1000" fill="none" preserveAspectRatio="none">
                <motion.path
                  d="M 50 950 Q 30 900 30 850 T 70 750 T 30 650 T 70 550 T 30 450 T 70 350 T 30 250 T 50 150"
                  stroke="rgba(251, 191, 36, 0.2)"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </div>

            {/* Expedition Path Nodes */}
            <div className="space-y-12 relative z-10 flex flex-col-reverse items-center pt-10">
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
                        left: rank.x === '50%' ? '0' : rank.x === '30%' ? '-20%' : '20%'
                    }}
                  >
                    {/* Hexagon Node */}
                    <div 
                      onClick={() => handleLockedClick(rank)}
                      className={cn(
                        "w-20 h-24 flex items-center justify-center cursor-pointer transition-all duration-500 relative group",
                        isReached ? "bg-gradient-to-br from-yellow-500/40 to-orange-600/40 border-2 border-yellow-400/50 backdrop-blur-xl shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "bg-slate-800/50 border-2 border-slate-700/50 grayscale opacity-60",
                        isCurrent && "current-rank scale-110 shadow-[0_0_30px_rgba(251,191,36,0.5)]"
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
                        <p className="text-[7px] font-black text-yellow-400 uppercase animate-pulse mt-0.5">You Are Here</p>
                      )}
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">{rank.xp} XP</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
