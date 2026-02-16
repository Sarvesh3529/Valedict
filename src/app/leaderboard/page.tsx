'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Loader2, ShieldX, Home } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type LeaderboardType = 'weeklyxp' | 'totalxp';

const renderRank = (rank: number) => {
  const size = 'h-6 w-6';
  if (rank === 0) return <Crown className={cn(size, "text-yellow-400 fill-yellow-400")} />;
  if (rank === 1) return <Crown className={cn(size, "text-gray-400 fill-gray-400")} />;
  if (rank === 2) return <Crown className={cn(size, "text-orange-400 fill-orange-400")} />;
  return <span className="font-bold text-lg">{rank + 1}</span>;
};

export default function LeaderboardPage() {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('weeklyxp');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      const field = leaderboardType;
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy(field, 'desc'), limit(50));
      
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
  }, [leaderboardType]);
  

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin"/></div>;
    }
    if (error) {
      return (
        <Alert variant="destructive" className="mt-4">
          <ShieldX className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    return <UserList users={users} type={leaderboardType} />;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Leaderboard</CardTitle>
          <CardDescription>See who's at the top of the class!</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={leaderboardType} onValueChange={(value) => setLeaderboardType(value as LeaderboardType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weeklyxp">Weekly</TabsTrigger>
              <TabsTrigger value="totalxp">All-Time</TabsTrigger>
            </TabsList>
            <TabsContent value="weeklyxp">{renderContent()}</TabsContent>
            <TabsContent value="totalxp">{renderContent()}</TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center pt-6">
            <Button asChild variant="outline">
                <Link href="/home">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Home
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function UserList({ users, type }: { users: UserProfile[], type: LeaderboardType}) {
  if (users.length === 0) {
    return <p className="text-center text-muted-foreground p-8">The leaderboard is empty. Complete a quiz to get started!</p>
  }

  return (
    <div className="space-y-2 pt-4">
      {users.map((u, index) => (
        <div key={u.uid} className="flex items-center gap-4 p-3 rounded-lg bg-card transition-all">
          <div className="w-8 text-center flex-shrink-0 flex items-center justify-center">
             {renderRank(index)}
          </div>
          <Avatar>
            <AvatarImage src={''} />
            <AvatarFallback>{u.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <p className="font-medium flex-1 break-words">{u.username || 'Anonymous User'}</p>
          <p className="font-bold text-primary">{type === 'weeklyxp' ? (u.weeklyxp || 0) : (u.totalxp || 0)} XP</p>
        </div>
      ))}
    </div>
  )
}
