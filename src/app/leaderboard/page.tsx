'use client';
import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Loader2, ShieldX, Home } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, generateAvatarColor } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    return <p className="text-center text-muted-foreground p-8 text-sm">The leaderboard is empty. Complete a quiz to get started!</p>
  }

  return (
    <div className="space-y-2 pt-4">
      {users.map((u, index) => {
        const avatarColor = generateAvatarColor(u.uid);
        return (
          <div key={u.uid} className="flex items-center gap-4 p-3 rounded-lg bg-card hover:bg-secondary/50 transition-all border border-transparent hover:border-primary/20">
            <Avatar className="h-10 w-10">
              <AvatarImage src={''} />
              <AvatarFallback style={{backgroundColor: avatarColor}} className="text-white font-bold">
                {u.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="w-8 text-center flex-shrink-0 flex items-center justify-center">
              {renderRank(index)}
            </div>
            <Link 
                href={`/profile/${u.uid}`} 
                className="font-bold flex-1 break-words text-foreground hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors"
            >
                {u.username || 'Anonymous User'}
            </Link>
            <p className="font-black text-foreground tabular-nums">{type === 'weeklyxp' ? (u.weeklyxp || 0) : (u.totalxp || 0)} XP</p>
          </div>
        )
      })}
    </div>
  )
}

function CurrentUserBar({ users, type }: { users: UserProfile[], type: LeaderboardType }) {
  const { user } = useAuth();
  const currentUserData = useMemo(() => {
    if (!user) return null;
    const rank = users.findIndex(u => u.uid === user.uid);
    if (rank === -1) return null;
    return { ...users[rank], rank };
  }, [users, user]);

  if (!currentUserData) return null;
  
  const avatarColor = generateAvatarColor(currentUserData.uid);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-[4.5rem] md:bottom-4 left-4 right-4 md:left-auto md:right-auto md:w-full md:max-w-2xl z-40"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      >
        <Card className="shadow-2xl border-primary bg-background/90 backdrop-blur-md">
          <CardContent className="p-0">
            <div className="flex items-center gap-4 p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={''} />
                <AvatarFallback style={{backgroundColor: avatarColor}} className="text-white font-bold">
                    {currentUserData.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="w-8 text-center flex-shrink-0 flex items-center justify-center">
                <span className="font-black text-lg text-primary">{currentUserData.rank + 1}</span>
              </div>
              <p className="font-black flex-1 break-words text-foreground">You</p>
              <p className="font-black text-primary tabular-nums">{type === 'weeklyxp' ? (currentUserData.weeklyxp || 0) : (currentUserData.totalxp || 0)} XP</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}


export default function LeaderboardPage() {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('weeklyxp');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy(leaderboardType, 'desc'), limit(50));
      
      try {
        const querySnapshot = await getDocs(q);
        const leaderboardUsers: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          leaderboardUsers.push({ uid: doc.id, ...doc.data() } as UserProfile);
        });
        setUsers(leaderboardUsers);
      } catch (e: any) {
        if (e.code === 'permission-denied') {
          setError("You don't have permission to view the leaderboard. This may be due to security rules.");
        } else {
          setError("An error occurred while fetching the leaderboard.");
        }
        console.error("Leaderboard Error:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [leaderboardType, user, authLoading]);
  
  if (authLoading) {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-6 md:py-12">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-black text-2xl md:text-3xl text-primary uppercase">Leaderboard</CardTitle>
                    <CardDescription>See who's at the top of the class!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center p-8 min-h-[300px]">
                        <Loader2 className="animate-spin h-8 w-8 text-primary"/>
                    </div>
                </CardContent>
            </Card>
        </div>
     )
  }

  if (!user) {
      return (
        <div className="container mx-auto max-w-3xl px-4 py-6 md:py-12">
             <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-black text-2xl md:text-3xl text-primary uppercase">Leaderboard</CardTitle>
                    <CardDescription>See who's at the top of the class!</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive" className="mt-4">
                        <ShieldX className="h-4 w-4" />
                        <AlertTitle>Access Denied</AlertTitle>
                        <AlertDescription>You must be logged in to view the leaderboard.</AlertDescription>
                    </Alert>
                </CardContent>
                 <CardFooter className="justify-center">
                    <Button asChild variant="outline">
                        <Link href="/home">
                            <Home className="mr-2 h-4 w-4" />
                            Go to Home
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      )
  }

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center p-8 min-h-[300px]"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>;
    }
    if (error) {
      return (
        <Alert variant="destructive" className="mt-4">
          <ShieldX className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    return <UserList users={users} type={leaderboardType} />;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-12 pb-32 md:pb-28">
      <Card className="border-2 border-border shadow-[0_8px_0_0_rgba(0,0,0,0.05)]">
        <CardHeader className="text-center border-b-2 bg-secondary/10">
          <CardTitle className="font-black text-2xl md:text-3xl text-primary uppercase tracking-wider">Leaderboard</CardTitle>
          <CardDescription className="font-bold text-muted-foreground">Competing with the best in Class!</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs value={leaderboardType} onValueChange={(value) => setLeaderboardType(value as LeaderboardType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-secondary rounded-xl mb-4">
              <TabsTrigger value="weeklyxp" className="font-black uppercase text-xs tracking-widest rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary">Weekly</TabsTrigger>
              <TabsTrigger value="totalxp" className="font-black uppercase text-xs tracking-widest rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary">All-Time</TabsTrigger>
            </TabsList>
            <TabsContent value="weeklyxp">{renderContent()}</TabsContent>
            <TabsContent value="totalxp">{renderContent()}</TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center border-t-2 pt-6">
            <Button asChild variant="outline" className="border-2">
                <Link href="/home">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Home
                </Link>
            </Button>
        </CardFooter>
      </Card>
      {!loading && !error && <CurrentUserBar users={users} type={leaderboardType} />}
    </div>
  );
}
