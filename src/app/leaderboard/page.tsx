
'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Loader2, ShieldX, Home, Trophy, Zap, Lock, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, generateAvatarColor } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ensureWeeklyXPReset } from '@/app/quiz/actions';

type LeaderboardType = 'weeklyxp' | 'totalxp';

const renderRank = (rank: number) => {
  const size = 'h-6 w-6';
  if (rank === 0) return <Crown className={cn(size, "text-yellow-400 fill-yellow-400")} />;
  if (rank === 1) return <Crown className={cn(size, "text-gray-400 fill-gray-400")} />;
  if (rank === 2) return <Crown className={cn(size, "text-orange-400 fill-orange-400")} />;
  return <span className="font-bold text-lg text-foreground">{rank + 1}</span>;
};

function UserList({ users, type }: { users: UserProfile[], type: LeaderboardType}) {
  if (users.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <Trophy className="h-8 w-8 text-muted-foreground opacity-20" />
            </div>
            <p className="text-muted-foreground font-bold">The leaderboard is empty. Be the first to join!</p>
        </div>
    )
  }

  return (
    <div className="space-y-2 pt-2">
      {users.map((u, index) => {
        const avatarColor = generateAvatarColor(u.uid);
        return (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            key={u.uid} 
            className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-card hover:bg-secondary/50 transition-all border-2 border-transparent hover:border-primary/10"
          >
            <div className="w-8 text-center flex-shrink-0 flex items-center justify-center">
              {renderRank(index)}
            </div>
            <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-background">
              <AvatarImage src={''} />
              <AvatarFallback style={{backgroundColor: avatarColor}} className="text-white font-black text-xs">
                {u.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Link 
                href={`/profile/${u.uid}`} 
                className="font-black flex-1 truncate text-foreground hover:text-primary transition-colors"
            >
                {u.username || 'Anonymous'}
            </Link>
            <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full">
                <p className="font-black text-foreground tabular-nums whitespace-nowrap text-sm">
                    {type === 'weeklyxp' ? (u.weeklyxp || 0) : (u.totalxp || 0)}
                </p>
                <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function WeeklyLockMessage() {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 text-center space-y-6"
        >
            <div className="relative inline-block">
                <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center border-4 border-dashed border-primary/30">
                    <Lock className="h-10 w-10 text-primary" />
                </div>
                <Zap className="absolute -top-2 -right-2 h-8 w-8 text-yellow-500 animate-pulse" />
            </div>
            
            <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight">Leaderboard Locked</h3>
                <p className="text-muted-foreground text-sm font-bold leading-relaxed max-w-xs mx-auto">
                    You need to complete at least <span className="text-primary">one lesson</span> this week to unlock the rankings and see how you stack up!
                </p>
            </div>

            <Button asChild className="rounded-full px-8 h-14 font-black shadow-primary/20 group">
                <Link href="/quiz">
                    Start Learning
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
            </Button>
        </motion.div>
    )
}

export default function LeaderboardPage() {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('weeklyxp');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      // JIT reset for the current user
      await ensureWeeklyXPReset(user.uid);

      const usersRef = collection(db, 'users');
      // Simple ordering queries that don't require composite indexes
      const q = query(
        usersRef, 
        orderBy(leaderboardType, 'desc'), 
        limit(50)
      );
      
      try {
        const querySnapshot = await getDocs(q);
        const leaderboardUsers: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          leaderboardUsers.push({ uid: doc.id, ...doc.data() } as UserProfile);
        });
        setUsers(leaderboardUsers);
      } catch (e: any) {
        console.error("Leaderboard Error:", e);
        setError("An error occurred while fetching rankings.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [leaderboardType, user, authLoading]);
  
  if (authLoading) {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-6 md:py-12">
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="animate-spin h-10 w-10 text-primary"/>
            </div>
        </div>
     )
  }

  if (!user || !profile) {
      return (
        <div className="container mx-auto max-w-3xl px-4 py-6 md:py-12">
             <Card className="border-4 rounded-[2.5rem]">
                <CardHeader className="text-center p-10">
                    <CardTitle className="font-black text-3xl text-primary uppercase">Leaderboard</CardTitle>
                    <Alert variant="destructive" className="mt-6 rounded-2xl">
                        <ShieldX className="h-4 w-4" />
                        <AlertTitle>Access Denied</AlertTitle>
                        <AlertDescription>Please sign in to view the rankings.</AlertDescription>
                    </Alert>
                </CardHeader>
                 <CardFooter className="justify-center pb-10">
                    <Button asChild variant="outline" className="border-2 rounded-full px-8">
                        <Link href="/">Back to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      )
  }

  // Participation Lock Logic: User only sees weekly rankings if they have XP this week
  const userHasWeeklyXp = (profile?.weeklyxp || 0) > 0;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-12 pb-32">
      <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Hall of <span className="text-primary">Mastery</span></h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Competing with the best in your grade</p>
      </div>

      <Card className="border-4 rounded-[2.5rem] shadow-[0_12px_0_0_rgba(0,0,0,0.05)] overflow-hidden">
        <CardHeader className="bg-secondary/10 border-b-4 pb-0 p-4 md:p-8">
          <Tabs value={leaderboardType} onValueChange={(value) => setLeaderboardType(value as LeaderboardType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-secondary rounded-2xl mb-6">
              <TabsTrigger value="weeklyxp" className="font-black uppercase text-[10px] tracking-widest rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary h-10 transition-all">Weekly</TabsTrigger>
              <TabsTrigger value="totalxp" className="font-black uppercase text-[10px] tracking-widest rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary h-10 transition-all">All-Time</TabsTrigger>
            </TabsList>
            
            <div className="pb-4">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <Loader2 className="animate-spin h-8 w-8 text-primary"/>
                    </div>
                ) : error ? (
                    <Alert variant="destructive" className="rounded-2xl border-2">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <>
                        {leaderboardType === 'weeklyxp' && !userHasWeeklyXp ? (
                            <WeeklyLockMessage />
                        ) : (
                            <UserList users={users} type={leaderboardType} />
                        )}
                    </>
                )}
            </div>
          </Tabs>
        </CardHeader>
        
        <CardFooter className="justify-center bg-secondary/5 pt-6 pb-6">
            <Button asChild variant="ghost" className="rounded-full px-8 font-bold text-muted-foreground hover:text-primary">
                <Link href="/home">
                    <Home className="mr-2 h-4 w-4" />
                    Return Home
                </Link>
            </Button>
        </CardFooter>
      </Card>

      {!loading && !error && (leaderboardType === 'totalxp' || userHasWeeklyXp) && (
          <AnimatePresence>
            <motion.div 
                className="fixed bottom-6 left-4 right-4 md:left-auto md:right-auto md:w-full md:max-w-2xl z-40 mx-auto"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
            >
                <Card className="shadow-2xl border-primary border-4 bg-background/90 backdrop-blur-md rounded-[2rem]">
                    <CardContent className="p-3 px-6 flex items-center gap-4">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary rounded-2xl flex items-center justify-center font-black text-white">
                            {(() => {
                                const rank = users.findIndex(u => u.uid === user.uid);
                                return rank !== -1 ? rank + 1 : '-';
                            })()}
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-sm uppercase tracking-tight">Your Rank</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Keep it up!</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-primary/10 px-4 py-2 rounded-2xl border-2 border-primary/20">
                            <span className="font-black text-primary tabular-nums">
                                {leaderboardType === 'weeklyxp' ? (profile?.weeklyxp || 0) : (profile?.totalxp || 0)}
                            </span>
                            <Zap className="h-4 w-4 text-primary fill-primary" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
          </AnimatePresence>
      )}
    </div>
  );
}
